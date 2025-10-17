# Tutorial

This tutorial guides you through the process of implementing a simple [Model Context Protocol](https://modelcontextprotocol.io) server providing AI assistants with access to [Autodesk Construction Cloud](https://construction.autodesk.com) data such as documents and issues. The implementation leverages [Autodesk Platform Services](https://aps.autodesk.com), using [Data Management API](https://aps.autodesk.com/en/docs/data/v2/developers_guide/overview/) and [Autodesk Construction Cloud API](https://aps.autodesk.com/en/docs/acc/v1/overview/introduction/) for accessing the data, and [Secure Service Accounts API](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/) for authentication.

![Screenshot](screenshot.png)

> Tip: if you don't want to build the project from scratch, the complete implementation is available on GitHub: [https://github.com/autodesk-platform-services/aps-mcp-server-nodejs](https://github.com/autodesk-platform-services/aps-mcp-server-nodejs).

## Terminology

### Model Context Protocol

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). Think of MCP like a USB-C port for AI applications - it provides a standardized way to connect AI models to different data sources and tools.

**MCP Servers** are applications that implement the MCP protocol to expose data and functionality to AI assistants. They act as bridges between AI models and external systems, running in the background and responding to requests from MCP clients.

**MCP Tools** are specific functions that an MCP server exposes to AI assistants. These tools allow the AI to perform actions like retrieving data, executing commands, or interacting with external APIs. Each tool has a defined schema that describes its parameters and expected behavior.

### Autodesk Platform Services

[Autodesk Platform Services (APS)](https://aps.autodesk.com) is a collection of web services that enable developers to build applications that interact with Autodesk products and services. In this tutorial, you'll use APS to access data from [Autodesk Construction Cloud (ACC)](https://construction.autodesk.com) projects.

### Secure Service Accounts

[Secure Service Account (SSA)](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/) is a special type of account designed for server-to-server authentication with Autodesk Platform Services. Unlike traditional OAuth which requires user interaction, SSA uses public/private key cryptography to authenticate programmatically.

Key benefits:

- **No user interaction required** - Perfect for automated systems and AI assistants
- **Granular permissions** - Control exactly what the service account can access
- **Audit trail** - Track all actions performed by the service account
- **Secure** - Uses industry-standard JWT tokens with private key signing

## What You'll Build

In this tutorial, you'll implement an MCP server that exposes the following tools to AI assistants:

1. **Get Accounts & Projects** - Retrieve all ACC accounts and projects accessible to your service account
2. **Get Folder Contents** - Browse folders and files in an ACC project
3. **Get Issues** - List all issues in an ACC project
4. **Get Issue Types** - Retrieve available issue types for a project

These tools enable AI assistants to:

- Navigate your ACC project structure
- Analyze project data and generate insights
- Answer questions about issues, documents, and project status
- Create reports and dashboards from your ACC data

## Prerequisites

Before starting this tutorial, you should have:

- **Node.js** installed on your machine (version 16 or higher)
- An **APS application** (must be of type _Server-to-Server_)
  - See how to [create an app](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app)
- **Provisioned access to ACC** for your APS application
  - Follow the [provisioning guide](https://get-started.aps.autodesk.com/#provision-access-in-other-products)
- Admin or similar permissions in your ACC projects
- Basic knowledge of JavaScript/Node.js
- An AI client that supports MCP; in this tutorial we will be using the following:
  - [Visual Studio Code](https://code.visualstudio.com/) with [GitHub Copilot](https://code.visualstudio.com/docs/copilot/setup)
  - [Cursor](https://cursor.com)
  - [Claude Desktop](https://claude.ai/download))

## Tutorial Structure

This tutorial is divided into four parts:

1. **Prepare Service Account** - Set up your Secure Service Account and prepare your environment
2. **Create MCP Server** - Build the MCP server using Node.js
3. **Create MCP Tools** - Implement the tools to interact with ACC data
4. **Integrate with MCP Clients** - Setup and test your MCP server with various AI clients

## Additional Links

- [Code Repository](https://github.com/autodesk-platform-services/aps-mcp-server-nodejs)
- [Autodesk Platform Services](https://aps.autodesk.com)
- [Secure Service Account Documentation](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
