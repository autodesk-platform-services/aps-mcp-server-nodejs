import process from "node:process";
import { getClientCredentialsAccessToken, createServiceAccount, createServiceAccountPrivateKey } from "../auth.js";
import { APS_CLIENT_ID, APS_CLIENT_SECRET } from "../config.js";

if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
    console.error("Please set the APS_CLIENT_ID and APS_CLIENT_SECRET environment variables.");
    process.exit(1);
}
const [,, userName, firstName, lastName] = process.argv;
if (!userName || !firstName || !lastName) {
    console.error("Usage:");
    console.error("    node create-service-account.js <userName> <firstName> <lastName>");
    console.error("Example:");
    console.error("    node create-service-account.js test-robot Rob Robot");
    process.exit(1);
}

try {
    const credentials = await getClientCredentialsAccessToken(APS_CLIENT_ID, APS_CLIENT_SECRET, ["application:service_account:write", "application:service_account_key:write"]);
    const { serviceAccountId, email } = await createServiceAccount(userName, firstName, lastName, credentials.access_token);
    const { kid, privateKey } = await createServiceAccountPrivateKey(serviceAccountId, credentials.access_token);
    console.log("Service account created successfully!");
    console.log("Next Steps:");
    console.log("1. Invite the following user to your project:", email);
    console.log("2. Include the following environment variables to your application:");
    console.log(`APS_SA_ID="${serviceAccountId}"`);
    console.log(`APS_SA_EMAIL="${email}"`);
    console.log(`APS_SA_KEY_ID="${kid}"`);
    console.log(`APS_SA_PRIVATE_KEY="${Buffer.from(privateKey).toString("base64")}"`);
} catch (err) {
    console.error(err);
    process.exit(1);
}
