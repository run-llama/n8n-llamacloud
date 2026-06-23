# Use LlamaParse Platform nodes With n8n in Docker

> **IMPORTANT NOTE**: _this guide is mainly intended for local deployment and testing in dev environments. If you wish to deploy to production, you might need some optimizations and [extra configuration for n8n](https://docs.n8n.io/hosting/installation/docker/#starting-n8n)_

You can build and run a Docker image containing LlamaCloud custom nodes using the [`Dockerfile`](https://github.com/run-llama/n8n-llamacloud/tree/master/Dockerfile) or the [`compose.yaml`](https://github.com/run-llama/n8n-llamacloud/tree/master/compose.yaml) available in the GitHub repository:

**With Docker**

```bash
curl -L https://raw.githubusercontent.com/run-llama/n8n-llamacloud/master/Dockerfile > Dockerfile
docker build . -t n8n-llamacloud
docker run \
	-p 5678:5678 \
	--env GENERIC_TIMEZONE="europe/berlin" \
	... \ # other env variables
	n8n-llamacloud
```

**With Compose**

```bash
curl -L https://raw.githubusercontent.com/run-llama/n8n-llamacloud/master/Dockerfile > Dockerfile
curl -L https://raw.githubusercontent.com/run-llama/n8n-llamacloud/master/compose.yaml > compose.yaml
docker compose up
```

In both cases, you should be able to see the n8n instance up and running at http://localhost:5678.

---

### View Also:

- [Parse n8n setup](./llamaparse.md)
- [Index v2 n8n setup](./llamacloud_indexv2.md)
- [Extract Setup](./llamaextract.md)
- [Classify n8n setup](./llamaclassify.md)
- [Split n8n setup](./llamasplit.md)
- [Setup with Docker](./docker.md)
- [Back to top](#setting-up-llamacloud-nodes-for-n8n)
