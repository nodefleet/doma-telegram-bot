require('dotenv').config();

const config = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    prefix: process.env.BOT_PREFIX || '/doma'
  },
  doma: {
    apiEndpoint: process.env.DOMA_API_ENDPOINT || 'https://api-testnet.doma.xyz',
    graphqlEndpoint: process.env.DOMA_GRAPHQL_ENDPOINT || 'https://api-testnet.doma.xyz/graphql',
    rpcEndpoint: process.env.DOMA_RPC_ENDPOINT || 'https://rpc-testnet.doma.xyz'
  },
  external: {
    moz: {
      apiKey: process.env.MOZ_API_KEY
    },
    ahrefs: {
      apiKey: process.env.AHREFS_API_KEY
    },
    semrush: {
      apiKey: process.env.SEMRUSH_API_KEY
    }
  },
  bot: {
    maxDomainsPerRequest: parseInt(process.env.MAX_DOMAINS_PER_REQUEST) || 5,
    cacheTtlMinutes: parseInt(process.env.CACHE_TTL_MINUTES) || 30
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
