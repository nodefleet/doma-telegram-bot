const logger = require('../utils/logger');
const DomaService = require('./DomaService');

class SubscriptionService {
  constructor() {
    this.subscriptions = new Map(); // userId -> { domains: Set, preferences: Object }
    this.domainWatchers = new Map(); // domain -> Set of userIds
    this.domaService = new DomaService();
    this.eventCheckInterval = 30000; // Check for events every 30 seconds
    this.isMonitoring = false;
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
            scoreThreshold: 50
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
      return { domains: [], preferences: {} };
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
   * Get subscription statistics
   */
  getStats() {
    return {
      totalUsers: this.subscriptions.size,
      totalDomains: this.domainWatchers.size,
      isMonitoring: this.isMonitoring
    };
  }
}

module.exports = SubscriptionService;
