"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainValidator = void 0;
class DomainValidator {
    /**
     * Validate domain format
     * @param domain - Domain to validate
     * @returns Validation result
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
        if (!tld || tld.length < 2) {
            return { valid: false, error: 'TLD must be at least 2 characters' };
        }
        return { valid: true, domain: cleanDomain };
    }
    /**
     * Check if domain is valid (simple boolean check)
     * @param domain - Domain to validate
     * @returns True if valid
     */
    static isValidDomain(domain) {
        const result = this.validateDomain(domain);
        return result.valid;
    }
    /**
     * Extract domain from various input formats
     * @param input - User input
     * @returns Extracted domain or null
     */
    static extractDomain(input) {
        if (!input)
            return null;
        // Remove common prefixes/suffixes
        let domain = input.trim()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '')
            .split('/')[0]
            .split('?')[0]
            .split('#')[0];
        // Validate the extracted domain
        const validation = this.validateDomain(domain);
        return validation.valid ? validation.domain || null : null;
    }
    /**
     * Check if domain is a Web3 domain
     * @param domain - Domain to check
     * @returns True if Web3 domain
     */
    static isWeb3Domain(domain) {
        const web3Extensions = [
            'eth', 'crypto', 'nft', 'dao', 'defi', 'web3', 'blockchain',
            'bitcoin', 'btc', 'ethereum', 'polygon', 'solana', 'avalanche'
        ];
        const extension = domain.split('.').pop()?.toLowerCase();
        return extension ? web3Extensions.includes(extension) : false;
    }
    /**
     * Get domain type classification
     * @param domain - Domain to classify
     * @returns Domain type
     */
    static getDomainType(domain) {
        const extension = domain.split('.').pop()?.toLowerCase();
        if (!extension)
            return 'invalid';
        // Traditional TLDs
        const traditionalTlds = ['com', 'org', 'net', 'edu', 'gov', 'mil'];
        if (traditionalTlds.includes(extension)) {
            return 'traditional';
        }
        // Country code TLDs
        if (extension.length === 2) {
            return 'ccTLD';
        }
        // Web3 domains
        if (this.isWeb3Domain(domain)) {
            return 'web3';
        }
        // New gTLDs
        if (extension.length > 3) {
            return 'new_gTLD';
        }
        return 'other';
    }
}
exports.DomainValidator = DomainValidator;
exports.default = DomainValidator;
//# sourceMappingURL=domainValidator.js.map