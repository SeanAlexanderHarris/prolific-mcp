#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  listStudiesSchema,
  listStudiesDescription,
  createStudySchema,
  createStudyDescription,
  listSubmissionsSchema,
  listSubmissionsDescription,
  viewStudySchema,
  viewStudyDescription,
  duplicateStudySchema,
  duplicateStudyDescription,
  transitionStudySchema,
  transitionStudyDescription,
  listWorkspacesSchema,
  listWorkspacesDescription,
  listParticipantGroupsSchema,
  listParticipantGroupsDescription,
  listCampaignsSchema,
  listCampaignsDescription,
  listFiltersSchema,
  listFiltersDescription,
  listFilterSetsSchema,
  listFilterSetsDescription,
  listRequirementsSchema,
  listRequirementsDescription,
} from "./tools.js";
import { ProlificClient } from "./prolificClient.js";

// Tool definitions for MCP
const tools = [
  {
    name: "prolific_list_studies",
    description: listStudiesDescription,
    inputSchema: listStudiesSchema,
  },
  {
    name: "prolific_create_study",
    description: createStudyDescription,
    inputSchema: createStudySchema,
  },
  {
    name: "prolific_list_submissions",
    description: listSubmissionsDescription,
    inputSchema: listSubmissionsSchema,
  },
  {
    name: "prolific_view_study",
    description: viewStudyDescription,
    inputSchema: viewStudySchema,
  },
  {
    name: "prolific_duplicate_study",
    description: duplicateStudyDescription,
    inputSchema: duplicateStudySchema,
  },
  {
    name: "prolific_transition_study",
    description: transitionStudyDescription,
    inputSchema: transitionStudySchema,
  },
  {
    name: "prolific_list_workspaces",
    description: listWorkspacesDescription,
    inputSchema: listWorkspacesSchema,
  },
  {
    name: "prolific_list_participant_groups",
    description: listParticipantGroupsDescription,
    inputSchema: listParticipantGroupsSchema,
  },
  {
    name: "prolific_list_campaigns",
    description: listCampaignsDescription,
    inputSchema: listCampaignsSchema,
  },
  {
    name: "prolific_list_filters",
    description: listFiltersDescription,
    inputSchema: listFiltersSchema,
  },
  {
    name: "prolific_list_filter_sets",
    description: listFilterSetsDescription,
    inputSchema: listFilterSetsSchema,
  },
  {
    name: "prolific_list_requirements",
    description: listRequirementsDescription,
    inputSchema: listRequirementsSchema,
  },
];

async function main() {
  console.error("Starting Prolific MCP Server... My new tool!");
  let prolificClient: ProlificClient;
  try {
    prolificClient = new ProlificClient();
  } catch (err) {
    console.error("Fatal error initializing ProlificClient:", err);
    process.exit(1);
  }

  const server = new Server(
    {
      name: "Prolific MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool calls
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received CallToolRequest:", request);
      try {
        if (!request.params.arguments) {
          throw new Error("No arguments provided");
        }
        switch (request.params.name) {
          case "prolific_list_studies": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListStudiesArgs;
            const response = await prolificClient.listStudies(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_create_study": {
            const args = request.params
              .arguments as unknown as import("./tools.js").CreateStudyArgs;
            const response = await prolificClient.createStudy(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_submissions": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListSubmissionsArgs;
            const response = await prolificClient.listSubmissions(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_view_study": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ViewStudyArgs;
            const response = await prolificClient.viewStudy(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_duplicate_study": {
            const args = request.params
              .arguments as unknown as import("./tools.js").DuplicateStudyArgs;
            const response = await prolificClient.duplicateStudy(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_transition_study": {
            const args = request.params
              .arguments as unknown as import("./tools.js").TransitionStudyArgs;
            const response = await prolificClient.transitionStudy(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_workspaces": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListWorkspacesArgs;
            const response = await prolificClient.listWorkspaces(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_participant_groups": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListParticipantGroupsArgs;
            const response = await prolificClient.listParticipantGroups(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_campaigns": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListCampaignsArgs;
            const response = await prolificClient.listCampaigns(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_filters": {
            const response = await prolificClient.listFilters();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_filter_sets": {
            const args = request.params
              .arguments as unknown as import("./tools.js").ListFilterSetsArgs;
            const response = await prolificClient.listFilterSets(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          case "prolific_list_requirements": {
            const response = await prolificClient.listRequirements();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error("Error executing tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("[DEBUG] Received ListToolsRequest");
    return { tools };
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);
  console.error("Prolific MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
