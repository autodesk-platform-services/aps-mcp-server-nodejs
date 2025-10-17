import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as tools from "./tools/index.js";

const server = new McpServer({ name: "aps-mcp-server-nodejs", version: "0.0.1" });
for (const [name, { title, description, inputSchema, callback }] of Object.entries(tools)) {
    server.registerTool(name, { title, description, inputSchema }, callback);
}

try {
    await server.connect(new StdioServerTransport());
} catch (err) {
    console.error("Server error:", err);
}
