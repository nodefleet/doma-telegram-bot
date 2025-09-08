const SubscriptionService = require('./src/services/SubscriptionService');
const DomainScoringService = require('./src/services/domainScoringService');
const logger = require('./src/utils/logger');

async function testNewFeatures() {
  console.log('🧪 Testing New Subscription Features...\n');
  
  const subscriptionService = new SubscriptionService();
  const scoringService = new DomainScoringService();
  
  // Test 1: Subscribe to domains
  console.log('1. Testing subscription system...');
  const result1 = await subscriptionService.subscribe(12345, 'example.com');
  console.log('✅ Subscribe result:', result1.success ? 'SUCCESS' : 'FAILED');
  
  const result2 = await subscriptionService.subscribe(12345, 'crypto.eth');
  console.log('✅ Subscribe result:', result2.success ? 'SUCCESS' : 'FAILED');
  
  // Test 2: Get subscriptions
  console.log('\n2. Testing get subscriptions...');
  const userSub = subscriptionService.getUserSubscriptions(12345);
  console.log('✅ User has', userSub.domains.length, 'subscriptions');
  console.log('📋 Domains:', userSub.domains.join(', '));
  
  // Test 3: Test domain scoring
  console.log('\n3. Testing domain scoring...');
  try {
    const score = await scoringService.calculateDomainScore('example.com');
    console.log('✅ Domain scoring works!');
    console.log('📊 Score:', score.overallScore + '/100');
  } catch (error) {
    console.log('❌ Domain scoring failed:', error.message);
  }
  
  // Test 4: Test stats
  console.log('\n4. Testing statistics...');
  const stats = subscriptionService.getStats();
  console.log('✅ Stats:', stats);
  
  // Test 5: Test unsubscription
  console.log('\n5. Testing unsubscription...');
  const result3 = await subscriptionService.unsubscribe(12345, 'example.com');
  console.log('✅ Unsubscribe result:', result3.success ? 'SUCCESS' : 'FAILED');
  
  const finalSub = subscriptionService.getUserSubscriptions(12345);
  console.log('📋 Final subscriptions:', finalSub.domains.length);
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📱 Now test in Telegram:');
  console.log('1. /start - Welcome message');
  console.log('2. /help - Show all commands');
  console.log('3. /subscribe example.com - Subscribe to domain');
  console.log('4. /my_subscriptions - View subscriptions');
  console.log('5. /score example.com - Test scoring');
  console.log('6. /alerts - Show alert help');
}

testNewFeatures().catch(console.error);
