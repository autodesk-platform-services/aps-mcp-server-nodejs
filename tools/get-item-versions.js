import { z } from "zod";
import { dataManagementClient } from "./common.js";

export const getItemVersions = {
    title: "get-item-versions",
    description: `
        Retrieves the complete version history of a specific document or file in Autodesk Construction Cloud (ACC).
        Requires projectId and itemId parameters. Returns all versions with their metadata, including version numbers,
        creation dates, file sizes, and user information for tracking document evolution over time.
    `,
    schema: {
        projectId: z.string().nonempty(),
        itemId: z.string().nonempty()
    },
    callback: async ({ projectId, itemId }) => {
        const versions = await dataManagementClient.getItemVersions(projectId, itemId);
        return {
            content: (versions.data || []).map((version) => ({
                type: "text",
                text: JSON.stringify({
                    id: version.id,
                    versionNumber: version.attributes.versionNumber,
                    createdAt: version.attributes.createTime,
                    createBy: version.attributes.createUserName
                })
            }))
        };
    }
};
