import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { LlamaCloud as LlamaCloudClient } from '../../sdk/index.js';

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
				displayName: 'Index ID',
				name: 'indexId',
				type: 'string',
				required: true,
				default: '',
				placeholder: '',
				description: 'Your LlamaCloud Index ID',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get parameters from node
		const credentials = await this.getCredentials('llamaCloudApi');
		const apiKey = credentials.apiKey as string;
		const pipelineId = this.getNodeParameter('indexId', 0) as string;
		const items = this.getInputData();
		const chatMessage = typeof items[0].json.chatInput === 'string' ? items[0].json.chatInput : '';
		const client = new LlamaCloudClient({
			apiKey: apiKey,
		});
		const result = await client.pipelines.retrieve(pipelineId, {
			dense_similarity_top_k: 5,
			query: chatMessage,
		});

		const contextTexts: string[] = [];
		for (const node of result.retrieval_nodes) {
			if (node.node.text) {
				contextTexts.push(node.node.text);
			}
		}

		return [[{ json: { context: contextTexts } }]];
	}
}
