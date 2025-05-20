import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { ProlificClient } from "./prolificClient.js";
import * as tools from "./tools.js";

vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));

vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));
vi.mock("js-yaml", () => ({
  default: {
    load: vi.fn(),
  },
}));

let fetchMock: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  fetchMock = (await import("node-fetch")).default as unknown as ReturnType<
    typeof vi.fn
  >;
});

describe("ProlificClient", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...OLD_ENV, PROLIFIC_TOKEN: "test-token" };
  });

  it("listStudies calls correct URL and headers", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    const client = new ProlificClient();
    const args: tools.ListStudiesArgs = { status: "active" };
    const result = await client.listStudies(args);
    expect(result).toEqual({ results: [] });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/studies/"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Token test-token",
        }),
      })
    );
  });

  it("throws error if PROLIFIC_TOKEN is missing", () => {
    process.env.PROLIFIC_TOKEN = "";
    expect(() => new ProlificClient()).toThrow(/PROLIFIC_TOKEN/);
  });

  it("throws error if listStudies response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });
    const client = new ProlificClient();
    await expect(client.listStudies({})).rejects.toThrow(/401/);
  });

  it("listSubmissions calls correct URL and handles response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1 }] }),
    });
    const client = new ProlificClient();
    const args: tools.ListSubmissionsArgs = { study_id: "abc123", limit: 5 };
    const result = await client.listSubmissions(args);
    expect(result).toEqual({ results: [{ id: 1 }] });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/studies/abc123/submissions/"),
      expect.any(Object)
    );
  });

  it("throws error if listSubmissions response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not found",
    });
    const client = new ProlificClient();
    await expect(client.listSubmissions({ study_id: "badid" })).rejects.toThrow(
      /404/
    );
  });
});
