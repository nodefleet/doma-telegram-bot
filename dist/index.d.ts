declare class DomaTelegramBot {
    private bot;
    private scoringService;
    private subscriptionService;
    constructor();
    private setupHandlers;
    /**
     * Process single domain scoring
     */
    private processSingleDomain;
    /**
     * Process multiple domains
     */
    private processMultipleDomains;
    /**
     * Extract domains from user input
     */
    private extractDomains;
}
export default DomaTelegramBot;
//# sourceMappingURL=index.d.ts.map