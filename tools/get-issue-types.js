import { z } from "zod";
import { issuesClient } from "../utils.js";

export const getIssueTypesTool = {
    title: "Get Issue Types",
    description: `
        Retrieves all configured issue types available in an Autodesk Construction Cloud (ACC) project.
        Requires a projectId parameter. Returns the list of issue types with their IDs, titles, and subtypes.
    `,
    inputSchema: {
        projectId: z.string().nonempty()
    },
    callback: async ({ projectId }) => {
        const issueTypes = await issuesClient.getIssuesTypes(projectId.replace("b.", ""), { include: "subtypes" }).then(res => res.results || []);
        let output = "";
        for (const issueType of issueTypes) {
            output += `- Issue Type: ${issueType.title} (ID: ${issueType.id})\n`;
            for (const subtype of issueType.subtypes) {
                output += `  - Subtype: ${subtype.title} (ID: ${subtype.id})\n`;
            }
        }
        return {
            content: [{ type: "text", text: output }],
            structuredContent: { issueTypes }
        };
    }
};
