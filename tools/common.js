import { getServiceAccountAccessToken } from "../auth.js";

const credentialsCache = new Map();

export async function getAccessToken(scopes) {
    const cacheKey = scopes.join("+");
    let credentials = credentialsCache.get(cacheKey);
    if (!credentials || credentials.expiresAt < Date.now()) {
        const { access_token, expires_in } = await getServiceAccountAccessToken(scopes);
        credentials = {
            accessToken: access_token,
            expiresAt: Date.now() + expires_in * 1000
        };
        credentialsCache.set(cacheKey, credentials);
    }
    return credentials.accessToken;
}
