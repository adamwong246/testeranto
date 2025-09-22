interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    email: string;
}
type EventListener = (...args: any[]) => void;
export declare class GitHubAuthService {
    private static get CLIENT_ID();
    private static readonly REDIRECT_URI;
    private static readonly SCOPE;
    private accessToken;
    private user;
    private listeners;
    constructor();
    on(event: string, listener: EventListener): void;
    off(event: string, listener: EventListener): void;
    emit(event: string, ...args: any[]): void;
    private loadStoredAuth;
    get isAuthenticated(): boolean;
    get userInfo(): GitHubUser | null;
    get token(): string | null;
    initiateLogin(): void;
    handleCallback(code: string): Promise<boolean>;
    private fetchUserInfo;
    logout(): void;
    isConfigured(): boolean;
    makeAuthenticatedRequest(url: string, options?: RequestInit): Promise<Response>;
}
export declare const githubAuthService: GitHubAuthService;
export {};
