"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomaService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class DomaService {
    // private graphqlClient: GraphQLClient;
    // private apiClient: AxiosInstance;
    constructor() {
        // this.graphqlClient = new GraphQLClient(config.doma.graphqlEndpoint, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // Add API key header if available
        //     ...(config.doma.apiKey && { 'X-API-Key': config.doma.apiKey }),
        //   }
        // });
        // this.apiClient = axios.create({
        //   baseURL: config.doma.apiEndpoint,
        //   timeout: 10000
        // });
    }
    /**
     * Fetch domain information from Doma subgraph
     * @param domain - Domain name to query
     * @returns Domain data
     */
    async getDomainData(domain) {
        try {
            // For now, return mock data since API requires authentication
            // In production, you would need to get an API key from Doma
            logger_1.default.info(`Fetching domain data for: ${domain} (using mock data)`);
            // Mock domain data
            const mockData = {
                name: domain,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                tokenizedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                eoi: '0x1234567890abcdef',
                registrar: 'Doma Registrar',
                nameservers: ['ns1.doma.xyz', 'ns2.doma.xyz'],
                dsKeys: ['12345 8 2 ABCDEF'],
                transferLock: false,
                claimedBy: '0xabcdef1234567890',
                tokens: [
                    {
                        id: '0xtoken123',
                        symbol: 'DOMA',
                        decimals: 18,
                        totalSupply: '1000000000000000000000000'
                    }
                ],
                activities: [
                    {
                        id: 'activity1',
                        type: 'REGISTRATION',
                        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        blockNumber: 12345678,
                        transactionHash: '0xabcdef1234567890'
                    }
                ],
                isFractionalized: false,
                fractionalTokenInfo: {
                    tokenAddress: '0x0000000000000000000000000000000000000000',
                    totalSupply: '0',
                    decimals: 18
                }
            };
            return mockData;
        }
        catch (error) {
            logger_1.default.error(`Error fetching domain data for ${domain}:`, error);
            return null;
        }
    }
    /**
     * Fetch domain activities
     * @param domain - Domain name
     * @returns Array of activities
     */
    async getDomainActivities(domain) {
        try {
            logger_1.default.info(`Fetching domain activities for: ${domain} (using mock data)`);
            // Mock activities data
            const mockActivities = [
                {
                    id: 'activity1',
                    type: 'REGISTRATION',
                    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    blockNumber: 12345678,
                    transactionHash: '0xabcdef1234567890'
                },
                {
                    id: 'activity2',
                    type: 'TRANSFER',
                    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    blockNumber: 12345679,
                    transactionHash: '0x1234567890abcdef'
                }
            ];
            return mockActivities;
        }
        catch (error) {
            logger_1.default.error(`Error fetching activities for ${domain}:`, error);
            return [];
        }
    }
    /**
     * Fetch domain listings
     * @param domain - Domain name
     * @returns Array of listings
     */
    async getDomainListings(domain) {
        try {
            logger_1.default.info(`Fetching domain listings for: ${domain} (using mock data)`);
            // Mock listings data
            const mockListings = [
                {
                    id: 'listing1',
                    price: '1.5',
                    priceInUSD: '3000',
                    currency: 'ETH',
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'ACTIVE'
                }
            ];
            return mockListings;
        }
        catch (error) {
            logger_1.default.error(`Error fetching listings for ${domain}:`, error);
            return [];
        }
    }
    /**
     * Fetch domain offers
     * @param domain - Domain name
     * @returns Array of offers
     */
    async getDomainOffers(domain) {
        try {
            logger_1.default.info(`Fetching domain offers for: ${domain} (using mock data)`);
            // Mock offers data
            const mockOffers = [
                {
                    id: 'offer1',
                    price: '1.2',
                    priceInUSD: '2400',
                    currency: 'ETH',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'PENDING'
                }
            ];
            return mockOffers;
        }
        catch (error) {
            logger_1.default.error(`Error fetching offers for ${domain}:`, error);
            return [];
        }
    }
    /**
     * Fetch similar domains
     * @param domain - Domain name
     * @returns Array of similar domains
     */
    async getSimilarDomains(domain) {
        try {
            logger_1.default.info(`Fetching similar domains for: ${domain} (using mock data)`);
            // Mock similar domains data
            const baseName = domain.split('.')[0];
            const mockSimilar = [
                { name: `${baseName}.com`, score: 85 },
                { name: `${baseName}.net`, score: 70 },
                { name: `${baseName}.org`, score: 65 },
                { name: `${baseName}.io`, score: 60 }
            ];
            return mockSimilar;
        }
        catch (error) {
            logger_1.default.error(`Error fetching similar domains for ${domain}:`, error);
            return [];
        }
    }
    /**
     * Get comprehensive domain data
     * @param domain - Domain name
     * @returns Complete domain data
     */
    async getComprehensiveDomainData(domain) {
        try {
            const [domainData, activities, listings, offers, similar] = await Promise.all([
                this.getDomainData(domain),
                this.getDomainActivities(domain),
                this.getDomainListings(domain),
                this.getDomainOffers(domain),
                this.getSimilarDomains(domain)
            ]);
            return {
                domainData: domainData || undefined,
                activities,
                listings,
                offers,
                similar
            };
        }
        catch (error) {
            logger_1.default.error(`Error fetching comprehensive data for ${domain}:`, error);
            return {
                domainData: undefined,
                activities: [],
                listings: [],
                offers: [],
                similar: []
            };
        }
    }
}
exports.DomaService = DomaService;
exports.default = DomaService;
//# sourceMappingURL=domaService.js.map