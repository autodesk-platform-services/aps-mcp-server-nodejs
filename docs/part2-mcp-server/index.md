# Part 2: Create MCP Server

In this part of the tutorial you will:

- Create a new Node.js project
- Install required dependencies
- Implement configuration management
- Build the authentication layer
- Set up an MCP server
- Verify the implementation

## Create Node.js Project

Let's start by creating a new Node.js project.

### Prerequisites

Make sure you have Node.js version 16 or higher by running the following command in your terminal:

```bash
node --version
```

If you need to install Node.js, download it from [nodejs.org](https://nodejs.org).

### Initialize Node.js Project

Create a new folder for your project with a `package.json` file with the following content:

```json
{
  "name": "aps-mcp-server-nodejs",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "inspect": "mcp-inspector node ./server.js"
  },
  "dependencies": {
    "@aps_sdk/construction-issues": "^1.1.0",
    "@aps_sdk/data-management": "^1.1.2",
    "@modelcontextprotocol/sdk": "^1.20.0",
    "dotenv": "^17.2.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@modelcontextprotocol/inspector": "^0.17.1"
  }
}
```

Note the various dependencies:

- **@modelcontextprotocol/sdk** - Core MCP protocol implementation
- **@aps_sdk/data-management** - APS Data Management API client
- **@aps_sdk/construction-issues** - ACC Issues API client
- **dotenv** - Environment variable management
- **jsonwebtoken** - JWT token generation for SSA authentication
- **zod** - Schema validation
- **@modelcontextprotocol/inspector** - Development tool for testing MCP servers

Next, navigate to your project folder in terminal, and install these dependencies:

```bash
npm install
```

### Create .gitignore

Create a `.gitignore` file to prevent committing sensitive data to [git](https://git-scm.com):

```bash
node_modules/
*.env
*.pem
```

This ensures your credentials and private keys stay secure.

## Implement Configuration Management

Next, let's create a configuration module to load and validate environment variables.

### Create Environment File

Create a `.env` file in the project directory, and add your credentials:

```bash
APS_CLIENT_ID="your-client-id-here"
APS_CLIENT_SECRET="your-client-secret-here"
SSA_ID="your-service-account-id"
SSA_KEY_ID="your-key-id"
SSA_KEY_PATH="/absolute/path/to/your-key.pem"
```

> Replace the placeholders with your actual values collected in [Part 1](../part1-service-account/index.md).

### Create Configuration Module

Create a `config.js` file in your project directory with the following code:

```javascript
import path from "node:path";
import url from "node:url";
import dotenv from "dotenv";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });
const { APS_CLIENT_ID, APS_CLIENT_SECRET, SSA_ID, SSA_KEY_ID, SSA_KEY_PATH } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET || !SSA_ID || !SSA_KEY_ID || !SSA_KEY_PATH) {
    console.error("Missing one or more required environment variables: APS_CLIENT_ID, APS_CLIENT_SECRET, SSA_ID, SSA_KEY_ID, SSA_KEY_PATH");
    process.exit(1);
}

export {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    SSA_ID,
    SSA_KEY_ID,
    SSA_KEY_PATH
}
```

This module:

- Loads environment variables from `.env`
- Validates all required credentials are present
- Exits with an error if any credentials are missing
- Exports configuration for use by other modules

## Build Shared Logic

Next, let's implement the shared logic for MCP tools that we will define in [Part 3](../part3-mcp-tools/).

### Create Common Utilities

Create a `utils.js` file in the root folder with the following content:

```javascript
import fs from "node:fs/promises";
import jwt from "jsonwebtoken";
import { DataManagementClient } from "@aps_sdk/data-management";
import { IssuesClient } from "@aps_sdk/construction-issues";
import { APS_CLIENT_ID, APS_CLIENT_SECRET, SSA_ID, SSA_KEY_ID, SSA_KEY_PATH } from "./config.js";

const TOKEN_ENDPOINT = "https://developer.api.autodesk.com/authentication/v2/token";

class ServiceAccountAuthenticationProvider {
    constructor(scopes) {
        this._accessToken = null;
        this._expiresAt = 0;
        this._scopes = scopes;
    }

    async getAccessToken() {
        if (!this._accessToken || this._expiresAt < Date.now()) {
            const assertion = await this._createAssertion(this._scopes);
            const { access_token, expires_in } = await this._exchangeAccessToken(assertion);
            this._accessToken = access_token;
            this._expiresAt = Date.now() + expires_in * 1000;
        }
        return this._accessToken;
    }

    async _createAssertion(scopes) {
        const expiresAt = Math.floor(Date.now() / 1000) + 300;
        const payload = { iss: APS_CLIENT_ID, sub: SSA_ID, aud: TOKEN_ENDPOINT, exp: expiresAt, scope: scopes };
        const privateKey = await fs.readFile(SSA_KEY_PATH, "utf-8");
        const options = {
            algorithm: "RS256",
            header: { alg: "RS256", kid: SSA_KEY_ID },
            noTimestamp: true
        };
        return jwt.sign(payload, privateKey, options);
    }

    async _exchangeAccessToken(assertion) {
        const headers = {
            "Accept": "application/json",
            "Authorization": `Basic ${Buffer.from(`${APS_CLIENT_ID}:${APS_CLIENT_SECRET}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion });
        const response = await fetch(TOKEN_ENDPOINT, { method: "POST", headers, body });
        if (!response.ok) {
            throw new Error(`Could not generate access token: ${await response.text()}`);
        }
        return response.json();
    }
}

const serviceAccountAuthenticationProvider = new ServiceAccountAuthenticationProvider(["data:read"]);
export const dataManagementClient = new DataManagementClient({ authenticationProvider: serviceAccountAuthenticationProvider });
export const issuesClient = new IssuesClient({ authenticationProvider: serviceAccountAuthenticationProvider });
```

This module:

- Creates JWT tokens using your service account credentials
- Exchanges JWT for an access token
- Exports authenticated API clients for APS services

### Create Tool Index

Create a `tools` folder in the root directory, and inside it create an empty `index.js`. Later, we will export all our MCP tools from this file so that we can easily register them in the MCP server.

## Setup MCP Server

Now let's setup the MCP server itself.

### Create Server File

Create `server.js` in the root directory:

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as tools from "./tools/index.js";

const server = new McpServer({ name: "aps-mcp-server-nodejs", version: "0.0.1" });
for (const tool of Object.values(tools)) {
    server.tool(tool.title, tool.description, tool.schema, tool.callback);
}

try {
    await server.connect(new StdioServerTransport());
} catch (err) {
    console.error("Server error:", err);
}
```

This code:

- Creates an MCP server instance
- Iterates through all exported tools and registers them
- Connects to stdio transport for communication with MCP clients

## Try it out

Before we start implementing individual MCP tools, let's make sure that our server runs as expected.

### Start MCP Inspector

Open the terminal in your project folder, and run the following command to download and run the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx @modelcontextprotocol/inspector
```

This will start an MCP Inspector server locally, and automatically open it in the browser.

> Tip: If the browser does not open automatically, the URL will be printed in the terminal, so just copy-paste it into your browser.

### Connect to MCP Server

On the MCP Inspector webpage, configure your connection parameters as follows:

- **Transport Type**: `STDIO`
- **Command**: `node`
- **Arguments**: `server.js`

After that, click the **Connect** button.

![MCP Inspector](images/mcp-inspector-connect.png)

The status under the **Connect** button should show a small green circle followed by **Connected**, and the main page should contain a message saying **The connected server does not support any MCP capabilities**. This is expected - we have not implemented any capabilities in our MCP server yet, but we know we can connect to it.

![MCP Inspector Connected](images/mcp-inspector-connected.png)
