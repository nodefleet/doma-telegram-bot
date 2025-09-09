# Doma Telegram Bot

A Telegram bot that provides comprehensive domain scoring using the Doma infrastructure. The bot analyzes domains based on multiple factors including blockchain activity, popularity, market trends, and more.

## Features

- **Comprehensive Domain Scoring** - Analyzes domains across 9 different traits
- **Blockchain Integration** - Uses Doma API for on-chain domain data
- **Web3 Domain Support** - Specialized analysis for crypto domains
- **Real-time Event Monitoring** - Tracks domain activities, sales, and offers
- **Subscription Management** - Subscribe to domains for alerts and updates
- **Periodic Status Reports** - Regular domain status updates (10min, 30min, 12h, 1day)
- **External API Integration** - Moz, Ahrefs, Semrush for real-world metrics
- **Detailed Breakdown** - Shows individual trait scores and weights
- **User-friendly Interface** - Clean Telegram interface with emojis and formatting

## Domain Scoring Traits

The bot analyzes domains based on these factors:

1. **Popularity** (15% weight) - Domain recognition and search volume
2. **Blockchain Activity** (20% weight) - On-chain activity and ownership
3. **Extension Value** (15% weight) - TLD value and market demand
4. **Sale Volume** (10% weight) - Historical sales data
5. **Length Score** (5% weight) - Domain length optimization
6. **Brand Score** (15% weight) - Brandability and memorability
7. **Market Trends** (10% weight) - Current market sentiment
8. **Traffic Score** (5% weight) - Website traffic metrics
9. **Cross-Extension** (5% weight) - Availability across TLDs

## Prerequisites

- Node.js 16.0.0 or higher
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Access to Doma API (testnet endpoints are used by default)

## Installation

1. **Clone or download the project**
   ```bash
   cd "Doma Bot"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Telegram bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```

4. **Create logs directory** (if not already created)
   ```bash
   mkdir -p logs
   ```

## Getting a Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the bot token and add it to your `.env` file

## Usage

### Start the bot
```bash
npm start
```

### Development mode (with auto-restart)
```bash
npm run dev
```

### Bot Commands

#### **Core Commands**
- `/start` - Welcome message and introduction
- `/help` - Show available commands
- `/about` - Learn about the bot and scoring system
- `/score <domain>` - Analyze a domain (e.g., `/score example.com`)
- `/score <domain1> <domain2>` - Analyze multiple domains

#### **Subscription Management**
- `/subscribe <domain>` - Track domain for events and alerts
- `/unsubscribe <domain>` - Stop tracking a domain
- `/my_subscriptions` - View your active subscriptions
- `/alerts` - Configure alert preferences

#### **Periodic Reports**
- `/set_interval <time>` - Set report frequency (10min, 30min, 12h, 1day)
- `/reports on` - Enable periodic status reports
- `/reports off` - Disable periodic status reports
- `/report_help` - View all report interval options

#### **Admin Commands**
- `/stats` - View bot statistics (admin only)

### Examples

#### **Domain Scoring**
```
/score google.com
/score crypto.eth
/score nft.xyz
/score example.com crypto.eth nft.xyz
```

#### **Subscription Management**
```
/subscribe google.com
/subscribe crypto.eth
/my_subscriptions
/unsubscribe google.com
```

#### **Periodic Reports**
```
/set_interval 30min
/reports on
/set_interval 12h
/reports off
```

## Configuration

The bot can be configured through environment variables in `.env`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Doma API Configuration
DOMA_API_ENDPOINT=https://api-testnet.doma.xyz
DOMA_GRAPHQL_ENDPOINT=https://api-testnet.doma.xyz/graphql
DOMA_RPC_ENDPOINT=https://rpc-testnet.doma.xyz

# External API Keys (Optional)
MOZ_API_KEY=your_moz_api_key_here
AHREFS_API_KEY=your_ahrefs_api_key_here
SEMRUSH_API_KEY=your_semrush_api_key_here

# Bot Configuration
BOT_PREFIX=/doma
MAX_DOMAINS_PER_REQUEST=5
CACHE_TTL_MINUTES=30

