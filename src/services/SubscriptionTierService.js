const logger = require('../utils/logger');

class SubscriptionTierService {
  constructor() {
    this.tiers = {
      free: {
        name: 'Free',
        maxDomains: 3,
        maxRequestsPerDay: 10,
        features: [
          'Basic domain scoring',
          'WHOIS data',
          'DNS lookup',
          'Basic analytics',
          '3 domain subscriptions'
        ],
        dataSources: ['basic', 'whois', 'dns'],
        price: 0
      },
      premium: {
        name: 'Premium',
        maxDomains: 25,
        maxRequestsPerDay: 100,
        features: [
          'Everything in Free',
          'Semrush integration',
          'Moz domain authority',
          'Ahrefs backlink data',
          'Advanced analytics',
          '25 domain subscriptions',
          'Priority support'
        ],
        dataSources: ['basic', 'whois', 'dns', 'semrush', 'moz', 'ahrefs'],
        price: 9.99
      },
      pro: {
        name: 'Pro',
        maxDomains: 100,
        maxRequestsPerDay: 500,
        features: [
          'Everything in Premium',
          'Social media metrics',
          'Market analysis',
          'Real-time monitoring',
          'Custom alerts',
          '100 domain subscriptions',
          'API access',
          'White-label options'
        ],
        dataSources: ['basic', 'whois', 'dns', 'semrush', 'moz', 'ahrefs', 'social', 'market'],
        price: 29.99
      }
    };
  }

  /**
   * Get user's subscription tier
   */
  getUserTier(userId) {
    // This would check against your user database
    // For now, return 'free' as default
    return 'free';
  }

  /**
   * Check if user can perform action
   */
  canPerformAction(userId, action, currentUsage = {}) {
    const tier = this.getUserTier(userId);
    const tierConfig = this.tiers[tier];

    switch (action) {
      case 'subscribe_domain':
        return currentUsage.domains < tierConfig.maxDomains;
      
      case 'make_request':
        return currentUsage.requests < tierConfig.maxRequestsPerDay;
      
      case 'access_feature':
        return true; // All tiers can access basic features
      
      default:
        return false;
    }
  }

  /**
   * Get available features for user
   */
  getAvailableFeatures(userId) {
    const tier = this.getUserTier(userId);
    return this.tiers[tier].features;
  }

  /**
   * Get available data sources for user
   */
  getAvailableDataSources(userId) {
    const tier = this.getUserTier(userId);
    return this.tiers[tier].dataSources;
  }

  /**
   * Get tier limits
   */
  getTierLimits(userId) {
    const tier = this.getUserTier(userId);
    const tierConfig = this.tiers[tier];
    
    return {
      maxDomains: tierConfig.maxDomains,
      maxRequestsPerDay: tierConfig.maxRequestsPerDay,
      price: tierConfig.price
    };
  }

  /**
   * Upgrade user tier
   */
  async upgradeUser(userId, newTier) {
    try {
      // This would update your user database
      logger.info(`User ${userId} upgraded to ${newTier} tier`);
      return { success: true, message: `Upgraded to ${this.tiers[newTier].name} tier` };
    } catch (error) {
      logger.error(`Error upgrading user ${userId}:`, error);
      return { success: false, message: 'Upgrade failed' };
    }
  }

  /**
   * Get tier comparison
   */
  getTierComparison() {
    return Object.keys(this.tiers).map(tierKey => ({
      tier: tierKey,
      ...this.tiers[tierKey]
    }));
  }

  /**
   * Check if user has access to data source
   */
  hasAccessToDataSource(userId, dataSource) {
    const availableSources = this.getAvailableDataSources(userId);
    return availableSources.includes(dataSource);
  }

  /**
   * Get usage statistics for user
   */
  getUserUsage(userId) {
    // This would fetch from your database
    return {
      domains: 0,
      requests: 0,
      lastReset: new Date().toISOString()
    };
  }

  /**
   * Reset daily usage
   */
  resetDailyUsage(userId) {
    // This would reset in your database
    logger.info(`Reset daily usage for user ${userId}`);
  }
}

module.exports = SubscriptionTierService;
