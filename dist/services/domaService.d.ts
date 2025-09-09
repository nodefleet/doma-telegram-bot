import { DomaData, DomainData, Activity, Listing, Offer, SimilarDomain } from '../types';
export declare class DomaService {
    constructor();
    /**
     * Fetch domain information from Doma subgraph
     * @param domain - Domain name to query
     * @returns Domain data
     */
    getDomainData(domain: string): Promise<DomainData | null>;
    /**
     * Fetch domain activities
     * @param domain - Domain name
     * @returns Array of activities
     */
    getDomainActivities(domain: string): Promise<Activity[]>;
    /**
     * Fetch domain listings
     * @param domain - Domain name
     * @returns Array of listings
     */
    getDomainListings(domain: string): Promise<Listing[]>;
    /**
     * Fetch domain offers
     * @param domain - Domain name
     * @returns Array of offers
     */
    getDomainOffers(domain: string): Promise<Offer[]>;
    /**
     * Fetch similar domains
     * @param domain - Domain name
     * @returns Array of similar domains
     */
    getSimilarDomains(domain: string): Promise<SimilarDomain[]>;
    /**
     * Get comprehensive domain data
     * @param domain - Domain name
     * @returns Complete domain data
     */
    getComprehensiveDomainData(domain: string): Promise<DomaData>;
}
export default DomaService;
//# sourceMappingURL=domaService.d.ts.map