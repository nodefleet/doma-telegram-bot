const logger = require('../utils/logger');
const DomaService = require('./domaService');

class SubscriptionService {
  constructor() {
    this.subscriptions = new Map(); // userId -> { domains: Set, preferences: Object }
    this.domainWatchers = new Map(); // domain -> Set of userIds
    this.domaService = new DomaService();
    this.eventCheckInterval = 30000; // Check for events every 30 seconds
    this.isMonitoring = false;
    
    // Periodic report intervals (in milliseconds)
    this.reportIntervals = {
      '10min': 10 * 60 * 1000,      // 10 minutes
      '30min': 30 * 60 * 1000,      // 30 minutes
      '12h': 12 * 60 * 60 * 1000,   // 12 hours
      '1day': 24 * 60 * 60 * 1000   // 1 day
    };
    
    this.reportTimers = new Map(); // userId -> timer reference
  }

  /**
   * Subscribe user to domain events
   * @param {number} userId - Telegram user ID
   * @param {string} domain - Domain to track
   * @param {Object} preferences - Alert preferences
   */
  async subscribe(userId, domain, preferences = {}) {
    try {
      // Initialize user subscription if not exists
      if (!this.subscriptions.has(userId)) {
        this.subscriptions.set(userId, {
          domains: new Set(),
          preferences: {
            priceAlerts: true,
            expirationAlerts: true,
            saleAlerts: true,
            transferAlerts: true,
            scoreThreshold: 80, // Default to 80 - alert when score drops below this
            reportInterval: '30min', // Default to 30 minutes
            periodicReports: true
          }
        });
      }

      const userSub = this.subscriptions.get(userId);
      
      // Add domain to user's subscriptions
      userSub.domains.add(domain);
      
      // Update preferences
      userSub.preferences = { ...userSub.preferences, ...preferences };

      // Add user to domain watchers
      if (!this.domainWatchers.has(domain)) {
        this.domainWatchers.set(domain, new Set());
      }
      this.domainWatchers.get(domain).add(userId);

      // Start monitoring if not already running
      if (!this.isMonitoring) {
        this.startEventMonitoring();
      }

      // Start periodic reports for this user
      this.startPeriodicReports(userId);

      logger.info(`User ${userId} subscribed to domain ${domain}`);
      return { success: true, message: `Successfully subscribed to ${domain}` };

    } catch (error) {
      logger.error(`Error subscribing user ${userId} to ${domain}:`, error);
      return { success: false, message: `Failed to subscribe: ${error.message}` };
    }
  }

  /**
   * Unsubscribe user from domain events
   * @param {number} userId - Telegram user ID
   * @param {string} domain - Domain to stop tracking
   */
  async unsubscribe(userId, domain) {
    try {
      if (!this.subscriptions.has(userId)) {
        return { success: false, message: 'No active subscriptions found' };
      }

      const userSub = this.subscriptions.get(userId);
      
      if (!userSub.domains.has(domain)) {
        return { success: false, message: `Not subscribed to ${domain}` };
      }

      // Remove domain from user's subscriptions
      userSub.domains.delete(domain);

      // Remove user from domain watchers
      if (this.domainWatchers.has(domain)) {
        this.domainWatchers.get(domain).delete(userId);
        
        // Clean up empty domain watchers
        if (this.domainWatchers.get(domain).size === 0) {
          this.domainWatchers.delete(domain);
        }
      }

      logger.info(`User ${userId} unsubscribed from domain ${domain}`);
      return { success: true, message: `Successfully unsubscribed from ${domain}` };

    } catch (error) {
      logger.error(`Error unsubscribing user ${userId} from ${domain}:`, error);
      return { success: false, message: `Failed to unsubscribe: ${error.message}` };
    }
  }

  /**
   * Get user's active subscriptions
   * @param {number} userId - Telegram user ID
   */
  getUserSubscriptions(userId) {
    if (!this.subscriptions.has(userId)) {
      return { 
        domains: [], 
        preferences: {
          priceAlerts: false,
          expirationAlerts: false,
          saleAlerts: false,
          transferAlerts: false,
          scoreThreshold: 80,
          reportInterval: '30min',
          periodicReports: false
        }
      };
    }

    const userSub = this.subscriptions.get(userId);
    return {
      domains: Array.from(userSub.domains),
      preferences: userSub.preferences
    };
  }

  /**
   * Update user preferences
   * @param {number} userId - Telegram user ID
   * @param {Object} preferences - New preferences
   */
  updatePreferences(userId, preferences) {
    if (!this.subscriptions.has(userId)) {
      return { success: false, message: 'No active subscriptions found' };
    }

    const userSub = this.subscriptions.get(userId);
    userSub.preferences = { ...userSub.preferences, ...preferences };
    
    logger.info(`Updated preferences for user ${userId}`);
    return { success: true, message: 'Preferences updated successfully' };
  }

