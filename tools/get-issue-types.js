import { z } from "zod";
import { issuesClient } from "../utils.js";

export const getIssueTypes = {
    title: "get-issue-types",
    description: `
        Retrieves all configured issue types available in an Autodesk Construction Cloud (ACC) project.
        Requires a projectId parameter. Returns the list of issue types with their IDs, titles, and subtypes.
    `,
    schema: {
        projectId: z.string().nonempty()
    },
    callback: async ({ projectId }) => {
        const issueTypes = await issuesClient.getIssuesTypes(projectId.replace("b.", ""), { include: "subtypes" }).then(res => res.results || []);
        return {
            content: issueTypes.map((issueType) => ({
                type: "text",
                text: JSON.stringify({
                    id: issueType.id,
                    title: issueType.title,
                    subtypes: issueType.subtypes.map((subtype) => ({
                        id: subtype.id,
                        title: subtype.title
                    }))
                })
            }))
        };
    }
};