# Logging
LOG_LEVEL=info
```

## API Integration

### Doma API
The bot integrates with Doma's GraphQL API (testnet) to fetch:

#### **Available Endpoints:**
- `names()` - Paginated list of tokenized names with filters
- `name()` - Individual domain data by name
- `tokens()` - Token information for domains
- `nameActivities()` - Domain activity history
- `listings()` - Domain sales listings
- `offers()` - Domain purchase offers
- `nameStatistics()` - Domain-specific statistics
- `chainStatistics()` - Overall blockchain statistics

#### **Data Retrieved:**
- Domain registration and expiration data
- Blockchain events and activities
- Sales history and current listings
- Token information and fractionalization
- Market statistics and trends
- Similar domains and cross-references

### External APIs (Required for Accurate Scoring)
**⚠️ IMPORTANT:** Without these APIs, domain scoring will be inaccurate and similar for all domains.

#### **Moz API** - Domain Authority & Popularity
- **What it provides:** Domain Authority (0-100), Page Authority, link metrics
- **Why it's critical:** Real popularity data instead of basic heuristics
- **How to get:** Sign up at [Moz.com](https://moz.com) → API Access
- **Cost:** Free tier available, paid plans for higher limits

#### **Ahrefs API** - Backlinks & Traffic
- **What it provides:** Domain Rating, backlink count, organic traffic estimates
- **Why it's critical:** Real traffic and authority data
- **How to get:** Sign up at [Ahrefs.com](https://ahrefs.com) → API Access
- **Cost:** Paid service, but essential for accurate scoring

#### **Semrush API** - Search Volume & Keywords
- **What it provides:** Organic traffic, keyword rankings, search volume
- **Why it's critical:** Real search popularity and market data
- **How to get:** Sign up at [Semrush.com](https://semrush.com) → API Access
- **Cost:** Free tier available, paid plans for higher limits

#### **Why Google vs nodefleet.org Have Similar Scores:**
Without these APIs, the bot uses basic heuristics:
- Domain length (shorter = better)
- Extension popularity (.com = 100, .org = 90)
- Simple pattern matching

**With APIs:** Google would score 95+ (high DA, massive traffic, millions of backlinks)
**Without APIs:** Both score ~50-60 (same length, same extension logic)

## Project Structure

```
Doma Bot/
├── src/
│   ├── config/
│   │   └── config.js                    # Configuration management
│   ├── services/
│   │   ├── domaService.js              # Doma API integration
│   │   ├── domainScoringService.js     # Scoring algorithm
│   │   └── SubscriptionService.js      # Subscription & monitoring
│   ├── utils/
│   │   ├── domainValidator.js          # Domain validation
│   │   ├── responseFormatter.js        # Telegram response formatting
│   │   ├── SubscriptionFormatter.js    # Subscription message formatting
│   │   ├── PeriodicReportFormatter.js  # Periodic report formatting
│   │   └── logger.js                   # Logging utility
│   └── index.js                        # Main bot file
├── logs/                               # Log files
├── package.json
├── .env.example
└── README.md
```

## Scoring Algorithm

The scoring system uses weighted factors to calculate an overall score (0-100):

1. **Data Collection** - Fetches data from Doma API and external sources
2. **Trait Calculation** - Calculates individual scores for each trait
3. **Weighted Scoring** - Applies weights to each trait score
4. **Overall Score** - Combines weighted scores for final result
5. **Caching** - Stores results for performance

## Error Handling

The bot includes comprehensive error handling:
- Invalid domain format detection
- API timeout and error recovery
- Rate limiting protection
- User-friendly error messages
- Detailed logging for debugging

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All log messages
- `error.log` - Error messages only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Verify your bot token is correct
3. Ensure all dependencies are installed
4. Check Doma API availability

### **Scoring Accuracy Issues**

**Problem:** All domains have similar scores (50-60 range)
**Cause:** Missing external API keys (Moz, Ahrefs, Semrush)
**Solution:** 
1. Sign up for external API services
2. Add API keys to `.env` file
3. Restart the bot

**Expected Results with APIs:**
- Google.com: 95+ (high authority, massive traffic)
- nodefleet.org: 30-40 (low authority, minimal traffic)
- crypto.eth: 60-70 (good for Web3, moderate authority)

**Current Mock Data:**
- All domains use basic heuristics
- No real-world popularity data
- Similar scores for different domains

## Subscription & Monitoring Features

### **Real-time Event Monitoring**
- **Activity Tracking** - Monitors domain transfers, registrations, updates
- **Sales Alerts** - Notifies when domains are listed for sale
- **Offer Notifications** - Alerts for new purchase offers
- **Price Changes** - Tracks listing price updates
- **Expiration Warnings** - Alerts before domain expiration

### **Periodic Status Reports**
- **Customizable Intervals** - 10 minutes, 30 minutes, 12 hours, or 1 day
- **Comprehensive Reports** - Current score, status, activities, listings, offers
- **Multi-domain Support** - Reports on all subscribed domains
- **Visual Indicators** - Color-coded scores and status emojis

### **Subscription Management**
- **Easy Subscribe/Unsubscribe** - Simple commands to manage domains
- **Preference Settings** - Customize which alerts you receive
- **Score Thresholds** - Set minimum scores for notifications
- **User-specific Settings** - Each user has independent preferences

## Roadmap

- [x] Real-time domain event monitoring
- [x] Subscription management system
- [x] Periodic status reports
- [x] Enhanced subscription messages with current scores
- [ ] Add more external API integrations (Moz, Ahrefs, Semrush)
- [ ] Implement domain comparison features
- [ ] Add historical score tracking
- [ ] Create web dashboard
- [ ] Add bulk domain analysis
- [ ] Implement advanced filtering options
# domabot
