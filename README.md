# aps-mcp-server-nodejs

Simple [Model Context Protocol](https://modelcontextprotocol.io) server built with Node.js, providing access to [Autodesk Platform Services](https://aps.autodesk.com) API, with fine-grained access control using [Secure Service Accounts](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/).

![Screenshot](screenshot.png)

[YouTube Video](https://youtu.be/6DRSR9HlIds)

## Development

### Prerequisites

- [Node.js](https://nodejs.org)
- [APS application](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app) (must be of type _Server-to-Server_)
- [Provisioned access to ACC](https://get-started.aps.autodesk.com/#provision-access-in-other-products)

### Setup

#### Secure Service Account

Our MCP server will need a secure service account and a private key. Instead of implementing the logic in this code sample, we will use https://ssa-manager.autodesk.io:

- Go to https://ssa-manager.autodesk.io, and log in with your APS client ID and secret
- Create a new secure service account using the _Create Account With Name:_ button; don't forget to specify the first name and last name
- Make sure the new account is selected in the _Accounts_ list
- Make note of the `serviceAccountId` and `email` values under _Account Details_
- Create a new private key using the _Create Key_ button; a _*.pem_ file will be automatically downloaded to your machine
- Make sure the new private key is selected in the _Keys_ list
- Make note of the `kid` value under _Key Details_

#### Autodesk Construction Cloud

- Make sure you've provisioned access to ACC for your APS application
- Invite the secure service account (the `email` value from earlier) as a new member to your selected ACC projects

#### Server

- Clone this repository
- Install dependencies: `yarn install`
- Create a _.env_ file in the root folder of this project, and define the following environment variables:
  - `APS_CLIENT_ID` - your APS application client ID
  - `APS_CLIENT_SECRET` - your APS application client secret
  - `SSA_ID` -  your service account ID (the `serviceAccountId` field from earlier)
  - `SSA_KEY_ID` - your private key ID (the `kid` field from earlier)
  - `SSA_KEY_PATH` - full path to your downloaded *.pem file
- The _.env_ file might look something like this:

```bash
APS_CLIENT_ID="AhH9..."
APS_CLIENT_SECRET="1FS4..."
SSA_ID="ZCU2TJH5PK8A5KQ9"
SSA_KEY_ID="8a4ee790-3378-44f3-bbab-5acb35ec35ce"
SSA_KEY_PATH="/Users/brozp/aps-mcp-server-nodejs/8a4ee790-3378-44f3-bbab-5acb35ec35ce.pem"
```

## Usage

### MCP Inspector

- Run the [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector): `yarn run inspect`
- Open http://localhost:5173
- Hit `Connect` to connect to the MCP server

### Claude Desktop

- Make sure you have [Claude Desktop](https://claude.ai/download) installed
- Create a Claude Desktop config file if you don't have one yet:
  - On macOS: _~/Library/Application Support/Claude/claude\_desktop\_config.json_
  - On Windows: _%APPDATA%\Claude\claude\_desktop\_config.json_
- Add this MCP server to the config, using the absolute path of the _server.js_ file on your system, for example:

```json
{
    "mcpServers": {
        "autodesk-platform-services": {
            "command": "node",
            "args": [
                "/absolute/path/to/aps-mcp-server/server.js"
            ]
        }
    }
}
```

- Open Claude Desktop, and try some of the following test prompt:
  - What ACC projects do I have access to?
  - Give me a visual dashboard of all issues in project XYZ

> For more details on how to add MCP servers to Claude Desktop, see the [official documentation](https://modelcontextprotocol.io/quickstart/user).

### Visual Studio Code & GitHub Copilot

- Make sure you have [enabled MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_enable-mcp-support-in-vs-code)
- Create _.vscode/mcp.json_ file in your workspace, and add the following JSON to it:

```json
{
    "servers": {
        "Autodesk Platform Services": {
            "type": "stdio",
            "command": "node",
            "args": [
                "/absolute/path/to/aps-mcp-server/server.js"
            ]
        }
    }
}
```

> For more details on how to add MCP servers to Visual Studio Code, see the [documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

### Cursor

- Create _.cursor/mcp.json_ file in your workspace, and add the following JSON to it:

```json
{
  "mcpServers": {
    "Autodesk Platform Services": {
      "command": "node",
      "args": [
        "/Users/brozp/Code/Temp/aps-mcp-server-node/server.js"
      ]
    }
  }
}
```

> For more details on how to add MCP servers to Cursor, see the [documentation](https://docs.cursor.com/context/model-context-protocol)
