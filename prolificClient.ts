// @ts-expect-error: Node.js types
import type {} from "node";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import fetch from "node-fetch";
import {
  ListStudiesArgs,
  CreateStudyArgs,
  ListSubmissionsArgs,
  ViewStudyArgs,
  DuplicateStudyArgs,
  TransitionStudyArgs,
} from "./tools.js";

// Helper for logging
function log(message: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.error(`[ProlificClient] ${message}`, ...args);
}

export class ProlificClient {
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.apiToken = process.env.PROLIFIC_TOKEN || "";
    this.baseUrl = process.env.PROLIFIC_URL || "https://api.prolific.co";
    if (!this.apiToken) {
      log("ERROR: PROLIFIC_TOKEN environment variable is not set.");
      throw new Error("PROLIFIC_TOKEN environment variable is required");
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Token ${this.apiToken}`,
      "User-Agent": "prolific-mcp-server/1.0",
    };
  }

  // 1. List Studies
  async listStudies(args: ListStudiesArgs): Promise<any> {
    log("Listing studies with args:", args);
    let url = `${this.baseUrl}/api/v1/studies/`;
    const params: string[] = [];
    if (args.status) {
      params.push(`${encodeURIComponent(args.status)}=1`);
    }
    if (args.project_id) {
      url = `${this.baseUrl}/api/v1/projects/${args.project_id}/studies/`;
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list studies: ${res.status} ${text}`);
      throw new Error(`Failed to list studies: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 2. Create Study
  async createStudy(args: CreateStudyArgs): Promise<any> {
    log("Creating study with args:", args);
    let studyData: any;
    // If study_body is provided, use it directly
    if (args.study_body) {
      log("Using provided study_body JSON object");
      studyData = args.study_body;
    } else if (args.template_path) {
      // Otherwise, fall back to reading from file
      const ext = path.extname(args.template_path).toLowerCase();
      try {
        const fileContent = fs.readFileSync(args.template_path, "utf-8");
        if (ext === ".yaml" || ext === ".yml") {
          studyData = yaml.load(fileContent);
        } else if (ext === ".json") {
          studyData = JSON.parse(fileContent);
        } else {
          throw new Error(
            "Unsupported template file format. Use .yaml, .yml, or .json"
          );
        }
      } catch (err) {
        log(`Failed to read or parse template: ${err}`);
        throw new Error(`Failed to read or parse template: ${err}`);
      }
    } else {
      throw new Error("Either study_body or template_path must be provided.");
    }
    // Create study
    const url = `${this.baseUrl}/api/v1/studies/`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(studyData),
    });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to create study: ${res.status} ${text}`);
      throw new Error(`Failed to create study: ${res.status} ${text}`);
    }
    const created = await res.json();
    // Optionally publish
    if (args.publish) {
      try {
        await this.transitionStudy({
          study_id: (created as any).id,
          action: "PUBLISH",
        });
      } catch (err) {
        log(`Failed to publish study: ${err}`);
        throw new Error(`Study created but failed to publish: ${err}`);
      }
    }
    return created;
  }

  // 3. List Submissions for a Study
  async listSubmissions(args: ListSubmissionsArgs): Promise<any> {
    log("Listing submissions with args:", args);
    const limit = args.limit ?? 200;
    const offset = args.offset ?? 0;
    const url = `${this.baseUrl}/api/v1/studies/${args.study_id}/submissions/?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list submissions: ${res.status} ${text}`);
      throw new Error(`Failed to list submissions: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 4. View Study Details
  async viewStudy(args: ViewStudyArgs): Promise<any> {
    log("Viewing study with args:", args);
    const url = `${this.baseUrl}/api/v1/studies/${args.study_id}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to view study: ${res.status} ${text}`);
      throw new Error(`Failed to view study: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 5. Duplicate a Study
  async duplicateStudy(args: DuplicateStudyArgs): Promise<any> {
    log("Duplicating study with args:", args);
    const url = `${this.baseUrl}/api/v1/studies/${args.study_id}/clone/`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to duplicate study: ${res.status} ${text}`);
      throw new Error(`Failed to duplicate study: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 6. Transition Study Status
  async transitionStudy(args: TransitionStudyArgs): Promise<any> {
    log("Transitioning study with args:", args);
    const url = `${this.baseUrl}/api/v1/studies/${args.study_id}/transition/`;
    const body = { action: args.action };
    const res = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to transition study: ${res.status} ${text}`);
      throw new Error(`Failed to transition study: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 7. List Workspaces
  async listWorkspaces(args: {
    limit?: number;
    offset?: number;
  }): Promise<any> {
    log("Listing workspaces with args:", args);
    const limit = args.limit ?? 200;
    const offset = args.offset ?? 0;
    const url = `${this.baseUrl}/api/v1/workspaces/?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list workspaces: ${res.status} ${text}`);
      throw new Error(`Failed to list workspaces: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 8. List Participant Groups
  async listParticipantGroups(args: {
    project_id: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    log("Listing participant groups with args:", args);
    const limit = args.limit ?? 200;
    const offset = args.offset ?? 0;
    const url = `${
      this.baseUrl
    }/api/v1/participant-groups/?project_id=${encodeURIComponent(
      args.project_id
    )}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list participant groups: ${res.status} ${text}`);
      throw new Error(
        `Failed to list participant groups: ${res.status} ${text}`
      );
    }
    return await res.json();
  }

  // 9. List Campaigns
  async listCampaigns(args: {
    workspace_id: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    log("Listing campaigns with args:", args);
    const limit = args.limit ?? 200;
    const offset = args.offset ?? 0;
    const url = `${
      this.baseUrl
    }/api/v1/campaigns/?workspace_id=${encodeURIComponent(
      args.workspace_id
    )}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list campaigns: ${res.status} ${text}`);
      throw new Error(`Failed to list campaigns: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 10. List Filters
  async listFilters(): Promise<any> {
    log("Listing filters");
    const url = `${this.baseUrl}/api/v1/filters/`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list filters: ${res.status} ${text}`);
      throw new Error(`Failed to list filters: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 11. List Filter Sets
  async listFilterSets(args: {
    workspace_id: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    log("Listing filter sets with args:", args);
    const limit = args.limit ?? 200;
    const offset = args.offset ?? 0;
    const url = `${
      this.baseUrl
    }/api/v1/filter-sets/?workspace_id=${encodeURIComponent(
      args.workspace_id
    )}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list filter sets: ${res.status} ${text}`);
      throw new Error(`Failed to list filter sets: ${res.status} ${text}`);
    }
    return await res.json();
  }

  // 12. List Requirements
  async listRequirements(): Promise<any> {
    log("Listing requirements");
    const url = `${this.baseUrl}/api/v1/eligibility-requirements/`;
    const res = await fetch(url, { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      log(`Failed to list requirements: ${res.status} ${text}`);
      throw new Error(`Failed to list requirements: ${res.status} ${text}`);
    }
    return await res.json();
  }
}
