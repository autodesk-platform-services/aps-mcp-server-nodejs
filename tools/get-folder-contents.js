import { z } from "zod";
import { DataManagementClient } from "@aps_sdk/data-management";
import { getAccessToken } from "./common.js";

export const getFolderContents = {
    title: "get-folder-contents",
    description: "List contents of a project or a specific subfolder in Autodesk Construction Cloud",
    schema: {
        accountId: z.string().nonempty(),
        projectId: z.string().nonempty(),
        folderId: z.string().optional()
    },
    callback: async ({ accountId, projectId, folderId }) => {
        const accessToken = await getAccessToken(["data:read"]);
        const dataManagementClient = new DataManagementClient();
        const contents = folderId
            ? await dataManagementClient.getFolderContents(projectId, folderId, { accessToken })
            : await dataManagementClient.getProjectTopFolders(accountId, projectId, { accessToken });
        if (!contents.data) {
            throw new Error("No contents found");
        }
        return {
            content: contents.data.map((item) => ({ type: "text", text: JSON.stringify(item) }))
        };
    }
};
