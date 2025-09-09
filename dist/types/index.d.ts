export interface DomainScore {
    domain: string;
    overallScore: number;
    scores: DomainScores;
    weights: DomainWeights;
    breakdown: ScoreBreakdown[];
    timestamp: string;
    data: {
        doma: DomaData;
        external: ExternalMetrics;
    };
}
export interface DomainScores {
    popularity: number;
    blockchain: number;
    extension: number;
    saleVolume: number;
    length: number;
    brandScore: number;
    marketTrends: number;
    traffic: number;
    crossExtension: number;
}
export interface DomainWeights {
    popularity: number;
    blockchain: number;
    extension: number;
    saleVolume: number;
    length: number;
    brandScore: number;
    marketTrends: number;
    traffic: number;
    crossExtension: number;
}
export interface ScoreBreakdown {
    trait: string;
    score: number;
    weight: number;
    contribution: number;
}
export interface DomaData {
    domainData?: DomainData | undefined;
    activities?: Activity[];
    listings?: Listing[];
    offers?: Offer[];
    similar?: SimilarDomain[];
}
export interface DomainData {
    name: string;
    expiresAt?: string;
    tokenizedAt?: string;
    eoi?: string;
    registrar?: string;
    nameservers?: string[];
    dsKeys?: string[];
    transferLock?: boolean;
    claimedBy?: string;
    tokens?: Token[];
    activities?: Activity[];
    isFractionalized?: boolean;
    fractionalTokenInfo?: FractionalTokenInfo;
}
export interface Activity {
    id: string;
    type: string;
    timestamp: string;
    blockNumber?: number;
    transactionHash?: string;
}
export interface Listing {
    id: string;
    price: string;
    priceInUSD: string;
    currency: string;
    timestamp: string;
    status: string;
}
export interface Offer {
    id: string;
    price: string;
    priceInUSD: string;
    currency: string;
    timestamp: string;
    status: string;
}
export interface SimilarDomain {
    name: string;
    score?: number;
}
export interface Token {
    id: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}
export interface FractionalTokenInfo {
    tokenAddress: string;
    totalSupply: string;
    decimals: number;
}
export interface ExternalMetrics {
    moz?: MozMetrics;
    ahrefs?: AhrefsMetrics;
    semrush?: SemrushMetrics;
    basic?: BasicMetrics;
}
export interface MozMetrics {
    domainAuthority: number;
    pageAuthority: number;
    linkingRootDomains: number;
    totalLinks: number;
}
export interface AhrefsMetrics {
    domainRating: number;
    backlinks: number;
    referringDomains: number;
    organicTraffic: number;
}
export interface SemrushMetrics {
    organicTraffic: number;
    keywords: number;
    searchVolume: number;
    cpc: number;
}
export interface BasicMetrics {
    domainLength: number;
    hasNumbers: boolean;
    hasHyphens: boolean;
    extension: string;
    socialMentions: number;
}
export interface UserSubscription {
    domains: Set<string>;
    preferences: AlertPreferences;
}
export interface AlertPreferences {
    priceAlerts: boolean;
    expirationAlerts: boolean;
    saleAlerts: boolean;
    transferAlerts: boolean;
    scoreThreshold: number;
    reportInterval: ReportInterval;
    periodicReports: boolean;
}
export type ReportInterval = '10min' | '30min' | '12h' | '1day';
export interface SubscriptionResult {
    success: boolean;
    message: string;
}
export interface DomainEvent {
    type: 'ACTIVITY' | 'LISTING' | 'OFFER' | 'PRICE_CHANGE' | 'EXPIRATION';
    message: string;
    data: any;
    timestamp: string;
}
export interface StatusReport {
    timestamp: string;
    domains: DomainStatus[];
}
export interface DomainStatus {
    domain: string;
    score: number;
    status: 'Active' | 'Inactive' | 'Error';
    activities: number;
    listings: number;
    offers: number;
    lastActivity: string;
    currentPrice: string | number;
    error?: string;
}
export interface BotConfig {
    telegram: {
        token: string;
    };
    doma: {
        apiEndpoint: string;
        graphqlEndpoint: string;
        rpcEndpoint: string;
        apiKey?: string | undefined;
    };
    external: {
        moz: {
            apiKey?: string | undefined;
        };
        ahrefs: {
            apiKey?: string | undefined;
        };
        semrush: {
            apiKey?: string | undefined;
        };
    };
    bot: {
        prefix: string;
        maxDomainsPerRequest: number;
        cacheTtlMinutes: number;
    };
    logging: {
        level: string;
    };
}
export interface ValidationResult {
    valid: boolean;
    domain?: string;
    error?: string;
}
export interface TelegramMessage {
    chat: {
        id: number;
    };
    from: {
        id: number;
        username?: string;
        first_name?: string;
    };
    text?: string;
    message_id?: number;
}
export interface BotStats {
    totalUsers: number;
    totalDomains: number;
    isMonitoring: boolean;
    activeReportTimers: number;
}
//# sourceMappingURL=index.d.ts.map