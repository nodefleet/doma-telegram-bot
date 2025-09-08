/**
 * Response formatting utilities for Telegram bot
 */

class ResponseFormatter {
  /**
   * Format domain score response
   * @param {Object} scoreData - Domain score data
   * @returns {string} Formatted response
   */
  static formatDomainScore(scoreData) {
    const { domain, overallScore, scores, breakdown } = scoreData;
    
    let response = `🎯 *Domain Score Report*\n\n`;
    response += `🌐 *Domain:* \`${domain}\`\n`;
    response += `⭐ *Overall Score:* ${this.getScoreEmoji(overallScore)} *${overallScore}/100*\n\n`;
    
    response += `📊 *Score Breakdown:*\n`;
    breakdown.forEach((item, index) => {
      const emoji = this.getTraitEmoji(item.trait);
      response += `${emoji} *${this.formatTraitName(item.trait)}:* ${item.score}/100 (${item.weight}% weight)\n`;
    });
    
    response += `\n🔍 *Detailed Analysis:*\n`;
    response += `• *Popularity:* ${this.getScoreDescription(scores.popularity)}\n`;
    response += `• *Blockchain Activity:* ${this.getScoreDescription(scores.blockchain)}\n`;
    response += `• *Extension Value:* ${this.getScoreDescription(scores.extension)}\n`;
    response += `• *Brand Potential:* ${this.getScoreDescription(scores.brandScore)}\n`;
    
    return response;
  }

  /**
   * Format error response
   * @param {string} error - Error message
   * @returns {string} Formatted error response
   */
  static formatError(error) {
    return `❌ *Error:* ${error}\n\nPlease try again or contact support if the issue persists.`;
  }

  /**
   * Format help message
   * @returns {string} Formatted help message
   */
  static formatHelp() {
    return `🤖 *Doma Domain Scoring Bot*\n\n` +
           `*Commands:*\n` +
           `• /score <domain> - Get domain score\n` +
           `• /subscribe <domain> - Track domain for events\n` +
           `• /unsubscribe <domain> - Stop tracking domain\n` +
           `• /my_subscriptions - View your subscriptions\n` +
           `• /alerts - Configure alert preferences\n` +
           `• /set_interval <time> - Set report frequency\n` +
           `• /reports <on|off> - Toggle periodic reports\n` +
           `• /report_help - Report interval options\n` +
           `• /help - Show this help message\n` +
           `• /about - About the bot\n\n` +
           `*Examples:*\n` +
           `• /score example.com\n` +
           `• /score crypto.eth\n` +
           `• /score nft.xyz\n` +
           `• /set_interval 30min\n` +
           `• /reports on\n\n` +
           `*Features:*\n` +
           `• Comprehensive domain scoring\n` +
           `• Web3 domain analysis\n` +
           `• Blockchain activity tracking\n` +
           `• Market trend analysis\n` +
           `• Real-time domain event alerts\n` +
           `• Periodic status reports\n` +
           `• Subscription management\n` +
           `• Customizable notifications`;
  }

  /**
   * Format about message
   * @returns {string} Formatted about message
   */
  static formatAbout() {
    return `🌐 *About Doma Domain Scoring Bot*\n\n` +
           `This bot provides comprehensive domain scoring using the Doma infrastructure, analyzing:\n\n` +
           `• *Popularity* - Domain recognition and search volume\n` +
           `• *Blockchain* - On-chain activity and ownership\n` +
           `• *Extension* - TLD value and market demand\n` +
           `• *Sale Volume* - Historical sales data\n` +
           `• *Length* - Domain length optimization\n` +
           `• *Brand Score* - Brandability and memorability\n` +
           `• *Market Trends* - Current market sentiment\n` +
           `• *Traffic* - Website traffic metrics\n` +
           `• *Cross-Extension* - Availability across TLDs\n\n` +
           `Powered by [Doma](https://docs.doma.xyz/) infrastructure.`;
  }

  /**
   * Get score emoji based on score value
   * @param {number} score - Score value
   * @returns {string} Emoji
   */
  static getScoreEmoji(score) {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    if (score >= 50) return '⭐';
    if (score >= 40) return '📈';
    if (score >= 30) return '📊';
    if (score >= 20) return '📉';
    return '❌';
  }

  /**
   * Get trait emoji
   * @param {string} trait - Trait name
   * @returns {string} Emoji
   */
  static getTraitEmoji(trait) {
    const emojis = {
      popularity: '🔥',
      blockchain: '⛓️',
      extension: '🌐',
      saleVolume: '💰',
      length: '📏',
      brandScore: '🏷️',
      marketTrends: '📈',
      traffic: '🚀',
      crossExtension: '🔗'
    };
    return emojis[trait] || '📊';
  }

  /**
   * Format trait name for display
   * @param {string} trait - Trait name
   * @returns {string} Formatted name
   */
  static formatTraitName(trait) {
    const names = {
      popularity: 'Popularity',
      blockchain: 'Blockchain Activity',
      extension: 'Extension Value',
      saleVolume: 'Sale Volume',
      length: 'Length Score',
      brandScore: 'Brand Score',
      marketTrends: 'Market Trends',
      traffic: 'Traffic Score',
      crossExtension: 'Cross-Extension'
    };
    return names[trait] || trait;
  }

  /**
   * Get score description
   * @param {number} score - Score value
   * @returns {string} Description
   */
  static getScoreDescription(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    if (score >= 30) return 'Poor';
    return 'Very Poor';
  }

  /**
   * Format loading message
   * @param {string} domain - Domain being analyzed
   * @returns {string} Loading message
   */
  static formatLoading(domain) {
    return `🔄 Analyzing domain: \`${domain}\`\n\nPlease wait while I calculate the score...`;
  }

  /**
   * Format multiple domains response
   * @param {Array} results - Array of domain score results
   * @returns {string} Formatted response
   */
  static formatMultipleDomains(results) {
    let response = `🎯 *Multiple Domain Scores*\n\n`;
    
    results.forEach((result, index) => {
      response += `${index + 1}. *${result.domain}* - ${this.getScoreEmoji(result.overallScore)} ${result.overallScore}/100\n`;
    });
    
    response += `\nUse /score <domain> for detailed analysis of any domain.`;
    
    return response;
  }
}

module.exports = ResponseFormatter;
