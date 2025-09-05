const SubscriptionService = require('./src/services/SubscriptionService');
const logger = require('./src/utils/logger');

async function testSubscriptions() {
  const subscriptionService = new SubscriptionService();
  
  console.log('🧪 Testing Subscription Service...\n');
  
  // Test 1: Subscribe user to domain
  console.log('1. Testing subscription...');
  const result1 = await subscriptionService.subscribe(12345, 'example.com');
  console.log('Result:', result1);
  
  // Test 2: Get user subscriptions
  console.log('\n2. Testing get subscriptions...');
  const userSub = subscriptionService.getUserSubscriptions(12345);
  console.log('User subscriptions:', userSub);
  
  // Test 3: Subscribe to another domain
  console.log('\n3. Testing multiple subscriptions...');
  const result2 = await subscriptionService.subscribe(12345, 'test.eth');
  console.log('Result:', result2);
  
  // Test 4: Get updated subscriptions
  console.log('\n4. Testing updated subscriptions...');
  const userSub2 = subscriptionService.getUserSubscriptions(12345);
  console.log('Updated subscriptions:', userSub2);
  
  // Test 5: Unsubscribe from domain
  console.log('\n5. Testing unsubscription...');
  const result3 = await subscriptionService.unsubscribe(12345, 'example.com');
  console.log('Result:', result3);
  
  // Test 6: Get final subscriptions
  console.log('\n6. Testing final subscriptions...');
  const userSub3 = subscriptionService.getUserSubscriptions(12345);
  console.log('Final subscriptions:', userSub3);
  
  // Test 7: Get stats
  console.log('\n7. Testing stats...');
  const stats = subscriptionService.getStats();
  console.log('Stats:', stats);
  
  console.log('\n✅ Subscription service test completed!');
}

testSubscriptions().catch(console.error);
