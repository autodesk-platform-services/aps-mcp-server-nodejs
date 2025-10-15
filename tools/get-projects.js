import { z } from "zod";
import { dataManagementClient } from "../utils.js";

export const getProjects = {
    title: "get-projects",
    description: `
        Retrieves all projects within a specified Autodesk Construction Cloud (ACC) account.
        Requires an accountId parameter. Returns project IDs and names that can be used to access
        project-specific data such as folders, documents, and issues.
    `,
    schema: {
        accountId: z.string().nonempty()
    },
    callback: async ({ accountId }) => {
        const projects = await dataManagementClient.getHubProjects(accountId);
        return {
            content: (projects.data || []).map((project) => ({
                type: "text",
                text: JSON.stringify({
                    id: project.id,
                    name: project.attributes.name
                })
            }))
        };
    }
};
