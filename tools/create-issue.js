import { z } from "zod";
import { issuesClient } from "../utils.js";

export const createIssueTool = {
    title: "Create Issue",
    description: `
        Creates a new issue within an Autodesk Construction Cloud (ACC) project. Requires the project ID, issue title, and issue subtype ID.
        Optionally, you can provide the issue status, description, and the ID of the user to whom the issue will be assigned.
    `,
    inputSchema: {
        projectId: z.string().nonempty(),
        title: z.string().nonempty(),
        issueSubtypeId: z.string().nonempty(),
        status: z.enum(["draft","open","pending","in_progress","in_review","completed","not_approved","in_dispute","closed"]).default("open"),
        description: z.string().optional(),
        assignedTo: z.string().optional()
    },
    callback: async ({ projectId, title, issueSubtypeId, status, description, assignedTo }) => {
        const issue = await issuesClient.createIssue(projectId.replace("b.", ""), {
            title,
            issueSubtypeId,
            status,
            description,
            assignedTo
        });
        const output = `Created issue: ${issue.title} (ID: ${issue.id})`;
        return {
            content: [{ type: "text", text: output }],
            structuredContent: issue
        };
    }
};
