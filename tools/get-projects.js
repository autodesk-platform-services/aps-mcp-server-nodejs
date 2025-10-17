import { dataManagementClient } from "../utils.js";

export const getProjectsTool = {
    title: "Get Accounts & Projects",
    description: `
        Retrieves all Autodesk Construction Cloud (ACC) accounts and their associated projects accessible to the configured service account.
        Returns a structured list of accounts (with account IDs and names) and associated projects (with project IDs and names).
    `,
    inputSchema: {},
    callback: async () => {
        const accounts = await dataManagementClient.getHubs().then(res => res.data || []);
        let output = "";
        for (const account of accounts) {
            output += `- Account: ${account.attributes.name} (ID: ${account.id})\n`;
            account.projects = await dataManagementClient.getHubProjects(account.id).then(res => res.data || []);
            for (const project of account.projects) {
                output += `  - Project: ${project.attributes.name} (ID: ${project.id})\n`;
            }
        }
        return {
            content: [{ type: "text", text: output }],
            structuredContent: { accounts }
        };
    }
};
