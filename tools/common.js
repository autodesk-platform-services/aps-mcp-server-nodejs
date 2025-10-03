import { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_SA_ID, APS_SA_KEY_ID, APS_SA_PRIVATE_KEY } from "../config.js";
import { getServiceAccountAccessToken } from "../auth.js";

const credentialsCache = new Map();

export async function getAccessToken(scopes) {
    const cacheKey = scopes.join("+");
    let credentials = credentialsCache.get(cacheKey);
    if (!credentials || credentials.expiresAt < Date.now()) {
        const { access_token, expires_in } = await getServiceAccountAccessToken(APS_CLIENT_ID, APS_CLIENT_SECRET, APS_SA_ID, APS_SA_KEY_ID, APS_SA_PRIVATE_KEY, scopes);
        credentials = {
            accessToken: access_token,
            expiresAt: Date.now() + expires_in * 1000
        };
        credentialsCache.set(cacheKey, credentials);
    }
    return credentials.accessToken;
}