  /**
   * Start monitoring for domain events
   */
  startEventMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    logger.info('Started domain event monitoring');

    this.monitoringInterval = setInterval(async () => {
      await this.checkForEvents();
    }, this.eventCheckInterval);
  }

  /**
   * Stop monitoring for domain events
   */
  stopEventMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    logger.info('Stopped domain event monitoring');
  }

  /**
   * Check for domain events and send alerts
   */
  async checkForEvents() {
    try {
      for (const [domain, userIds] of this.domainWatchers) {
        await this.checkDomainEvents(domain, userIds);
      }
    } catch (error) {
      logger.error('Error checking for events:', error);
    }
  }

  /**
   * Check specific domain for events
   * @param {string} domain - Domain to check
   * @param {Set} userIds - Users watching this domain
   */
  async checkDomainEvents(domain, userIds) {
    try {
      // Get domain data from Doma API
      const domainData = await this.domaService.getDomainData(domain);
      const activities = await this.domaService.getDomainActivities(domain);
      const listings = await this.domaService.getDomainListings(domain);
      const offers = await this.domaService.getDomainOffers(domain);

      // Check for new events (simplified for now)
      const newEvents = this.detectNewEvents(domain, domainData, activities, listings, offers);
      
      if (newEvents.length > 0) {
        // Send alerts to all subscribed users
        for (const userId of userIds) {
          await this.sendEventAlert(userId, domain, newEvents);
        }
      }

    } catch (error) {
      logger.error(`Error checking events for domain ${domain}:`, error);
    }
  }

  /**
   * Detect new events for a domain
   * @param {string} domain - Domain name
   * @param {Object} domainData - Current domain data
   * @param {Array} activities - Domain activities
   * @param {Array} listings - Domain listings
   * @param {Array} offers - Domain offers
   */
  detectNewEvents(domain, domainData, activities, listings, offers) {
    const events = [];

    // Check for new activities
    if (activities && activities.length > 0) {
      const latestActivity = activities[0];
      if (this.isNewActivity(domain, latestActivity)) {
        events.push({
          type: 'ACTIVITY',
          message: `New activity detected: ${latestActivity.type}`,
          data: latestActivity
        });
      }
    }

    // Check for new listings
    if (listings && listings.length > 0) {
      const latestListing = listings[0];
      if (this.isNewListing(domain, latestListing)) {
        events.push({
          type: 'LISTING',
          message: `New listing: ${latestListing.price} ETH ($${latestListing.priceInUSD})`,
          data: latestListing
        });
      }
    }

    // Check for new offers
    if (offers && offers.length > 0) {
      const latestOffer = offers[0];
      if (this.isNewOffer(domain, latestOffer)) {
        events.push({
          type: 'OFFER',
          message: `New offer: ${latestOffer.price} ETH ($${latestOffer.priceInUSD})`,
          data: latestOffer
        });
      }
    }

    return events;
  }

  /**
   * Check if activity is new (simplified)
   */
  isNewActivity(domain, activity) {
    // In a real implementation, you'd check against stored timestamps
    // For now, we'll assume all activities are new
    return true;
  }

  /**
   * Check if listing is new (simplified)
   */
  isNewListing(domain, listing) {
    // In a real implementation, you'd check against stored timestamps
    // For now, we'll assume all listings are new
    return true;
  }

  /**
   * Check if offer is new (simplified)
   */
  isNewOffer(domain, offer) {
    // In a real implementation, you'd check against stored timestamps
    // For now, we'll assume all offers are new
    return true;
  }

  /**
   * Send event alert to user
   * @param {number} userId - Telegram user ID
   * @param {string} domain - Domain name
   * @param {Array} events - Events to alert about
   */
  async sendEventAlert(userId, domain, events) {
    // This will be implemented in the main bot file
    // For now, just log the alert
    logger.info(`Alert for user ${userId} on domain ${domain}:`, events);
  }

  /**
   * Set periodic report interval for user
   * @param {number} userId - Telegram user ID
   * @param {string} interval - Report interval ('10min', '30min', '12h', '1day')
   */
  setReportInterval(userId, interval) {
    if (!this.reportIntervals[interval]) {
      return { success: false, message: 'Invalid report interval. Use: 10min, 30min, 12h, 1day' };
    }

    if (!this.subscriptions.has(userId)) {
      return { success: false, message: 'No active subscriptions found' };
    }

    const userSub = this.subscriptions.get(userId);
    userSub.preferences.reportInterval = interval;

    // Restart periodic reports with new interval
    this.startPeriodicReports(userId);

    logger.info(`Set report interval for user ${userId} to ${interval}`);
    return { success: true, message: `Report interval set to ${interval}` };
  }

  /**
   * Start periodic reports for user
   * @param {number} userId - Telegram user ID
   */
  startPeriodicReports(userId) {
    // Clear existing timer if any
    this.stopPeriodicReports(userId);

    if (!this.subscriptions.has(userId)) return;

    const userSub = this.subscriptions.get(userId);
    const interval = userSub.preferences.reportInterval || '30min';
    const intervalMs = this.reportIntervals[interval];

    if (!userSub.preferences.periodicReports) return;

    const timer = setInterval(async () => {
      await this.sendPeriodicReport(userId);
    }, intervalMs);

    this.reportTimers.set(userId, timer);
    logger.info(`Started periodic reports for user ${userId} (${interval})`);
  }

  /**
   * Stop periodic reports for user
   * @param {number} userId - Telegram user ID
   */
  stopPeriodicReports(userId) {
    if (this.reportTimers.has(userId)) {
      clearInterval(this.reportTimers.get(userId));
      this.reportTimers.delete(userId);
      logger.info(`Stopped periodic reports for user ${userId}`);
    }
  }

  /**
   * Send periodic status report to user
   * @param {number} userId - Telegram user ID
   */
  async sendPeriodicReport(userId) {
    try {
      if (!this.subscriptions.has(userId)) return;

      const userSub = this.subscriptions.get(userId);
      const domains = Array.from(userSub.domains);

      if (domains.length === 0) return;

      // Generate status report for all subscribed domains
      const report = await this.generateStatusReport(domains);
      
      // This will be implemented in the main bot file
      // For now, just log the report
      logger.info(`Periodic report for user ${userId}:`, report);
      
    } catch (error) {
      logger.error(`Error sending periodic report to user ${userId}:`, error);
    }
  }

  /**
   * Generate comprehensive status report for domains
   * @param {Array} domains - List of domains to report on
   */
  async generateStatusReport(domains) {
    const report = {
      timestamp: new Date().toISOString(),
      domains: []
    };

    for (const domain of domains) {
      try {
        // Get current domain data
        const domainData = await this.domaService.getDomainData(domain);
        const activities = await this.domaService.getDomainActivities(domain);
        const listings = await this.domaService.getDomainListings(domain);
        const offers = await this.domaService.getDomainOffers(domain);

        // Calculate current score (simplified)
        const score = this.calculateQuickScore(domain, domainData, activities, listings, offers);

        report.domains.push({
          domain,
          score,
          status: domainData ? 'Active' : 'Inactive',
          activities: activities?.length || 0,
          listings: listings?.length || 0,
          offers: offers?.length || 0,
          lastActivity: activities?.[0]?.timestamp || 'None',
          currentPrice: listings?.[0]?.priceInUSD || 'N/A'
        });

      } catch (error) {
        logger.error(`Error generating report for domain ${domain}:`, error);
        report.domains.push({
          domain,
          score: 0,
          status: 'Error',
          error: error.message
        });
      }
    }

    return report;
  }

  /**
   * Calculate quick score for status report
   */
  calculateQuickScore(domain, domainData, activities, listings, offers) {
    let score = 0;
    
    // Basic scoring factors
    if (domainData) score += 30;
    if (activities?.length > 0) score += Math.min(30, activities.length * 5);
    if (listings?.length > 0) score += 20;
    if (offers?.length > 0) score += 20;
    
    return Math.min(100, score);
  }

  /**
   * Toggle periodic reports for user
   * @param {number} userId - Telegram user ID
   * @param {boolean} enabled - Enable or disable reports
   */
  togglePeriodicReports(userId, enabled) {
    if (!this.subscriptions.has(userId)) {
      return { success: false, message: 'No active subscriptions found' };
    }

    const userSub = this.subscriptions.get(userId);
    userSub.preferences.periodicReports = enabled;

    if (enabled) {
      this.startPeriodicReports(userId);
    } else {
      this.stopPeriodicReports(userId);
    }

    logger.info(`Periodic reports ${enabled ? 'enabled' : 'disabled'} for user ${userId}`);
    return { success: true, message: `Periodic reports ${enabled ? 'enabled' : 'disabled'}` };
  }

  /**
   * Get subscription statistics
   */
  getStats() {
    return {
      totalUsers: this.subscriptions.size,
      totalDomains: this.domainWatchers.size,
      isMonitoring: this.isMonitoring,
      activeReportTimers: this.reportTimers.size
    };
  }
}

module.exports = SubscriptionService;
