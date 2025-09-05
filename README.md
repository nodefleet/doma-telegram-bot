# Doma Telegram Bot

A Telegram bot that provides comprehensive domain scoring using the Doma infrastructure. The bot analyzes domains based on multiple factors including blockchain activity, popularity, market trends, and more.

## Features

- **Comprehensive Domain Scoring** - Analyzes domains across 9 different traits
- **Blockchain Integration** - Uses Doma API for on-chain domain data
- **Web3 Domain Support** - Specialized analysis for crypto domains
- **Detailed Breakdown** - Shows individual trait scores and weights
- **Real-time Analysis** - Fresh data with caching for performance
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

- `/start` - Welcome message and introduction
- `/help` - Show available commands
- `/about` - Learn about the bot and scoring system
- `/score <domain>` - Analyze a domain (e.g., `/score example.com`)
- `/score <domain1> <domain2>` - Analyze multiple domains

### Examples

```
/score google.com
/score crypto.eth
/score nft.xyz
/score example.com crypto.eth nft.xyz
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
The bot integrates with Doma's GraphQL API to fetch:
- Domain registration data
- Blockchain events
- Sales history
- Similar domains

### External APIs (Optional)
You can add API keys for enhanced metrics:
- **Moz** - Domain Authority and Page Authority
- **Ahrefs** - Backlink data and domain rating
- **Semrush** - Organic traffic and keyword data

## Project Structure

```
Doma Bot/
├── src/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── services/
│   │   ├── domaService.js     # Doma API integration
│   │   └── domainScoringService.js  # Scoring algorithm
│   ├── utils/
│   │   ├── domainValidator.js # Domain validation
│   │   ├── responseFormatter.js # Telegram response formatting
│   │   └── logger.js          # Logging utility
│   └── index.js               # Main bot file
├── logs/                      # Log files
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

## Roadmap

- [ ] Add more external API integrations
- [ ] Implement domain comparison features
- [ ] Add historical score tracking
- [ ] Create web dashboard
- [ ] Add bulk domain analysis
- [ ] Implement domain monitoring alerts
# domabot
