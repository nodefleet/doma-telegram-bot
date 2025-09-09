/**
 * Response formatting utilities for Telegram bot
 */
import { DomainScore } from '../types';
export declare class ResponseFormatter {
    /**
     * Format domain score response
     * @param scoreData - Domain score data
     * @returns Formatted response
     */
    static formatDomainScore(scoreData: DomainScore): string;
    /**
     * Format error response
     * @param error - Error message
     * @returns Formatted error response
     */
    static formatError(error: string): string;
    /**
     * Format help message
     * @returns Formatted help message
     */
    static formatHelp(): string;
    /**
     * Format about message
     * @returns Formatted about message
     */
    static formatAbout(): string;
    /**
     * Format loading message
     * @param input - User input
     * @returns Formatted loading message
     */
    static formatLoading(input: string): string;
    /**
     * Get score emoji based on score value
     * @param score - Score value
     * @returns Emoji representation
     */
    static getScoreEmoji(score: number): string;
    /**
     * Get trait emoji
     * @param trait - Trait name
     * @returns Emoji representation
     */
    static getTraitEmoji(trait: string): string;
    /**
     * Format trait name for display
     * @param trait - Trait name
     * @returns Formatted trait name
     */
    static formatTraitName(trait: string): string;
    /**
     * Get score description
     * @param score - Score value
     * @returns Score description
     */
    static getScoreDescription(score: number): string;
}
export default ResponseFormatter;
//# sourceMappingURL=responseFormatter.d.ts.map