const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const logger = require('./utils/logger');
const DomainScoringService = require('./services/domainScoringService');
const SubscriptionService = require('./services/SubscriptionService');
const DomainValidator = require('./utils/domainValidator');
const ResponseFormatter = require('./utils/responseFormatter');
const SubscriptionFormatter = require('./utils/SubscriptionFormatter');
const PeriodicReportFormatter = require('./utils/PeriodicReportFormatter');

class DomaTelegramBot {
  constructor() {
    this.bot = new TelegramBot(config.telegram.token, { polling: true });
    this.scoringService = new DomainScoringService();
    this.subscriptionService = new SubscriptionService();
    this.setupHandlers();
    logger.info('Doma Telegram Bot started successfully');
  }

  setupHandlers() {
    // Start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `🤖 Welcome to Doma Domain Scoring Bot!\n\n` +
        `I can analyze any domain and provide a comprehensive score based on multiple factors including blockchain activity, popularity, and market trends.\n\n` +
        `**New Features:**\n` +
        `• 🔔 Domain event subscriptions\n` +
        `• 📊 Real-time alerts\n` +
        `• ⚙️ Customizable preferences\n\n` +
        `Type /help to see available commands.`;
      
      this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, ResponseFormatter.formatHelp(), { parse_mode: 'Markdown' });
    });

    // About command
    this.bot.onText(/\/about/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, ResponseFormatter.formatAbout(), { parse_mode: 'Markdown' });
    });

    // Score command
    this.bot.onText(/\/score (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const input = match[1].trim();
      
      try {
        // Send loading message
        const loadingMsg = await this.bot.sendMessage(chatId, ResponseFormatter.formatLoading(input));
        
        // Extract and validate domains
        const domains = this.extractDomains(input);
        
        if (domains.length === 0) {
          await this.bot.editMessageText(
            ResponseFormatter.formatError('No valid domains found. Please provide a valid domain name.'),
            { chat_id: chatId, message_id: loadingMsg.message_id, parse_mode: 'Markdown' }
          );
          return;
        }

        if (domains.length > config.bot.maxDomainsPerRequest) {
          await this.bot.editMessageText(
            ResponseFormatter.formatError(`Too many domains. Maximum ${config.bot.maxDomainsPerRequest} domains per request.`),
            { chat_id: chatId, message_id: loadingMsg.message_id, parse_mode: 'Markdown' }
          );
          return;
        }

        // Process domains
        if (domains.length === 1) {
          await this.processSingleDomain(chatId, loadingMsg.message_id, domains[0]);
        } else {
          await this.processMultipleDomains(chatId, loadingMsg.message_id, domains);
        }

      } catch (error) {
        logger.error('Error processing score command:', error);
        await this.bot.sendMessage(chatId, ResponseFormatter.formatError('An unexpected error occurred. Please try again.'));
      }
    });

    // Subscribe command
    this.bot.onText(/\/subscribe (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const domain = match[1].trim().toLowerCase();
      
      try {
        // Validate domain
        if (!DomainValidator.isValidDomain(domain)) {
          await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError('Invalid domain format. Please provide a valid domain name.'));
          return;
        }

        // Subscribe user to domain
        const result = await this.subscriptionService.subscribe(userId, domain);
        
        if (result.success) {
          const userSub = this.subscriptionService.getUserSubscriptions(userId);
          await this.bot.sendMessage(chatId, SubscriptionFormatter.formatSubscriptionSuccess(domain, userSub.preferences), { parse_mode: 'Markdown' });
        } else {
          await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError(result.message));
        }

      } catch (error) {
        logger.error('Error processing subscribe command:', error);
        await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError('An unexpected error occurred. Please try again.'));
      }
    });

    // Unsubscribe command
    this.bot.onText(/\/unsubscribe (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const domain = match[1].trim().toLowerCase();
      
      try {
        const result = await this.subscriptionService.unsubscribe(userId, domain);
        
        if (result.success) {
          await this.bot.sendMessage(chatId, SubscriptionFormatter.formatUnsubscriptionSuccess(domain), { parse_mode: 'Markdown' });
        } else {
          await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError(result.message));
        }

      } catch (error) {
        logger.error('Error processing unsubscribe command:', error);
        await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError('An unexpected error occurred. Please try again.'));
      }
    });

    // My subscriptions command
    this.bot.onText(/\/my_subscriptions/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      try {
        const userSub = this.subscriptionService.getUserSubscriptions(userId);
        await this.bot.sendMessage(chatId, SubscriptionFormatter.formatUserSubscriptions(userSub.domains, userSub.preferences), { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error('Error processing my_subscriptions command:', error);
        await this.bot.sendMessage(chatId, SubscriptionFormatter.formatError('An unexpected error occurred. Please try again.'));
      }
    });

    // Alerts command (preferences)
    this.bot.onText(/\/alerts/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, SubscriptionFormatter.formatSubscriptionHelp(), { parse_mode: 'Markdown' });
    });

    // Stats command (admin)
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Simple admin check (you can implement proper admin logic)
      if (userId !== 123456789) { // Replace with your admin user ID
        await this.bot.sendMessage(chatId, '❌ Access denied. This command is for administrators only.');
        return;
      }
      
      try {
        const stats = this.subscriptionService.getStats();
        const message = `📊 **Bot Statistics**\n\n` +
          `• Total Users: ${stats.totalUsers}\n` +
          `• Total Domains: ${stats.totalDomains}\n` +
          `• Monitoring: ${stats.isMonitoring ? '✅ Active' : '❌ Inactive'}\n` +
          `• Active Report Timers: ${stats.activeReportTimers}\n\n` +
          `_Last updated: ${new Date().toLocaleString()}_`;
        
        await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error('Error processing stats command:', error);
        await this.bot.sendMessage(chatId, '❌ Error retrieving statistics.');
      }
    });

    // Set report interval command
    this.bot.onText(/\/set_interval (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const interval = match[1].trim().toLowerCase();
      
      try {
        const result = this.subscriptionService.setReportInterval(userId, interval);
        
        if (result.success) {
          const userSub = this.subscriptionService.getUserSubscriptions(userId);
          const message = PeriodicReportFormatter.formatReportSettings(interval, userSub.preferences.periodicReports);
          await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } else {
          await this.bot.sendMessage(chatId, PeriodicReportFormatter.formatError(result.message), { parse_mode: 'Markdown' });
        }
      } catch (error) {
        logger.error('Error processing set_interval command:', error);
        await this.bot.sendMessage(chatId, '❌ Error setting report interval.');
      }
    });

    // Toggle reports command
    this.bot.onText(/\/reports (on|off)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const enabled = match[1] === 'on';
      
      try {
        const result = this.subscriptionService.togglePeriodicReports(userId, enabled);
        
        if (result.success) {
          const userSub = this.subscriptionService.getUserSubscriptions(userId);
          const message = PeriodicReportFormatter.formatReportSettings(userSub.preferences.reportInterval, enabled);
          await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } else {
          await this.bot.sendMessage(chatId, PeriodicReportFormatter.formatError(result.message), { parse_mode: 'Markdown' });
        }
      } catch (error) {
        logger.error('Error processing reports command:', error);
        await this.bot.sendMessage(chatId, '❌ Error toggling reports.');
      }
    });

    // Report intervals help command
    this.bot.onText(/\/report_help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, PeriodicReportFormatter.formatReportIntervals(), { parse_mode: 'Markdown' });
    });

    // Handle any other text messages
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // If it's not a command, treat it as a domain
      if (text && !text.startsWith('/')) {
        this.bot.sendMessage(chatId, `To analyze a domain, use: /score ${text}\n\nTo subscribe to alerts, use: /subscribe ${text}`);
      }
    });

    // Error handling
    this.bot.on('polling_error', (error) => {
      logger.error('Polling error:', error);
    });

    this.bot.on('error', (error) => {
      logger.error('Bot error:', error);
    });
  }

  /**
   * Process single domain scoring
   * @param {number} chatId - Chat ID
   * @param {number} messageId - Message ID to edit
   * @param {string} domain - Domain to analyze
   */
  async processSingleDomain(chatId, messageId, domain) {
    try {
      const scoreData = await this.scoringService.calculateDomainScore(domain);
      const response = ResponseFormatter.formatDomainScore(scoreData);

      await this.bot.editMessageText(response, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      logger.error(`Error processing domain ${domain}:`, error);
      await this.bot.editMessageText(`❌ Error analyzing \`${domain}\`: ${error.message}`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
    }
  }

  /**
   * Process multiple domains
   * @param {number} chatId - Chat ID
   * @param {number} messageId - Message ID to edit
   * @param {Array} domains - Domains to analyze
   */
  async processMultipleDomains(chatId, messageId, domains) {
    try {
      // Process domains in parallel
      const promises = domains.map(async (domain) => {
        try {
          const scoreData = await this.scoringService.calculateDomainScore(domain);
          return {
            domain,
            overallScore: scoreData.overallScore
          };
        } catch (error) {
          logger.error(`Error processing domain ${domain}:`, error);
          return {
            domain,
            overallScore: 0,
            error: error.message
          };
        }
      });

      const results = await Promise.all(promises);
      const response = ResponseFormatter.formatMultipleDomains(results);

      await this.bot.editMessageText(response, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      logger.error('Error in processMultipleDomains:', error);
      await this.bot.editMessageText(`❌ An unexpected error occurred while processing multiple domains.`, {
        chat_id: chatId,
        message_id: messageId
      });
    }
  }

  /**
   * Extract domains from input text
   * @param {string} input - Input text
   * @returns {Array} Array of valid domains
   */
  extractDomains(input) {
    const domains = input.split(/[,\s]+/).map(d => d.trim().toLowerCase());
    return domains.filter(domain => DomainValidator.isValidDomain(domain));
  }

  /**
   * Send event alert to user
   * @param {number} userId - User ID
   * @param {string} domain - Domain name
   * @param {Array} events - Events to alert about
   */
  async sendEventAlert(userId, domain, events) {
    try {
      const message = SubscriptionFormatter.formatEventAlert(domain, events);
      await this.bot.sendMessage(userId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error(`Error sending event alert to user ${userId}:`, error);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('Stopping Doma Telegram Bot...');
    this.subscriptionService.stopEventMonitoring();
    this.bot.stopPolling();
    logger.info('Doma Telegram Bot stopped');
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  if (bot) {
    await bot.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  if (bot) {
    await bot.shutdown();
  }
  process.exit(0);
});

// Initialize bot
const bot = new DomaTelegramBot();

module.exports = DomaTelegramBot;
