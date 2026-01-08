import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { LlamaCloudIndex } from 'llama-cloud-services';
import { MetadataMode } from '@llamaindex/core/schema';

export class LlamaCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaCloud',
		name: 'llamaCloud',
		icon: 'file:llamacloud.svg',
		group: ['action'],
		version: 1,
		description: 'Retrieve context from your LlamaCloud Index',
		defaults: {
			name: 'LlamaCloud',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'llamaCloudApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Index Name',
				name: 'indexName',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'my-index-name',
				description: 'Your LlamaCloud index name',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get parameters from node
		const credentials = await this.getCredentials('llamaCloudApi');
		const apiKey = credentials.apiKey as string;
		const indexName = this.getNodeParameter('indexName', 0) as string;
		const items = this.getInputData();
		const chatMessage = typeof items[0].json.chatInput === 'string' ? items[0].json.chatInput : '';
		// // Initialize LlamaCloudIndex
		const index = new LlamaCloudIndex({
			apiKey: apiKey,
			name: indexName,
			projectName: 'Default',
		});

		const retriever = index.asRetriever({
			similarityTopK: 5,
		});

		const contexts = await retriever.retrieve({
			query: chatMessage,
		});

		// Extract the text content from each context item using getContent()
		const contextTexts = Array.isArray(contexts)
			? contexts
					.map((item) =>
						item.node && typeof item.node.getContent === 'function'
							? item.node.getContent(MetadataMode.NONE)
							: null,
					)
					.filter(Boolean)
			: [];

		return [[{ json: { context: contextTexts } }]];
	}
}
