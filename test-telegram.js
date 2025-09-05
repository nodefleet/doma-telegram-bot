const TelegramBot = require('node-telegram-bot-api');
const config = require('./src/config/config');

async function testTelegramConnection() {
  try {
    console.log('Testing Telegram bot connection...');
    
    const bot = new TelegramBot(config.telegram.token, { polling: false });
    
    // Test getting bot info
    const botInfo = await bot.getMe();
    console.log('✅ Bot connection successful!');
    console.log('Bot Info:', {
      id: botInfo.id,
      name: botInfo.first_name,
      username: botInfo.username,
      canJoinGroups: botInfo.can_join_groups,
      canReadAllGroupMessages: botInfo.can_read_all_group_messages
    });
    
    console.log('\n🎉 Your bot is ready to use!');
    console.log(`Find your bot at: https://t.me/${botInfo.username}`);
    console.log('\nTest commands:');
    console.log('/start - Welcome message');
    console.log('/help - Show commands');
    console.log('/score example.com - Test domain scoring');
    
  } catch (error) {
    console.error('❌ Bot connection failed:', error.message);
    console.log('\nMake sure you:');
    console.log('1. Created a bot with @BotFather');
    console.log('2. Added the bot token to your .env file');
    console.log('3. The token is correct and not expired');
  }
}

testTelegramConnection();
