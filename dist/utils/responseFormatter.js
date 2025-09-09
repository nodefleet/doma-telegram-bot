"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
class ResponseFormatter {
    /**
     * Format domain score response
     * @param scoreData - Domain score data
     * @returns Formatted response
     */
    static formatDomainScore(scoreData) {
        const { domain, overallScore, scores, breakdown } = scoreData;
        let response = `🎯 *Domain Score Report*\n\n`;
        response += `🌐 *Domain:* \`${domain}\`\n`;
        response += `⭐ *Overall Score:* ${this.getScoreEmoji(overallScore)} *${overallScore}/100*\n\n`;
        response += `📊 *Score Breakdown:*\n`;
        breakdown.forEach((item) => {
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
     * @param error - Error message
     * @returns Formatted error response
     */
    static formatError(error) {
        return `❌ *Error:* ${error}\n\nPlease try again or contact support if the issue persists.`;
    }
    /**
     * Format help message
     * @returns Formatted help message
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
     * @returns Formatted about message
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
            `*Features:*\n` +
            `• Real-time domain analysis\n` +
            `• Web3 domain support\n` +
            `• Subscription Management\n` +
            `• Real-time Event Monitoring\n` +
            `• Periodic status reports\n` +
            `• Customizable alerts\n\n` +
            `*Built with:* Doma API, TypeScript, Node.js\n` +
            `*Version:* 2.0.0 (TypeScript Edition)`;
    }
    /**
     * Format loading message
     * @param input - User input
     * @returns Formatted loading message
     */
    static formatLoading(input) {
        return `🔄 Analyzing domain: \`${input}\`\n\nPlease wait while I calculate the score...`;
    }
    /**
     * Get score emoji based on score value
     * @param score - Score value
     * @returns Emoji representation
     */
    static getScoreEmoji(score) {
        if (score >= 90)
            return '🟢';
        if (score >= 70)
            return '🟡';
        if (score >= 50)
            return '🟠';
        return '🔴';
    }
    /**
     * Get trait emoji
     * @param trait - Trait name
     * @returns Emoji representation
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
     * @param trait - Trait name
     * @returns Formatted trait name
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
     * @param score - Score value
     * @returns Score description
     */
    static getScoreDescription(score) {
        if (score >= 90)
            return 'Excellent';
        if (score >= 70)
            return 'Good';
        if (score >= 50)
            return 'Average';
        if (score >= 30)
            return 'Poor';
        return 'Very Poor';
    }
}
exports.ResponseFormatter = ResponseFormatter;
exports.default = ResponseFormatter;
//# sourceMappingURL=responseFormatter.js.map