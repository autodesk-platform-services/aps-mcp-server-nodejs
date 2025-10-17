import { z } from "zod";
import { issuesClient } from "../utils.js";

export const getIssuesTool = {
    title: "Get Issues",
    description: `
        Retrieves all issues within an Autodesk Construction Cloud (ACC) project. Requires a projectId parameter.
        Returns the list of issues with their IDs, titles, statuses, and issue type IDs.
    `,
    inputSchema: {
        projectId: z.string().nonempty()
    },
    callback: async ({ projectId }) => {
        const issues = await issuesClient.getIssues(projectId.replace("b.", "")).then(res => res.results || []);
        const output = issues.map((issue) => `- Issue: ${issue.title} (ID: ${issue.id}, Status: ${issue.status})`).join("\n");
        return {
            content: [{ type: "text", text: output }],
            structuredContent: { issues }
        };
    }
};
