import { z } from "zod";
import { issuesClient } from "../utils.js";

export const getIssues = {
    title: "get-issues",
    description: `
        Retrieves all issues within an Autodesk Construction Cloud (ACC) project. Requires a projectId parameter.
        Returns the list of issues with their IDs, titles, statuses, and issue type IDs.
    `,
    schema: {
        projectId: z.string().nonempty()
    },
    callback: async ({ projectId }) => {
        const issues = await issuesClient.getIssues(projectId.replace("b.", ""));
        return {
            content: (issues.results || []).map((issue) => ({
                type: "text",
                text: JSON.stringify({
                    id: issue.id,
                    title: issue.title,
                    status: issue.status,
                    description: issue.description,
                    issueTypeId: issue.issueTypeId,
                    issueSubtypeId: issue.issueSubtypeId
                })
            }))
        };
    }
};
