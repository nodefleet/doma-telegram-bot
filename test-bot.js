const DomainScoringService = require('./src/services/domainScoringService');

async function testBot() {
  const scoringService = new DomainScoringService();
  
  console.log('Testing domain scoring...');
  
  try {
    const result = await scoringService.calculateDomainScore('example.com');
    console.log('Domain Score Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBot();
