# LlamaExtract Setup in n8n

## Prerequisites

In order to make LlamaExtract work, you need to first create an Extraction Configuration on LlamaCloud Platform with your designed schema.

With python code (current SDK), that looks like:

```python
from pydantic import BaseModel, Field
from llama_cloud import LlamaCloud
from llama_cloud.types.extract_v2_parameters_param import ExtractV2ParametersParam

# Define schema using Pydantic
class Resume(BaseModel):
    name: str = Field(description="Full name of candidate")
    email: str = Field(description="Email address")
    skills: list[str] = Field(description="Technical skills and technologies")

client = LlamaCloud(api_key="your_api_key")

# Create extraction configuration
config = client.configurations.create(
    name="resume-extractor",
    parameters=ExtractV2ParametersParam(
        data_schema=Resume.model_json_schema(),
        product_type="extract_v2",
        tier="agentic",
    ),
)

# retrieve config ID for future usage
print(config.id)
```

You can also create your configuration from the [LlamaCloud Platform UI](https://developers.llamaindex.ai/llamaparse/extract/web_ui/).

## Setup

Select the 'LlamaExtract' node with the 'Extract data from a file' action.

![LlamaExtract Pt1](./assets/llamaextract_pt1.png)

When setting up the node, pass your Configuration ID (copy it from the LlamaCloud Platform UI or from the outputs of the code snippets), and the binary data of file:

![LlamaExtract Pt2](./assets/llamaextract_pt2.png)

As for LlamaParse, you can also set the node to receive inputs from other nodes, such as a webhook.

---

### View Also:

- [LlamaParse n8n setup](./llamaparse.md)
- [LlamaCloud Index v1 n8n setup](./llamacloud_index.md)
- [LlamaCloud Index v2 n8n setup](./llamacloud_indexv2.md)
- [LlamaClassify n8n setup](./llamaclassify.md)
- [LlamaSheets n8n setup](./llamasheets.md)
- [Setting up LlamaCloud nodes](./index.md)
- [Setup with Docker](./docker.md)
- [Back to top](#llamaextract-setup-in-n8n)
