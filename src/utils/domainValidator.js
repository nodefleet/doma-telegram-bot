/**
 * Domain validation utilities
 */

class DomainValidator {
  /**
   * Validate domain format
   * @param {string} domain - Domain to validate
   * @returns {Object} Validation result
   */
  static validateDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return { valid: false, error: 'Domain must be a non-empty string' };
    }

    // Remove protocol if present
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Basic domain regex
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!domainRegex.test(cleanDomain)) {
      return { valid: false, error: 'Invalid domain format' };
    }

    // Check length
    if (cleanDomain.length > 253) {
      return { valid: false, error: 'Domain too long (max 253 characters)' };
    }

    // Check for valid TLD
    const parts = cleanDomain.split('.');
    if (parts.length < 2) {
      return { valid: false, error: 'Domain must have at least one subdomain and TLD' };
    }

    const tld = parts[parts.length - 1];
    if (tld.length < 2) {
      return { valid: false, error: 'TLD must be at least 2 characters' };
    }

    return { valid: true, domain: cleanDomain };
  }

  /**
   * Check if domain is valid (simple boolean check)
   * @param {string} domain - Domain to validate
   * @returns {boolean} True if valid
   */
  static isValidDomain(domain) {
    const result = this.validateDomain(domain);
    return result.valid;
  }

  /**
   * Extract domain from various input formats
   * @param {string} input - User input
   * @returns {string|null} Extracted domain or null
   */
  static extractDomain(input) {
    if (!input) return null;

    // Remove common prefixes/suffixes
    let domain = input.trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .split('/')[0]
      .split('?')[0]
      .split('#')[0];

    const validation = this.validateDomain(domain);
    return validation.valid ? validation.domain : null;
  }

  /**
   * Check if domain is a valid web3 domain
   * @param {string} domain - Domain to check
   * @returns {boolean} True if web3 domain
   */
  static isWeb3Domain(domain) {
    const web3Extensions = [
      'eth', 'crypto', 'nft', 'dao', 'defi', 'blockchain',
      'bitcoin', 'ethereum', 'polygon', 'arbitrum', 'optimism'
    ];
    
    const extension = domain.split('.').pop().toLowerCase();
    return web3Extensions.includes(extension);
  }

  /**
   * Get domain type
   * @param {string} domain - Domain to analyze
   * @returns {string} Domain type
   */
  static getDomainType(domain) {
    const extension = domain.split('.').pop().toLowerCase();
    
    if (this.isWeb3Domain(domain)) {
      return 'web3';
    }
    
    const traditionalExtensions = ['com', 'org', 'net', 'edu', 'gov'];
    if (traditionalExtensions.includes(extension)) {
      return 'traditional';
    }
    
    const newExtensions = ['io', 'ai', 'xyz', 'co', 'me', 'app'];
    if (newExtensions.includes(extension)) {
      return 'new_gTLD';
    }
    
    return 'other';
  }
}

module.exports = DomainValidator;
