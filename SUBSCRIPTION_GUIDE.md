# Subscription System & Real Data Guide

## Current Situation

Your bot currently uses **mostly mock data** because:
- **Semrush API**: Out of credits (403 error)
- **Moz/Ahrefs APIs**: Not configured (placeholder keys)
- **Doma API**: Using testnet (mock data)

## How to Get Real Data

### 1. **Free Tier (Current)**
- ✅ **Basic Domain Analysis**: Length, extension, format
- ✅ **WHOIS Data**: Registrar, creation date, expiration
- ✅ **DNS Lookup**: IP addresses, MX records, TXT records
- ✅ **Heuristic Scoring**: Based on domain characteristics

### 2. **Premium Tier ($9.99/month)**
- ✅ Everything in Free
- ✅ **Semrush Integration**: Organic traffic, keywords, domain rank
- ✅ **Moz Domain Authority**: Real DA scores
- ✅ **Ahrefs Backlinks**: Real backlink data
- ✅ **Advanced Analytics**: Detailed breakdowns

### 3. **Pro Tier ($29.99/month)**
- ✅ Everything in Premium
- ✅ **Social Media Metrics**: Twitter, Facebook, Instagram mentions
- ✅ **Market Analysis**: Domain value estimates, recent sales
- ✅ **Real-time Monitoring**: Live updates
- ✅ **API Access**: Direct API access

## Setting Up Real APIs

### 1. **Semrush API** (Premium+)
```bash
# Get API key from https://www.semrush.com/api/
SEMRUSH_API_KEY=your_real_api_key_here
```

### 2. **Moz API** (Premium+)
```bash
# Get API key from https://moz.com/products/mozscape/api
MOZ_API_KEY=your_real_moz_api_key_here
```

### 3. **Ahrefs API** (Premium+)
```bash
# Get API key from https://ahrefs.com/api
AHREFS_API_KEY=your_real_ahrefs_api_key_here
```

### 4. **Doma Mainnet** (All Tiers)
```bash
# Switch to mainnet for real blockchain data
DOMA_API_ENDPOINT=https://api.doma.xyz
DOMA_GRAPHQL_ENDPOINT=https://api.doma.xyz/graphql
DOMA_RPC_ENDPOINT=https://rpc.doma.xyz
```

## How Subscription Features Work

### **Domain Scoring**
- **Free**: Basic scoring with mock data
- **Premium**: Real SEO data from Semrush/Moz/Ahrefs
- **Pro**: All data + market analysis + social metrics

### **Subscription Management**
- **Free**: 3 domains, 10 requests/day
- **Premium**: 25 domains, 100 requests/day
- **Pro**: 100 domains, 500 requests/day

### **Real-time Monitoring**
- **Free**: Basic alerts
- **Premium**: Advanced alerts with real data
- **Pro**: Real-time monitoring with custom alerts

## Testing the System

### 1. **Test Free Tier**
```bash
node -e "
const DomainScoringService = require('./src/services/domainScoringService');
const service = new DomainScoringService();
service.calculateDomainScore('google.com', 12345).then(console.log);
"
```

### 2. **Test Premium Tier**
```bash
# After setting up real API keys
node -e "
const DomainScoringService = require('./src/services/domainScoringService');
const service = new DomainScoringService();
// This will use real Semrush/Moz/Ahrefs data
service.calculateDomainScore('google.com', 12345).then(console.log);
"
```

## Revenue Model

### **Free Tier**
- **Purpose**: User acquisition
- **Limits**: 3 domains, basic features
- **Monetization**: Ads, upgrade prompts

### **Premium Tier ($9.99/month)**
- **Target**: Domain investors, SEO professionals
- **Features**: Real SEO data, 25 domains
- **Value**: Professional domain analysis

### **Pro Tier ($29.99/month)**
- **Target**: Agencies, power users
- **Features**: All data, API access, 100 domains
- **Value**: Complete domain intelligence platform

## Next Steps

1. **Set up real API keys** for Semrush, Moz, Ahrefs
2. **Switch to Doma mainnet** for real blockchain data
3. **Implement payment system** for subscriptions
4. **Add user management** for tier tracking
5. **Create upgrade flow** in Telegram bot

## Current Status

✅ **Mock data system working**
✅ **Subscription tier structure created**
✅ **Real data service implemented**
⏳ **API keys need to be configured**
⏳ **Payment system needs implementation**
⏳ **User management needs database**

The foundation is ready - you just need to add real API keys and implement the payment system!
