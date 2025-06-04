// Tool interfaces and schemas for Prolific MCP server
// These definitions are used to register tools with the MCP SDK

// 1. List Studies
export interface ListStudiesArgs {
  status?: string; // e.g. "active", "unpublished", "completed", "all"
  project_id?: string; // Optional: filter by project
}

export const listStudiesSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
      description:
        "Filter studies by status (active, unpublished, completed, all)",
    },
    project_id: {
      type: "string",
      description: "Filter studies by project ID",
    },
  },
};

export const listStudiesDescription =
  "List all studies, optionally filtered by status or project.";

// 2. Create Study
export interface CreateStudyArgs {
  template_path?: string; // Path to YAML/JSON file describing the study (optional)
  study_body?: any; // JSON object describing the study (optional)
  publish?: boolean; // Whether to publish immediately
  silent?: boolean; // Whether to suppress output
}

export const createStudySchema = {
  type: "object",
  properties: {
    template_path: {
      type: "string",
      description:
        "Path to a YAML or JSON file describing the study (optional)",
    },
    study_body: {
      type: "object",
      description: "JSON object describing the study (optional)",
    },
    publish: {
      type: "boolean",
      description: "Publish the study immediately after creation",
    },
    silent: {
      type: "boolean",
      description: "Suppress output after creation",
    },
  },
  anyOf: [{ required: ["template_path"] }, { required: ["study_body"] }],
};

export const createStudyDescription =
  "Create a new study from a YAML/JSON template file or a JSON object. Optionally publish and/or suppress output.";

// 3. List Submissions for a Study
export interface ListSubmissionsArgs {
  study_id: string;
  limit?: number;
  offset?: number;
  csv?: boolean;
  fields?: string;
}

export const listSubmissionsSchema = {
  type: "object",
  properties: {
    study_id: {
      type: "string",
      description: "The ID of the study to fetch submissions for",
    },
    limit: {
      type: "number",
      description: "Limit the number of submissions returned",
    },
    offset: {
      type: "number",
      description: "Offset for pagination",
    },
    csv: {
      type: "boolean",
      description: "Return results in CSV format",
    },
    fields: {
      type: "string",
      description: "Comma-separated list of fields to include",
    },
  },
  required: ["study_id"],
};

export const listSubmissionsDescription =
  "List submissions for a given study, with optional pagination and field selection.";

// 4. View Study Details
export interface ViewStudyArgs {
  study_id: string;
  web?: boolean; // If true, open in browser (optional)
}

export const viewStudySchema = {
  type: "object",
  properties: {
    study_id: {
      type: "string",
      description: "The ID of the study to view",
    },
    web: {
      type: "boolean",
      description: "Open the study in the web application",
    },
  },
  required: ["study_id"],
};

export const viewStudyDescription = "View details for a specific study by ID.";

// 5. Duplicate a Study
export interface DuplicateStudyArgs {
  study_id: string;
}

export const duplicateStudySchema = {
  type: "object",
  properties: {
    study_id: {
      type: "string",
      description: "The ID of the study to duplicate",
    },
  },
  required: ["study_id"],
};

export const duplicateStudyDescription = "Duplicate an existing study by ID.";

// 6. Transition Study Status
export interface TransitionStudyArgs {
  study_id: string;
  action: "PUBLISH" | "PAUSE" | "START" | "STOP";
  silent?: boolean;
}

export const transitionStudySchema = {
  type: "object",
  properties: {
    study_id: {
      type: "string",
      description: "The ID of the study to transition",
    },
    action: {
      type: "string",
      enum: ["PUBLISH", "PAUSE", "START", "STOP"],
      description: "The action to perform on the study",
    },
    silent: {
      type: "boolean",
      description: "Suppress output after transition",
    },
  },
  required: ["study_id", "action"],
};

export const transitionStudyDescription =
  "Transition a study to a new status (publish, pause, start, stop).";

// 7. List Workspaces
export interface ListWorkspacesArgs {
  limit?: number;
  offset?: number;
}

export const listWorkspacesSchema = {
  type: "object",
  properties: {
    limit: {
      type: "number",
      description: "Limit the number of workspaces returned (default 200)",
    },
    offset: {
      type: "number",
      description: "Offset for pagination (default 0)",
    },
  },
};

export const listWorkspacesDescription =
  "List all workspaces your token has access to, with optional pagination.";

// 8. List Participant Groups
export interface ListParticipantGroupsArgs {
  project_id: string;
  limit?: number;
  offset?: number;
}

export const listParticipantGroupsSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "string",
      description: "The ID of the project to list participant groups for",
    },
    limit: {
      type: "number",
      description:
        "Limit the number of participant groups returned (default 200)",
    },
    offset: {
      type: "number",
      description: "Offset for pagination (default 0)",
    },
  },
  required: ["project_id"],
};

export const listParticipantGroupsDescription =
  "List all participant groups in a project, with optional pagination.";

// 9. List Campaigns
export interface ListCampaignsArgs {
  workspace_id: string;
  limit?: number;
  offset?: number;
}
export const listCampaignsSchema = {
  type: "object",
  properties: {
    workspace_id: {
      type: "string",
      description: "The ID of the workspace to list campaigns for",
    },
    limit: {
      type: "number",
      description: "Limit the number of campaigns returned (default 200)",
    },
    offset: {
      type: "number",
      description: "Offset for pagination (default 0)",
    },
  },
  required: ["workspace_id"],
};
export const listCampaignsDescription =
  "List all campaigns in a workspace, with optional pagination.";

// 10. List Filters
export interface ListFiltersArgs {}
export const listFiltersSchema = {
  type: "object",
  properties: {},
};
export const listFiltersDescription =
  "List all filters available for your study.";

// 11. List Filter Sets
export interface ListFilterSetsArgs {
  workspace_id: string;
  limit?: number;
  offset?: number;
}
export const listFilterSetsSchema = {
  type: "object",
  properties: {
    workspace_id: {
      type: "string",
      description: "The ID of the workspace to list filter sets for",
    },
    limit: {
      type: "number",
      description: "Limit the number of filter sets returned (default 200)",
    },
    offset: {
      type: "number",
      description: "Offset for pagination (default 0)",
    },
  },
  required: ["workspace_id"],
};
export const listFilterSetsDescription =
  "List all filter sets in a workspace, with optional pagination.";

// 12. List Requirements
export interface ListRequirementsArgs {}
export const listRequirementsSchema = {
  type: "object",
  properties: {},
};
export const listRequirementsDescription =
  "List all eligibility requirements available for your study.";


// 13. Who Am I?
export interface WhoAmIArgs {}
export const whoAmISchema = {
  type: "object",
  properties: {},
};
export const whoAmIDescription = "Get information about the current user.";