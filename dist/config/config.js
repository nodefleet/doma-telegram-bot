"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    telegram: {
        token: process.env['TELEGRAM_BOT_TOKEN'] || '',
    },
    doma: {
        apiEndpoint: process.env['DOMA_API_ENDPOINT'] || 'https://api-testnet.doma.xyz',
        graphqlEndpoint: process.env['DOMA_GRAPHQL_ENDPOINT'] || 'https://api-testnet.doma.xyz/graphql',
        rpcEndpoint: process.env['DOMA_RPC_ENDPOINT'] || 'https://rpc-testnet.doma.xyz',
        apiKey: process.env['DOMA_API_KEY'] || undefined
    },
    external: {
        moz: {
            apiKey: process.env['MOZ_API_KEY'] || undefined
        },
        ahrefs: {
            apiKey: process.env['AHREFS_API_KEY'] || undefined
        },
        semrush: {
            apiKey: process.env['SEMRUSH_API_KEY'] || undefined
        }
    },
    bot: {
        prefix: process.env['BOT_PREFIX'] || '/doma',
        maxDomainsPerRequest: parseInt(process.env['MAX_DOMAINS_PER_REQUEST'] || '5'),
        cacheTtlMinutes: parseInt(process.env['CACHE_TTL_MINUTES'] || '30')
    },
    logging: {
        level: process.env['LOG_LEVEL'] || 'info'
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map