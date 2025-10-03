import { z } from "zod";
import { IssuesClient } from "@aps_sdk/construction-issues";
import { getAccessToken } from "./common.js";

export const getIssueRootCauses = {
    title: "get-issue-root-causes",
    description: "Retrieves a list of supported root cause categories and root causes that you can allocate to an issue in Autodesk Construction Cloud.",
    schema: {
        projectId: z.string().nonempty()
    },
    callback: async ({ projectId }) => {
        const accessToken = await getAccessToken(["data:read"]);
        const issuesClient = new IssuesClient();
        projectId = projectId.replace("b.", ""); // the projectId should not contain the "b." prefix
        const rootCauses = await issuesClient.getRootCauseCategories(projectId, { accessToken });
        if (!rootCauses.results) {
            throw new Error("No root causes found");
        }
        return {
            content: rootCauses.results.map((rootCause) => ({ type: "text", text: JSON.stringify(rootCause) }))
        };
    }
};
