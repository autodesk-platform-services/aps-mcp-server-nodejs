import { z } from "zod";
import { issuesClient } from "./common.js";

export const getIssueComments = {
    title: "get-issue-comments",
    description: `
        Retrieves all comments and discussion threads associated with a specific issue in Autodesk Construction Cloud (ACC).
        Requires projectId and issueId parameters. Returns the list of comments with their IDs, bodies, and creation timestamps.
    `,
    schema: {
        projectId: z.string().nonempty(),
        issueId: z.string().nonempty()
    },
    callback: async ({ projectId, issueId }) => {
        const comments = await issuesClient.getComments(projectId.replace("b.", ""), issueId)
        return {
            content: (comments.results || []).map((comment) => ({
                type: "text",
                text: JSON.stringify({
                    id: comment.id,
                    body: comment.body
                })
            }))
        };
    }
};
