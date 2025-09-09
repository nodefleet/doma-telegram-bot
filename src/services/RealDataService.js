const axios = require('axios');
const logger = require('../utils/logger');

class RealDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Get real domain data based on subscription tier
   */
  async getDomainData(domain, subscriptionTier = 'free') {
    const cacheKey = `${domain}_${subscriptionTier}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const data = {
      domain,
      subscriptionTier,
      timestamp: new Date().toISOString()
    };

    try {
      // Free tier: Basic data only
      if (subscriptionTier === 'free') {
        data.basic = await this.getBasicData(domain);
        data.whois = await this.getWhoisData(domain);
        data.dns = await this.getDnsData(domain);
      }
      
      // Premium tier: Add external APIs
      else if (subscriptionTier === 'premium') {
        data.basic = await this.getBasicData(domain);
        data.whois = await this.getWhoisData(domain);
        data.dns = await this.getDnsData(domain);
        data.semrush = await this.getSemrushData(domain);
        data.moz = await this.getMozData(domain);
        data.ahrefs = await this.getAhrefsData(domain);
      }
      
      // Pro tier: All data + real-time monitoring
      else if (subscriptionTier === 'pro') {
        data.basic = await this.getBasicData(domain);
        data.whois = await this.getWhoisData(domain);
        data.dns = await this.getDnsData(domain);
        data.semrush = await this.getSemrushData(domain);
        data.moz = await this.getMozData(domain);
        data.ahrefs = await this.getAhrefsData(domain);
        data.social = await this.getSocialData(domain);
        data.market = await this.getMarketData(domain);
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      logger.error(`Error getting real data for ${domain}:`, error);
      return data;
    }
  }

  /**
   * Get basic domain data (free)
   */
  async getBasicData(domain) {
    const domainParts = domain.split('.');
    const name = domainParts[0];
    const extension = domainParts[1];
    
    return {
      domainLength: domain.length,
      nameLength: name.length,
      extension: extension,
      hasNumbers: /\d/.test(name),
      hasHyphens: name.includes('-'),
      isSubdomain: domainParts.length > 2,
      tld: extension,
      isShort: name.length <= 4,
      isBrandable: this.isBrandable(name)
    };
  }

  /**
   * Get WHOIS data (free)
   */
  async getWhoisData(domain) {
    try {
      // Use a free WHOIS API
      const response = await axios.get(`https://whoisjson.com/api/v1/whois/${domain}`, {
        timeout: 10000
      });
      
      return {
        registrar: response.data.registrar,
        creationDate: response.data.creation_date,
        expirationDate: response.data.expiration_date,
        status: response.data.status,
        nameServers: response.data.name_servers
      };
    } catch (error) {
      logger.warn(`Could not get WHOIS data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get DNS data (free)
   */
  async getDnsData(domain) {
    try {
      const dns = require('dns');
      const util = require('util');
      const resolve4 = util.promisify(dns.resolve4);
      const resolveMx = util.promisify(dns.resolveMx);
      const resolveTxt = util.promisify(dns.resolveTxt);
      
      const [ipv4, mx, txt] = await Promise.allSettled([
        resolve4(domain),
        resolveMx(domain),
        resolveTxt(domain)
      ]);
      
      return {
        ipv4: ipv4.status === 'fulfilled' ? ipv4.value : [],
        mx: mx.status === 'fulfilled' ? mx.value : [],
        txt: txt.status === 'fulfilled' ? txt.value : [],
        hasValidDns: ipv4.status === 'fulfilled' && ipv4.value.length > 0
      };
    } catch (error) {
      logger.warn(`Could not get DNS data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get Semrush data (premium)
   */
  async getSemrushData(domain) {
    try {
      // This would use your actual Semrush API key
      const apiKey = process.env.SEMRUSH_API_KEY;
      if (!apiKey || apiKey === 'your_semrush_api_key_here') {
        return null;
      }

      const response = await axios.get('https://api.semrush.com/', {
        params: {
          type: 'domain_rank',
          key: apiKey,
          domain: domain,
          database: 'us',
          export_columns: 'Dn,Rk,Or,Ot,Oc,Ad,At,Ac,FKn,BKn',
          display_limit: 1
        },
        timeout: 10000
      });

      if (response.data && response.data.includes('ERROR')) {
        throw new Error(`Semrush API error: ${response.data}`);
      }

      const lines = response.data.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('No data returned from Semrush');
      }

      const headers = lines[0].split(';');
      const data = lines[1].split(';');

      const metrics = {};
      headers.forEach((header, index) => {
        if (data[index]) {
          metrics[header.trim()] = data[index].trim();
        }
      });

      return {
        domainRank: parseInt(metrics.Rk) || 0,
        organicTraffic: parseInt(metrics.Or) || 0,
        organicKeywords: parseInt(metrics.Ot) || 0,
        organicCost: parseInt(metrics.Oc) || 0,
        adwordsTraffic: parseInt(metrics.Ad) || 0,
        adwordsKeywords: parseInt(metrics.At) || 0,
        adwordsCost: parseInt(metrics.Ac) || 0,
        featuredKeywords: parseInt(metrics.FKn) || 0,
        brandedKeywords: parseInt(metrics.BKn) || 0
      };
    } catch (error) {
      logger.warn(`Could not get Semrush data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get Moz data (premium)
   */
  async getMozData(domain) {
    try {
      const apiKey = process.env.MOZ_API_KEY;
      if (!apiKey || apiKey === 'your_moz_api_key_here') {
        return null;
      }

      // Implement Moz API call
      return {
        domainAuthority: 0,
        pageAuthority: 0,
        backlinks: 0,
        referringDomains: 0
      };
    } catch (error) {
      logger.warn(`Could not get Moz data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get Ahrefs data (premium)
   */
  async getAhrefsData(domain) {
    try {
      const apiKey = process.env.AHREFS_API_KEY;
      if (!apiKey || apiKey === 'your_ahrefs_api_key_here') {
        return null;
      }

      // Implement Ahrefs API call
      return {
        domainRating: 0,
        backlinks: 0,
        referringDomains: 0,
        organicTraffic: 0
      };
    } catch (error) {
      logger.warn(`Could not get Ahrefs data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get social media data (pro)
   */
  async getSocialData(domain) {
    try {
      // This would integrate with social media APIs
      return {
        twitterMentions: 0,
        facebookLikes: 0,
        instagramFollowers: 0,
        linkedinFollowers: 0
      };
    } catch (error) {
      logger.warn(`Could not get social data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Get market data (pro)
   */
  async getMarketData(domain) {
    try {
      // This would integrate with domain market APIs
      return {
        estimatedValue: 0,
        recentSales: [],
        marketTrends: [],
        comparableDomains: []
      };
    } catch (error) {
      logger.warn(`Could not get market data for ${domain}:`, error.message);
      return null;
    }
  }

  /**
   * Check if domain name is brandable
   */
  isBrandable(name) {
    const brandablePatterns = [
      /^[a-z]{2,6}$/i, // 2-6 letters
      /^[a-z]+[aeiou][a-z]+$/i, // Contains vowels
      /^[a-z]{3,5}[aeiou]$/i, // Ends with vowel
    ];
    
    return brandablePatterns.some(pattern => pattern.test(name));
  }

  /**
   * Get subscription tier for user
   */
  getUserSubscriptionTier(userId) {
    // This would check against your user database
    // For now, return 'free' as default
    return 'free';
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = RealDataService;
