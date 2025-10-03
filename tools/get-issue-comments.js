import { z } from "zod";
import { IssuesClient } from "@aps_sdk/construction-issues";
import { getAccessToken } from "./common.js";

export const getIssueComments = {
    title: "get-issue-comments",
    description: "Retrieves a list of comments associated with an issue in Autodesk Construction Cloud.",
    schema: {
        projectId: z.string().nonempty(),
        issueId: z.string().nonempty()
    },
    callback: async ({ projectId, issueId }) => {
        const accessToken = await getAccessToken(["data:read"]);
        const issuesClient = new IssuesClient();
        projectId = projectId.replace("b.", ""); // the projectId should not contain the "b." prefix
        const comments = await issuesClient.getComments(projectId, issueId, { accessToken})
        if (!comments.results) {
            throw new Error("No comments found");
        }
        return {
            content: comments.results.map((comment) => ({ type: "text", text: JSON.stringify(comment) }))
        };
    }
};
