import { dataManagementClient } from "../utils.js";

export const getProjects = {
    title: "get-projects",
    description: `
        Retrieves all Autodesk Construction Cloud (ACC) accounts and their associated projects accessible to the configured service account.
        Returns a structured list of accounts with their IDs, names, and associated projects (with project IDs and names).
    `,
    schema: {},
    callback: async ({}) => {
        const response = await dataManagementClient.getHubs();
        const hubs = response.data || [];
        const projects = await Promise.all(hubs.map(hub => dataManagementClient.getHubProjects(hub.id).then(res => res.data || [])));
        const results = {
            accounts: hubs.map((hub, i) => ({
                id: hub.id,
                name: hub.attributes.name,
                projects: projects[i].map(project => ({
                    id: project.id,
                    name: project.attributes.name
                }))
            }))
        };
        return {
            content: [{
                type: "text",
                text: JSON.stringify(results, null, 2)
            }]
        };
    }
};
