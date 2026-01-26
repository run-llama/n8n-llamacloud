# Use LlamaCloud Nodes With n8n in Docker

> **IMPORTANT NOTE**: _this guide is mainly intended for local deployment and testing in dev environments. If you wish to deploy to production, you might need some optimizations and [extra configuration for n8n](https://docs.n8n.io/hosting/installation/docker/#starting-n8n)_

You can build and run a Docker image containing LlamaCloud custom nodes using the [`Dockerfile`](https://github.com/run-llama/n8n-llamacloud/tree/master/Dockerfile) or the [`compose.yaml`](https://github.com/run-llama/n8n-llamacloud/tree/master/compose.yaml) available in the GitHub repository:

**With Docker**

```bash
curl -L https://raw.githubusercontent.com/run-llama/n8n-llamacloud/master/Dockerfile > Dockerfile
docker build . -t n8n-llamacloud
docker run \
	-p 5678:5678 \
	--env GENERIC_TIMEZONE="europe/berlin" \
	... # other env variables
```

**With Compose**

```bash
curl -L https://raw.githubusercontent.com/run-llama/n8n-llamacloud/master/compose.yaml > compose.yaml
docker compose up
```

In both cases, you should be able to see the n8n instance up and running at http://localhost:5678.

---

### View Also:

- [LlamaParse n8n setup](./llamaparse.md)
- [LlamaCloud Index setup](./llamacloud_index.md)
- [LlamaExtract Setup](./llamaextract.md)
- [LlamaClassify n8n setup](./llamaclassify.md)
- [LlamaSheets n8n setup](./llamasheets.md)
- [Back to top](#use-llamacloud-nodes-with-n8n-in-docker)
