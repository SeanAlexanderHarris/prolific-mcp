# Prolific MCP Server

**This project is not affiliated to Prolific in any way.**

This Model Context Protocol (MCP) server provides a bridge between an agent and [Prolific's](https://www.prolific.com) platform. It enables:

- Management of Prolific studies through MCP commands
- Automated participant recruitment and data collection
- Integration with Prolific's tools and participant pool

The server was enabled and inspired by work that went into the [Prolific CLI](https://github.com/benmatselby/prolificli) and attempts to allow data collectors to interact via agents with any functionality provided the [Prolific API](https://docs.prolific.com/docs/api-docs/public/).

It is built with TypeScript and packaged as a Docker container for easy deployment leaning heavily on the MCP TypeScript [SDK](https://github.com/modelcontextprotocol/typescript-sdk).

More information about the Model Context Protocol is available [here](https://github.com/modelcontextprotocol).

[Anthropic's](https://www.anthropic.com/) introductory blog post about MCP is available [here](https://www.anthropic.com/news/model-context-protocol).

## Getting Started

This has been manually tested with [Claude Desktop](https://claude.ai/download) and [Cursor](https://www.cursor.com/) (via the embedded Claude agent).

### For Claude Desktop

Open the developer settings in Claude Desktop: Claude -> Settings -> Developer -> Edit Config.

### For Cursor

Open the settings (top right hand corner of the IDE at the time of writing) and open the MCP config.

You must then add the Prolific MCP server config JSON.

```json
{
  "mcpServers": {
    "prolific": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PROLIFIC_TOKEN",
        "mcp/prolific:latest"
      ],
      "env": {
        "PROLIFIC_TOKEN": "${YOUR_PROLIFIC_API_TOKEN}"
      }
    }
  }
}
```

### Requirements

- Docker

### Environment Variables

The following environment variables are required for the MCP server to function correctly:

- **PROLIFIC_TOKEN** (required)
  - Your Prolific API token. Used for authenticating all API requests.
- **PROLIFIC_URL** (optional)
  - The base URL for the Prolific API. Defaults to `https://api.prolific.com` if not set.

### Validation

- The server will check for `PROLIFIC_TOKEN` at startup.
- If it is missing, the server will log a clear error and exit.

---

### Getting Started

## Requirements

- Docker
  - Recommend [Docker desktop](https://docs.docker.com/desktop/) for ease
- Typescript

## Docker Usage

To build the image:

```shell
docker build -t mcp/prolific .
```

When running the MCP server in Docker, you must pass the required environment variables into the container. For example:

```sh
docker run -i --rm \
  -e PROLIFIC_TOKEN=your-prolific-api-token \
  mcp/prolific
```

You can also set `PROLIFIC_URL` if you need to override the default API endpoint and have been granted access to a different Prolific environment.

---
