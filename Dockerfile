FROM node:20-slim
LABEL maintainer="Sean Harris <sean.alexander.harris.29@googlemail.com>"

ENV APPNAME=prolific-mcp-server

WORKDIR /app

ENV PROLIFIC_URL=https://api.prolific.com
# PROLIFIC_TOKEN must be provided at runtime via -e or MCP config

COPY package*.json ./

RUN npm install

COPY . .

# Build (using 'dist' structure)
RUN npx tsc

# Set the default command to run the MCP server (update to actual entrypoint script later)
CMD ["node", "dist/index.js"]
