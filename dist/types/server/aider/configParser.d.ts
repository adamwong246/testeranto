export interface AiderConfig {
    "openai-api-key"?: string;
    "anthropic-api-key"?: string;
    "api-key"?: string | string[];
    model?: string;
    "auto-commits"?: boolean;
    [key: string]: any;
}
export declare function parseAiderConfig(): AiderConfig | null;
export declare function extractApiKeys(config: AiderConfig): Record<string, string>;
export declare function getApiKeyEnvironmentVariables(config: AiderConfig): Record<string, string>;
