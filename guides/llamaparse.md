# LlamaParse n8n setup

You can setup LlamaParse by choosing the `LlamaParse` node and the `Parse PDF File` action:

![LlamaParse Pt1](./assets/llamaparse_pt1.png)

And, once you selected that, you can specify file binary data to parse:

![LlamaParse Pt2](./assets/llamaparse_pt2.png)

For binary data, it is best to dynamically fetch them from another source (trigger), such as a WebHook:

![n8n webhook setup](./assets/llamaparse_webhook.png)

In this example, you can send a PDF directly with a `curl` request:

```bash
curl -X POST \
  -H "Content-Type: application/pdf" \
  --data-binary @document.pdf \
  http://localhost:5678/<YOUR_WEBHOOK_NAME>/<YOUR_WEBHOOK_PATH>
```

And you can take the webhook output as input for LlamaParse:

![n8n form input](./assets/llamaparse_onwebhook.png)

---

### View Also:

- [LlamaCloud Index setup](./llamacloud_index.md)
- [LlamaExtract Setup](./llamaextract.md)
- [LlamaClassify n8n setup](./llamaclassify.md)
- [LlamaSheets n8n setup](./llamasheets.md)
- [Setting up LlamaCloud nodes](./index.md)
- [Setup with Docker](./docker.md)
- [Back to top](#llamaparse-n8n-setup)
