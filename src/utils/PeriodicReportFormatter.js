/**
 * Periodic report formatting utilities for Telegram bot
 */

class PeriodicReportFormatter {
  /**
   * Format periodic status report
   * @param {Object} report - Status report data
   * @returns {string} Formatted report message
   */
  static formatStatusReport(report) {
    const { timestamp, domains } = report;
    const reportTime = new Date(timestamp).toLocaleString();
    
    let message = `📊 *Periodic Domain Status Report*\n`;
    message += `🕐 *Generated:* ${reportTime}\n\n`;
    
    if (domains.length === 0) {
      message += `No domains being tracked. Subscribe to domains to receive reports.`;
      return message;
    }
    
    message += `📈 *Tracked Domains:* ${domains.length}\n\n`;
    
    domains.forEach((domain, index) => {
      const { domain: domainName, score, status, activities, listings, offers, lastActivity, currentPrice } = domain;
      
      message += `🌐 *${domainName}*\n`;
      message += `• *Score:* ${this.getScoreEmoji(score)} ${score}/100\n`;
      message += `• *Status:* ${this.getStatusEmoji(status)} ${status}\n`;
      message += `• *Activities:* ${activities}\n`;
      message += `• *Listings:* ${listings}\n`;
      message += `• *Offers:* ${offers}\n`;
      message += `• *Last Activity:* ${lastActivity}\n`;
      message += `• *Current Price:* ${currentPrice}\n`;
      
      if (index < domains.length - 1) {
        message += `\n`;
      }
    });
    
    message += `\n\n💡 *Tip:* Use /alerts to configure report frequency`;
    
    return message;
  }
  
  /**
   * Format report interval options
   * @returns {string} Formatted interval options
   */
  static formatReportIntervals() {
    return `⏰ *Report Interval Options*\n\n` +
           `• *10min* - Every 10 minutes\n` +
           `• *30min* - Every 30 minutes (default)\n` +
           `• *12h* - Every 12 hours\n` +
           `• *1day* - Every 24 hours\n\n` +
           `*Usage:*\n` +
           `• /set_interval 10min\n` +
           `• /set_interval 30min\n` +
           `• /set_interval 12h\n` +
           `• /set_interval 1day\n\n` +
           `*Toggle Reports:*\n` +
           `• /reports on - Enable periodic reports\n` +
           `• /reports off - Disable periodic reports`;
  }
  
  /**
   * Format report settings confirmation
   * @param {string} interval - Report interval
   * @param {boolean} enabled - Whether reports are enabled
   * @returns {string} Formatted confirmation message
   */
  static formatReportSettings(interval, enabled) {
    const status = enabled ? '✅ Enabled' : '❌ Disabled';
    const nextReport = enabled ? this.getNextReportTime(interval) : 'N/A';
    
    return `⚙️ *Report Settings Updated*\n\n` +
           `• *Status:* ${status}\n` +
           `• *Interval:* ${interval}\n` +
           `• *Next Report:* ${nextReport}\n\n` +
           `Your periodic reports have been ${enabled ? 'enabled' : 'disabled'}.`;
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
  
  /**
   * Get status emoji based on domain status
   * @param {string} status - Domain status
   * @returns {string} Emoji representation
   */
  static getStatusEmoji(status) {
    switch (status.toLowerCase()) {
      case 'active': return '✅';
      case 'inactive': return '❌';
      case 'error': return '⚠️';
      default: return '❓';
    }
  }
  
  /**
   * Calculate next report time
   * @param {string} interval - Report interval
   * @returns {string} Next report time
   */
  static getNextReportTime(interval) {
    const intervals = {
      '10min': 10 * 60 * 1000,
      '30min': 30 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '1day': 24 * 60 * 60 * 1000
    };
    
    const intervalMs = intervals[interval] || intervals['30min'];
    const nextTime = new Date(Date.now() + intervalMs);
    return nextTime.toLocaleString();
  }
  
  /**
   * Format error message for report operations
   * @param {string} error - Error message
   * @returns {string} Formatted error message
   */
  static formatError(error) {
    return `❌ *Report Error*\n\n${error}\n\nPlease try again or contact support.`;
  }
}

module.exports = PeriodicReportFormatter;
