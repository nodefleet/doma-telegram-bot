/**
 * Domain validation utilities
 */
import { ValidationResult } from '../types';
export declare class DomainValidator {
    /**
     * Validate domain format
     * @param domain - Domain to validate
     * @returns Validation result
     */
    static validateDomain(domain: string): ValidationResult;
    /**
     * Check if domain is valid (simple boolean check)
     * @param domain - Domain to validate
     * @returns True if valid
     */
    static isValidDomain(domain: string): boolean;
    /**
     * Extract domain from various input formats
     * @param input - User input
     * @returns Extracted domain or null
     */
    static extractDomain(input: string): string | null;
    /**
     * Check if domain is a Web3 domain
     * @param domain - Domain to check
     * @returns True if Web3 domain
     */
    static isWeb3Domain(domain: string): boolean;
    /**
     * Get domain type classification
     * @param domain - Domain to classify
     * @returns Domain type
     */
    static getDomainType(domain: string): string;
}
export default DomainValidator;
//# sourceMappingURL=domainValidator.d.ts.map