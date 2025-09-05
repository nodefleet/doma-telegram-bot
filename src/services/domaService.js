const axios = require('axios');
const { GraphQLClient } = require('graphql-request');
const config = require('../config/config');
const logger = require('../utils/logger');

class DomaService {
  constructor() {
    this.graphqlClient = new GraphQLClient(config.doma.graphqlEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        // Add API key header if available
        // 'Authorization': `Bearer ${config.doma.apiKey}`,
        // 'X-API-Key': config.doma.apiKey,
      }
    });
    this.apiClient = axios.create({
      baseURL: config.doma.apiEndpoint,
      timeout: 10000
    });
  }

  /**
   * Fetch domain information from Doma subgraph
   * @param {string} domain - Domain name to query
   * @returns {Promise<Object>} Domain data
   */
  async getDomainData(domain) {
    try {
      // For now, return mock data since API requires authentication
      // In production, you would need to get an API key from Doma
      logger.info(`Fetching domain data for: ${domain} (using mock data)`);
      
      return {
        name: domain,
        expiresAt: new Date().toISOString(),
        tokenizedAt: null,
        eoi: false,
        registrar: 'Mock Registrar',
        nameservers: [],
        dsKeys: [],
        transferLock: false,
        claimedBy: null,
        tokens: [],
        activities: [],
        isFractionalized: false,
        fractionalTokenInfo: null
      };
    } catch (error) {
      logger.error(`Error fetching domain data for ${domain}:`, error);
      throw new Error(`Failed to fetch domain data: ${error.message}`);
    }
  }

  /**
   * Get domain activities and transactions
   * @param {string} domain - Domain name
   * @returns {Promise<Array>} Domain activities
   */
  async getDomainActivities(domain) {
    try {
      logger.info(`Fetching domain activities for: ${domain} (using mock data)`);
      
      // Mock activities data
      return [
        {
          id: `activity_${domain}_1`,
          blockNumber: 12345,
          transactionHash: '0x1234567890abcdef',
          type: 'REGISTRATION',
          timestamp: new Date().toISOString()
        },
        {
          id: `activity_${domain}_2`,
          blockNumber: 12346,
          transactionHash: '0xabcdef1234567890',
          type: 'TRANSFER',
          timestamp: new Date().toISOString()
        }
      ];
    } catch (error) {
      logger.error(`Error fetching domain activities for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get domain listings
   * @param {string} domain - Domain name
   * @returns {Promise<Array>} Domain listings
   */
  async getDomainListings(domain) {
    try {
      logger.info(`Fetching domain listings for: ${domain} (using mock data)`);
      
      // Mock listings data
      return [
        {
          id: `listing_${domain}_1`,
          price: '1.5',
          priceInUSD: '1500.00',
          timestamp: new Date().toISOString(),
          seller: '0x1234567890abcdef',
          transactionHash: '0x1234567890abcdef'
        }
      ];
    } catch (error) {
      logger.error(`Error fetching domain listings for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get domain offers
   * @param {string} domain - Domain name
   * @returns {Promise<Array>} Domain offers
   */
  async getDomainOffers(domain) {
    try {
      logger.info(`Fetching domain offers for: ${domain} (using mock data)`);
      
      // Mock offers data
      return [
        {
          id: `offer_${domain}_1`,
          price: '1.2',
          priceInUSD: '1200.00',
          timestamp: new Date().toISOString(),
          buyer: '0xabcdef1234567890',
          seller: '0x1234567890abcdef',
          transactionHash: '0xabcdef1234567890'
        }
      ];
    } catch (error) {
      logger.error(`Error fetching domain offers for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get similar domains for comparison
   * @param {string} domain - Domain name
   * @returns {Promise<Array>} Similar domains
   */
  async getSimilarDomains(domain) {
    try {
      logger.info(`Fetching similar domains for: ${domain} (using mock data)`);
      
      // Mock similar domains data
      const baseName = domain.split('.')[0];
      const extensions = ['com', 'org', 'net', 'io', 'xyz'];
      
      return extensions.map(ext => ({
        name: `${baseName}.${ext}`,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      logger.error(`Error fetching similar domains for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get name statistics
   * @returns {Promise<Object>} Name statistics
   */
  async getNameStatistics() {
    try {
      logger.info('Fetching name statistics (using mock data)');
      
      return {
        totalNames: 1000,
        totalTokenizedNames: 500,
        totalRevenue: '1000000.00',
        averagePrice: '2000.00'
      };
    } catch (error) {
      logger.error('Error fetching name statistics:', error);
      return {};
    }
  }

  /**
   * Get chain statistics
   * @returns {Promise<Object>} Chain statistics
   */
  async getChainStatistics() {
    try {
      logger.info('Fetching chain statistics (using mock data)');
      
      return {
        totalTransactions: 50000,
        totalWallets: 10000,
        totalRevenue: '5000000.00',
        averageTransactionValue: '100.00'
      };
    } catch (error) {
      logger.error('Error fetching chain statistics:', error);
      return {};
    }
  }

  /**
   * Get network information
   * @returns {Promise<Object>} Network data
   */
  async getNetworkInfo() {
    try {
      logger.info('Fetching network info (using mock data)');
      
      return {
        networkName: 'Doma Testnet',
        chainId: 12345,
        blockHeight: 1000000,
        gasPrice: '20000000000'
      };
    } catch (error) {
      logger.error('Error fetching network info:', error);
      throw new Error(`Failed to fetch network info: ${error.message}`);
    }
  }

  /**
   * Try to fetch real data from Doma API (requires authentication)
   * @param {string} domain - Domain name
   * @returns {Promise<Object|null>} Real domain data or null if not available
   */
  async tryGetRealDomainData(domain) {
    try {
      // This would be the correct query structure based on the schema we discovered
      const query = `
        query GetDomain($domain: String!) {
          name(name: $domain) {
            name
            expiresAt
            tokenizedAt
            eoi
            registrar
            nameservers
            dsKeys
            transferLock
            claimedBy
            isFractionalized
          }
        }
      `;

      const variables = { domain };
      const data = await this.graphqlClient.request(query, variables);
      
      logger.info(`Successfully fetched real domain data for: ${domain}`);
      return data.name;
    } catch (error) {
      logger.warn(`Could not fetch real data for ${domain}: ${error.message}`);
      return null;
    }
  }
}

module.exports = DomaService;
