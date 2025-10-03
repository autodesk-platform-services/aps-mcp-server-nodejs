import { z } from "zod";
import { DataManagementClient } from "@aps_sdk/data-management";
import { getAccessToken } from "./common.js";

export const getProjects = {
    title: "get-projects",
    description: "List all available projects in an Autodesk Construction Cloud account",
    schema: {
        accountId: z.string().nonempty()
    },
    callback: async ({ accountId }) => {
        const accessToken = await getAccessToken(["data:read"]);
        const dataManagementClient = new DataManagementClient();
        const projects = await dataManagementClient.getHubProjects(accountId, { accessToken });
        if (!projects.data) {
            throw new Error("No projects found");
        }
        return {
            content: projects.data.map((project) => ({
                type: "text",
                text: JSON.stringify({ id: project.id, name: project.attributes?.name })
            }))
        };
    }
};
