/* eslint-disable @typescript-eslint/no-explicit-any */
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

type EventListener = (...args: any[]) => void;

export class GitHubAuthService {
  private static get CLIENT_ID(): string | undefined {
    // Read from the global configuration
    if (
      typeof window !== "undefined" &&
      (window as any).testerantoConfig?.githubOAuth?.clientId
    ) {
      return (window as any).testerantoConfig.githubOAuth.clientId;
    }
    console.log("GitHub OAuth client ID not found in configuration");
    return undefined;
  }
  private static readonly REDIRECT_URI = `${window.location.origin}/auth/github/callback`;
  private static readonly SCOPE = "repo user";

  private accessToken: string | null = null;
  private user: GitHubUser | null = null;
  private listeners: Map<string, EventListener[]> = new Map();

  constructor() {
    this.loadStoredAuth();
  }

  on(event: string, listener: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: EventListener) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: any[]) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  private loadStoredAuth() {
    const token = localStorage.getItem("github_access_token");
    const userStr = localStorage.getItem("github_user");

    if (token) {
      this.accessToken = token;
    }

    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get userInfo(): GitHubUser | null {
    return this.user;
  }

  get token(): string | null {
    return this.accessToken;
  }

  initiateLogin() {
    const clientId = GitHubAuthService.CLIENT_ID;
    console.log("Initiating login with CLIENT_ID:", clientId);

    if (!clientId) {
      console.error(
        "GitHub OAuth client ID is not configured. Please set GITHUB_CLIENT_ID environment variable."
      );

      // Provide helpful instructions for setup
      const setupInstructions = `
GitHub authentication is not configured.

To set up GitHub OAuth:

1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set Authorization callback URL to: ${GitHubAuthService.REDIRECT_URI}
4. Add GITHUB_CLIENT_ID to your environment variables
5. Restart the development server

For development, you can create a .env file in the root directory with:
GITHUB_CLIENT_ID=your_client_id_here

Current environment analysis:
- process.env.GITHUB_CLIENT_ID: ${
        typeof process !== "undefined"
          ? process.env?.GITHUB_CLIENT_ID || "undefined"
          : "process undefined"
      }
- window.env.GITHUB_CLIENT_ID: ${
        typeof window !== "undefined"
          ? (window as any).env?.GITHUB_CLIENT_ID || "undefined"
          : "window undefined"
      }
      `;

      alert(setupInstructions);
      return;
    }
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      GitHubAuthService.REDIRECT_URI
    )}&scope=${encodeURIComponent(GitHubAuthService.SCOPE)}`;
    console.log("Opening auth popup:", authUrl);

    // Open in a popup window
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      authUrl,
      "github-auth",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  }

  async handleCallback(code: string): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/github/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const data = await response.json();
      this.accessToken = data.access_token;

      // Store token
      localStorage.setItem("github_access_token", this.accessToken);

      // Get user info
      await this.fetchUserInfo();

      this.emit("authChange", true);
      return true;
    } catch (error) {
      console.error("Authentication failed:", error);
      this.logout();
      return false;
    }
  }

  private async fetchUserInfo() {
    if (!this.accessToken) return;

    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      this.user = await response.json();
      localStorage.setItem("github_user", JSON.stringify(this.user));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  logout() {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem("github_access_token");
    localStorage.removeItem("github_user");
    this.emit("authChange", false);
  }

  isConfigured(): boolean {
    const clientId = GitHubAuthService.CLIENT_ID;
    console.log("Checking if configured - CLIENT_ID:", clientId);
    return !!clientId;
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/vnd.github.v3+json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.logout();
      throw new Error("Authentication expired");
    }

    return response;
  }
}

export const githubAuthService = new GitHubAuthService();
