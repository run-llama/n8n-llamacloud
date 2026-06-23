# Classify Setup in n8n

## Setup

Select the 'Classify a document' action.

![LlamaClassify Pt1](./assets/llamaclassify_pt1.png)

When setting up the node, you should provide:

- A set of rule, with:
	+ **category**: the category the rule refers to. Must be lowercase and without spaces.
	+ **description**: a description of what the category refers to.
- The binary data of the file.

![LlamaClassify Pt2](./assets/llamaclassify_pt2.png)

As for Parse, you can also set the node to receive inputs from other nodes, such as a webhook.

---

### View Also:

- [Parse n8n setup](./llamaparse.md)
- [Index v2 n8n setup](./llamacloud_indexv2.md)
- [Extract n8n setup](./llamaextract.md)
- [Split n8n setup](./llamasplit.md)
- [Setting up LlamaParse Platform nodes](./index.md)
- [Setup with Docker](./docker.md)
- [Back to top](#llamaclassify-setup-in-n8n)
