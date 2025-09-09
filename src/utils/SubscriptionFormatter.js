class SubscriptionFormatter {
  /**
   * Format subscription success message
   * @param {string} domain - Domain name
   * @param {Object} preferences - User preferences
   * @param {number} currentScore - Current domain score (optional)
   */
  static formatSubscriptionSuccess(domain, preferences, currentScore = null) {
    let message = `✅ **Successfully subscribed to \`${domain}\`**\n\n`;
    
    // Add current score if available
    if (currentScore !== null) {
      const scoreEmoji = this.getScoreEmoji(currentScore);
      message += `📊 **Current Score:** ${scoreEmoji} ${currentScore}/100\n\n`;
    }
    
    message += `🔔 Alert Settings:**\n`;
    message += `• Price Alerts: ${preferences.priceAlerts ? '✅' : '❌'}\n`;
    message += `• Expiration Alerts: ${preferences.expirationAlerts ? '✅' : '❌'}\n`;
    message += `• Sale Alerts: ${preferences.saleAlerts ? '✅' : '❌'}\n`;
    message += `• Transfer Alerts: ${preferences.transferAlerts ? '✅' : '❌'}\n`;
    message += `• Score Threshold: ${preferences.scoreThreshold}/100\n\n`;
    message += `_You'll receive notifications when events occur for this domain._`;
    
    return message;
  }

  /**
   * Format unsubscription success message
   * @param {string} domain - Domain name
   */
  static formatUnsubscriptionSuccess(domain) {
    return `✅ **Successfully unsubscribed from \`${domain}\`**\n\n_You will no longer receive alerts for this domain._`;
  }

  /**
   * Format user subscriptions list
   * @param {Array} domains - List of subscribed domains
   * @param {Object} preferences - User preferences
   */
  static formatUserSubscriptions(domains, preferences) {
    if (domains.length === 0) {
      return `📋 **Your Subscriptions**\n\n_No active subscriptions. Use /subscribe <domain> to start tracking domains._`;
    }

    let message = `📋 **Your Subscriptions** (${domains.length})\n\n`;
    
    domains.forEach((domain, index) => {
      message += `${index + 1}. \`${domain}\`\n`;
    });

    message += `\n Alert Settings:**\n`;
    message += `• Price Alerts: ${preferences.priceAlerts ? '✅' : '❌'}\n`;
    message += `• Expiration Alerts: ${preferences.expirationAlerts ? '✅' : '❌'}\n`;
    message += `• Sale Alerts: ${preferences.saleAlerts ? '✅' : '❌'}\n`;
    message += `• Transfer Alerts: ${preferences.transferAlerts ? '✅' : '❌'}\n`;
    message += `• Score Threshold: ${preferences.scoreThreshold}/100\n\n`;
    message += `_Use /unsubscribe <domain> to stop tracking a domain._`;

    return message;
  }

  /**
   * Format event alert message
   * @param {string} domain - Domain name
   * @param {Array} events - Array of events
   */
  static formatEventAlert(domain, events) {
    let message = `🚨 **Domain Alert: \`${domain}\`**\n\n`;
    
    events.forEach(event => {
      const emoji = this.getEventEmoji(event.type);
      message += `${emoji} **${event.type}**\n`;
      message += `${event.message}\n\n`;
    });

    message += `_Use /score ${domain} for detailed analysis._`;
    
    return message;
  }

  /**
   * Get emoji for event type
   * @param {string} eventType - Type of event
   */
  static getEventEmoji(eventType) {
    const emojis = {
      'ACTIVITY': '⚡',
      'LISTING': '💰',
      'OFFER': '🎯',
      'TRANSFER': '🔄',
      'EXPIRATION': '⏰',
      'PRICE_CHANGE': '📈'
    };
    return emojis[eventType] || '🔔';
  }

  /**
   * Format subscription help message
   */
  static formatSubscriptionHelp() {
    return `🔔 **Subscription Commands**\n\n` +
           `• \`/subscribe <domain>\` - Track a domain for events\n` +
           `• \`/unsubscribe <domain>\` - Stop tracking a domain\n` +
           `• \`/mysubscriptions\` - View your active subscriptions\n` +
           `• \`/alerts\` - Configure alert preferences\n` +
           `• \`/help\` - Show all available commands\n\n` +
           `**Event Types:**\n` +
           `• Price changes and new listings\n` +
           `• Domain transfers and activities\n` +
           `• Expiration warnings\n` +
           `• Score threshold alerts\n\n` +
           `_Example: /subscribe example.com_`;
  }

  /**
   * Format preferences update message
   * @param {Object} preferences - Updated preferences
   */
  static formatPreferencesUpdate(preferences) {
    let message = `⚙️ **Alert Preferences Updated**\n\n`;
    message += `• Price Alerts: ${preferences.priceAlerts ? '✅' : '❌'}\n`;
    message += `• Expiration Alerts: ${preferences.expirationAlerts ? '✅' : '❌'}\n`;
    message += `• Sale Alerts: ${preferences.saleAlerts ? '✅' : '❌'}\n`;
    message += `• Transfer Alerts: ${preferences.transferAlerts ? '✅' : '❌'}\n`;
    message += `• Score Threshold: ${preferences.scoreThreshold}/100\n\n`;
    message += `_These settings apply to all your subscriptions._`;
    
    return message;
  }

  /**
   * Format error message
   * @param {string} error - Error message
   */
  static formatError(error) {
    return `❌ **Error:** ${error}\n\n_Please try again or contact support if the issue persists._`;
  }

  /**
   * Get score emoji based on score value
   * @param {number} score - Score value
   * @returns {string} Emoji representation
   */
  static getScoreEmoji(score) {
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  }
}

module.exports = SubscriptionFormatter;
