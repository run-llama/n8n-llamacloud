FROM node:24-alpine

# Install dependencies and n8n as root
RUN apk add --no-cache git && \
	npm install -g n8n@latest && \
	npm install -g typescript

# Clone, build, and link the plugin as root
RUN git clone --depth 1 https://github.com/run-llama/n8n-llamacloud /tmp/llamacloud && \
	cd /tmp/llamacloud && \
	npm install && \
	npm run build && \
	npm link

# Switch to node user and create custom directory
USER node
WORKDIR /home/node
RUN mkdir -p /home/node/.n8n/custom

# Link in the custom directory as node user
WORKDIR /home/node/.n8n/custom
RUN npm link @llamaindex/n8n-nodes-llamacloud

# Cleanup is harder now since we switched users, but the image will still be smaller
# than before due to layer optimization

WORKDIR /home/node
EXPOSE 5678
CMD ["n8n", "start"]
