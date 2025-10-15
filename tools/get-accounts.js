import { dataManagementClient } from "../utils.js";

export const getAccounts = {
    title: "get-accounts",
    description: `
        Retrieves all Autodesk Construction Cloud (ACC) accounts accessible to the configured service account.
        Returns the list of accounts with their IDs and names.
    `,
    schema: {},
    callback: async () => {
        const response = await dataManagementClient.getHubs();
        const hubs = response.data || [];
        return {
            content: hubs.map((hub) => ({
                type: "text",
                text: JSON.stringify({
                    id: hub.id,
                    name: hub.attributes.name
                })
            }))
        };
    }
};
