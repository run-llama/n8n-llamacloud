# n8n LlamaParse Platform node

This repository contains a custom n8n community node for integrating with the [LlamaParse Platform](https://cloud.llamaindex.ai/?utm_source=demo&utm_medium=n8n), bringing document parsing, classification, splitting, structured extraction, and index retrieval into your n8n workflows.

The package ships a single node — **LlamaParse Platform** — exposing five resources that map to the LlamaParse Platform APIs.

## 🚀 Resources

The **LlamaParse Platform** node lets you pick a resource from a dropdown, then choose an operation. All resources share the same [`LlamaParse API` credential](./credentials/LlamaParseApi.credentials.ts).

### 📄 [Parse](./guides/llamaparse.md)
Parse documents (PDF, DOCX, PPTX, images, etc.) into clean text or Markdown. Supports four tiers — `fast`, `cost_effective`, `agentic`, and `agentic_plus` — and pinned parser versions.

- Input: binary file (from any previous node)
- Output: `{ text: string }` (Markdown when available, otherwise plain text)

### 🏷️ [Classify](./guides/llamaclassify.md)
Route a document into one of a set of user-defined categories. You provide a list of `{ category, description }` rules and get back the predicted category along with confidence and reasoning.

- Input: binary file + classification rules
- Output: `{ category, reasons, confidence }`

### ✂️ [Split](./guides/llamasplit.md)
Split a multi-section document into segments using semantic categories you define (e.g. "invoice", "contract", "appendix"). You can choose how uncategorized content is handled (`include` / `forbid` / `omit`).

- Input: binary file + categories
- Output: one item per segment, with `{ category, confidence, pages }`

### ⚗️ [Extract](./guides/llamaextract.md)
Run a pre-configured LlamaExtract agent against a file to get back structured JSON matching your schema.

- Input: binary file + Extraction Configuration ID
- Output: `{ result: <stringified JSON> }`

### 🔎 Retrieve ([Index v1](./guides/llamacloud_index.md) · [Index v2](./guides/llamacloud_indexv2.md))
Query a LlamaCloud index/pipeline and return the top-k retrieved chunks. Works against both the v1 Pipelines API and the newer v2 Index Retrieval API — ideal for RAG flows with the n8n AI Agent / Chat Trigger nodes.

- Input: `indexId`, `query` (defaults to `{{ $json.chatInput }}`), `topK`
- Output: `{ context: string[] }`

> The node is also marked `usableAsTool: true`, so any of the resources above can be wired into an n8n AI Agent as a tool.

## 📋 Prerequisites

1. **Node.js ≥ 20** — install via [nvm](https://github.com/nvm-sh/nvm) on Linux/macOS/WSL or the [Microsoft guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows) on Windows.
2. **n8n** installed globally:
   ```bash
   npm install n8n -g
   ```
3. A **LlamaParse Platform API key** — sign up at [cloud.llamaindex.ai](https://cloud.llamaindex.ai/?utm_source=demo&utm_medium=n8n) and copy the key from the dashboard.

## 🛠️ Installation

### Option 1 — Install from npm (recommended)

```bash
npm install -g @llamaindex/n8n-nodes-llamacloud

mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm link @llamaindex/n8n-nodes-llamacloud

n8n start
```

### Option 2 — Local development from source

```bash
git clone https://github.com/run-llama/n8n-llamacloud.git
cd n8n-llamacloud
npm install
npm run build
npm link

mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm link @llamaindex/n8n-nodes-llamacloud

n8n start
```

### Option 3 — Docker

A `Dockerfile` and `compose.yaml` are provided at the repository root. See the [Docker guide](./guides/docker.md) for the full walkthrough.

## 🔧 Configuring credentials

1. Open n8n (default: `http://localhost:5678`).
2. Go to **Credentials** → **Add Credential** → search for **"LlamaParse API"**.
3. Paste your API key. Optionally override the base URL (defaults to `https://api.cloud.llamaindex.ai`).
4. Save.

Full screenshots: [guides/index.md](./guides/index.md).

## 📚 Guides

Step-by-step walkthroughs (with screenshots) for every resource live under [`guides/`](./guides/):

- [Setup & credentials](./guides/index.md)
- [Parse](./guides/llamaparse.md)
- [Classify](./guides/llamaclassify.md)
- [Split](./guides/llamasplit.md)
- [Extract](./guides/llamaextract.md)
- [Retrieve — Index v1](./guides/llamacloud_index.md)
- [Retrieve — Index v2](./guides/llamacloud_indexv2.md)
- [Run with Docker](./guides/docker.md)

## 🔗 References

- [LlamaParse Platform](https://cloud.llamaindex.ai/?utm_source=demo&utm_medium=n8n)
- [LlamaCloud documentation](https://developers.llamaindex.ai/llamaparse/?utm_source=demo&utm_medium=n8n)
- [n8n documentation](https://docs.n8n.io/)
- [n8n community](https://community.n8n.io/)

## 📝 License

[MIT](./LICENSE.md)
