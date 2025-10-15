import { z } from "zod";
import { dataManagementClient } from "../utils.js";

export const getFolderContents = {
    title: "get-folder-contents",
    description: `
        Retrieves the contents of a folder within an Autodesk Construction Cloud (ACC) project.
        Requires accountId and projectId parameters. If no folderId is provided, returns the top-level folders of the project.
        Returns the list of folders and files with their IDs and names.
    `,
    schema: {
        accountId: z.string().nonempty(),
        projectId: z.string().nonempty(),
        folderId: z.string().optional()
    },
    callback: async ({ accountId, projectId, folderId }) => {
        const response = folderId
            ? await dataManagementClient.getFolderContents(projectId, folderId)
            : await dataManagementClient.getProjectTopFolders(accountId, projectId);
        const contents = response.data || [];
        return {
            content: contents.map((item) => ({
                type: "text",
                text: JSON.stringify({
                    id: item.id,
                    type: item.type,
                    name: item.attributes.displayName
                })
            }))
        };
    }
};
