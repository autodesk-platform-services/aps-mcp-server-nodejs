import { z } from "zod";
import { DataManagementClient } from "@aps_sdk/data-management";
import { getAccessToken } from "./common.js";

export const getItemVersions = {
    title: "get-item-versions",
    description: "List all versions of a document in Autodesk Construction Cloud",
    schema: {
        projectId: z.string().nonempty(),
        itemId: z.string().nonempty()
    },
    callback: async ({ projectId, itemId }) => {
        const accessToken = await getAccessToken(["data:read"]);
        const dataManagementClient = new DataManagementClient();
        const versions = await dataManagementClient.getItemVersions(projectId, itemId, { accessToken });
        if (!versions.data) {
            throw new Error("No versions found");
        }
        return {
            content: versions.data.map((version) => ({ type: "text", text: JSON.stringify(version) }))
        };
    }
};
