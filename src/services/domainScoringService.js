const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class DomainScoringService {
  constructor() {
    this.domaService = require('./domaService');
    this.cache = new Map();
  }

  /**
   * Calculate comprehensive domain score based on multiple factors
   * @param {string} domain - Domain name
   * @returns {Promise<Object>} Domain score and breakdown
   */
  async calculateDomainScore(domain) {
    try {
      // Check cache first
      const cacheKey = `score_${domain}`;
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < config.bot.cacheTtlMinutes * 60 * 1000) {
          return cached.data;
        }
      }

      logger.info(`Calculating domain score for: ${domain}`);

      // Fetch data from multiple sources
      const [domaData, externalMetrics] = await Promise.all([
        this.getDomaMetrics(domain),
        this.getExternalMetrics(domain)
      ]);

      // Calculate individual trait scores
      const scores = {
        popularity: this.calculatePopularityScore(domain, externalMetrics),
        blockchain: this.calculateBlockchainScore(domaData),
        extension: this.calculateExtensionScore(domain),
        saleVolume: this.calculateSaleVolumeScore(domaData),
        length: this.calculateLengthScore(domain),
        brandScore: this.calculateBrandScore(domain, externalMetrics),
        marketTrends: this.calculateMarketTrendsScore(domain, externalMetrics),
        traffic: this.calculateTrafficScore(externalMetrics),
        crossExtension: this.calculateCrossExtensionScore(domain, domaData)
      };

      // Calculate weighted overall score
      const weights = {
        popularity: 0.15,
        blockchain: 0.20,
        extension: 0.15,
        saleVolume: 0.10,
        length: 0.05,
        brandScore: 0.15,
        marketTrends: 0.10,
        traffic: 0.05,
        crossExtension: 0.05
      };

      const overallScore = Object.keys(scores).reduce((total, key) => {
        return total + (scores[key] * weights[key]);
      }, 0);

      const result = {
        domain,
        overallScore: Math.round(overallScore * 100) / 100,
        scores,
        weights,
        breakdown: this.generateScoreBreakdown(scores, weights),
        timestamp: new Date().toISOString(),
        data: {
          doma: domaData,
          external: externalMetrics
        }
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      logger.error(`Error calculating domain score for ${domain}:`, error);
      throw new Error(`Failed to calculate domain score: ${error.message}`);
    }
  }

  /**
   * Get Doma-specific metrics
   */
  async getDomaMetrics(domain) {
    const domaService = new this.domaService();
    const [domainData, activities, listings, offers, similar] = await Promise.all([
      domaService.getDomainData(domain),
      domaService.getDomainActivities(domain),
      domaService.getDomainListings(domain),
      domaService.getDomainOffers(domain),
      domaService.getSimilarDomains(domain)
    ]);

    return {
      domainData,
      activities,
      listings,
      offers,
      similar
    };
  }

  /**
   * Get external metrics from various APIs
   */
  async getExternalMetrics(domain) {
    const metrics = {};

    try {
      // Add external API calls here when keys are available
      if (config.external.moz.apiKey) {
        metrics.moz = await this.getMozMetrics(domain);
      }
      if (config.external.ahrefs.apiKey) {
        metrics.ahrefs = await this.getAhrefsMetrics(domain);
      }
      if (config.external.semrush.apiKey) {
        metrics.semrush = await this.getSemrushMetrics(domain);
      }

      // Basic metrics that don't require API keys
      metrics.basic = await this.getBasicMetrics(domain);
    } catch (error) {
      logger.warn(`Error fetching external metrics for ${domain}:`, error);
    }

    return metrics;
  }

  /**
   * Calculate popularity score (0-100)
   */
  calculatePopularityScore(domain, externalMetrics) {
    let score = 0;
    
    // Domain length factor (shorter = more popular)
    const lengthFactor = Math.max(0, 100 - (domain.length * 5));
    score += lengthFactor * 0.3;

    // Extension popularity
    const extension = domain.split('.').pop();
    const popularExtensions = ['com', 'org', 'net', 'io', 'co', 'ai', 'xyz', 'eth'];
    const extensionScore = popularExtensions.includes(extension) ? 100 : 50;
    score += extensionScore * 0.4;

    // External metrics
    if (externalMetrics.moz) {
      score += (externalMetrics.moz.domainAuthority || 0) * 0.3;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate blockchain score (0-100)
   */
  calculateBlockchainScore(domaData) {
    if (!domaData) return 0;

    let score = 0;

    // Domain exists on blockchain
    if (domaData.domainData) {
      score += 30;
    }

    // Has resolver
    if (domaData.domainData?.resolver) {
      score += 20;
    }

    // Has text records
    if (domaData.domainData?.resolver?.textRecords?.length > 0) {
      score += 20;
    }

    // Activity level (activities)
    const activityCount = domaData.activities?.length || 0;
    score += Math.min(30, activityCount * 2);

    return Math.min(100, score);
  }

  /**
   * Calculate extension score (0-100)
   */
  calculateExtensionScore(domain) {
    const extension = domain.split('.').pop().toLowerCase();
    
    const extensionScores = {
      'com': 100,
      'org': 90,
      'net': 85,
      'io': 80,
      'co': 75,
      'ai': 70,
      'xyz': 65,
      'eth': 60,
      'crypto': 55,
      'nft': 50
    };

    return extensionScores[extension] || 30;
  }

  /**
   * Calculate sale volume score (0-100)
   */
  calculateSaleVolumeScore(domaData) {
    const listings = domaData.listings || [];
    const offers = domaData.offers || [];
    
    if (listings.length === 0 && offers.length === 0) return 0;

    const allSales = [...listings, ...offers];
    const totalVolume = allSales.reduce((sum, sale) => sum + (parseFloat(sale.priceInUSD) || 0), 0);
    const avgPrice = totalVolume / allSales.length;

    // Score based on average sale price
    if (avgPrice > 10000) return 100;
    if (avgPrice > 5000) return 80;
    if (avgPrice > 1000) return 60;
    if (avgPrice > 100) return 40;
    if (avgPrice > 10) return 20;
    return 10;
  }

  /**
   * Calculate length score (0-100)
   */
  calculateLengthScore(domain) {
    const length = domain.length;
    
    if (length <= 3) return 100;
    if (length <= 5) return 90;
    if (length <= 8) return 70;
    if (length <= 12) return 50;
    if (length <= 16) return 30;
    return 10;
  }

  /**
   * Calculate brand score (0-100)
   */
  calculateBrandScore(domain, externalMetrics) {
    let score = 0;
    
    // Check for brandable characteristics
    const name = domain.split('.')[0];
    
    // Length factor
    if (name.length >= 4 && name.length <= 8) score += 20;
    
    // No numbers or hyphens
    if (!/\d/.test(name) && !/-/.test(name)) score += 20;
    
    // Memorable patterns
    if (/^[aeiou]/.test(name)) score += 15; // Starts with vowel
    if (/[aeiou]$/.test(name)) score += 15; // Ends with vowel
    
    // External brand metrics
    if (externalMetrics.basic?.socialMentions) {
      score += Math.min(30, externalMetrics.basic.socialMentions / 100);
    }

    return Math.min(100, score);
  }

  /**
   * Calculate market trends score (0-100)
   */
  calculateMarketTrendsScore(domain, externalMetrics) {
    // This would integrate with trend APIs
    // For now, return a base score
    return 50;
  }

  /**
   * Calculate traffic score (0-100)
   */
  calculateTrafficScore(externalMetrics) {
    if (externalMetrics.moz?.domainAuthority) {
      return Math.min(100, externalMetrics.moz.domainAuthority);
    }
    return 30; // Base score
  }

  /**
   * Calculate cross-extension score (0-100)
   */
  calculateCrossExtensionScore(domain, domaData) {
    const similar = domaData.similar || [];
    const baseName = domain.split('.')[0];
    
    // Count how many extensions this base name has
    const extensionCount = new Set(similar.map(d => d.name.split('.')[1])).size;
    
    return Math.min(100, extensionCount * 20);
  }

  /**
   * Get basic metrics without API keys
   */
  async getBasicMetrics(domain) {
    return {
      domainLength: domain.length,
      hasNumbers: /\d/.test(domain),
      hasHyphens: /-/.test(domain),
      extension: domain.split('.').pop(),
      socialMentions: 0 // Placeholder
    };
  }

  /**
   * Get Moz metrics (placeholder)
   */
  async getMozMetrics(domain) {
    // Implement Moz API integration
    return { domainAuthority: 0, pageAuthority: 0 };
  }

  /**
   * Get Ahrefs metrics (placeholder)
   */
  async getAhrefsMetrics(domain) {
    // Implement Ahrefs API integration
    return { domainRating: 0, backlinks: 0 };
  }

  /**
   * Get Semrush metrics (placeholder)
   */
  async getSemrushMetrics(domain) {
    // Implement Semrush API integration
    return { organicTraffic: 0, keywords: 0 };
  }

  /**
   * Generate human-readable score breakdown
   */
  generateScoreBreakdown(scores, weights) {
    const breakdown = [];
    
    Object.keys(scores).forEach(key => {
      const score = scores[key];
      const weight = weights[key];
      const contribution = score * weight;
      
      breakdown.push({
        trait: key,
        score: Math.round(score),
        weight: Math.round(weight * 100),
        contribution: Math.round(contribution * 100) / 100
      });
    });

    return breakdown.sort((a, b) => b.contribution - a.contribution);
  }
}

module.exports = DomainScoringService;
