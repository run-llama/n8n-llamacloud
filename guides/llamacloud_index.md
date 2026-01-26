# LlamaCloud Index setup in n8n

## Prerequisites

In order to use LlamaCloud Index in n8n, you need to create an Index on LlamaCloud.

Learn how to set up an Index through the [Platform UI](https://developers.llamaindex.ai/python/cloud/llamacloud/getting_started/#set-up-an-index-via-ui) or from [code](https://developers.llamaindex.ai/python/cloud/llamacloud/guides/framework_integration/).

## Setup

The LlamaCloud index node is specifically designed for chat inputs, so you will first need to set up a Chat Trigger:

![Chat Trigger](./assets/chat_trigger.png)

And then you can select the 'LlamaCloud' node, pasting the ID of your LlamaCloud Index in the configuration field:

![LlamaCloud Index Setup](./assets/index_pt1.png)

Once that is set, you can use the chat messages as input for the LlamaCloud Index to retrieve information simply by connecting the two nodes, and the you can start chatting:

![LlamaCloud Index Chat](./assets/index_pt2.png)

---

### View Also:

- [LlamaParse n8n setup](./llamaparse.md)
- [LlamaExtract Setup](./llamaextract.md)
- [LlamaClassify n8n setup](./llamaclassify.md)
- [LlamaSheets n8n setup](./llamasheets.md)
- [Setting up LlamaCloud nodes](./index.md)
- [Setup with Docker](./docker.md)
- [Back to top](#llamacloud-index-setup-in-n8n)
