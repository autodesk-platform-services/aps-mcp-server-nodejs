import { getServiceAccountAccessToken } from "../auth.js";
import { DataManagementClient } from "@aps_sdk/data-management";
import { IssuesClient } from "@aps_sdk/construction-issues";

const SCOPES = ["data:read"];

class ServiceAccountAuthenticationProvider {
    constructor() {
        this._accessToken = null;
        this._expiresAt = 0;
    }

    async getAccessToken() {
        if (!this._accessToken || this._expiresAt < Date.now()) {
            const { access_token, expires_in } = await getServiceAccountAccessToken(SCOPES);
            this._accessToken = access_token;
            this._expiresAt = Date.now() + expires_in * 1000;
        }
        return this._accessToken;
    }
}

const serviceAccountAuthenticationProvider = new ServiceAccountAuthenticationProvider();
export const dataManagementClient = new DataManagementClient({ authenticationProvider: serviceAccountAuthenticationProvider });
export const issuesClient = new IssuesClient({ authenticationProvider: serviceAccountAuthenticationProvider });
