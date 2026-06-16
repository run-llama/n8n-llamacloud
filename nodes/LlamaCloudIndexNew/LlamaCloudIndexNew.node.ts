import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { postJSON } from '../LlamaParse/utils.js';

interface RetrievalRetrieveResponse {
	results: Array<{ content: string }>;
}

export class LlamaCloudIndexV2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaCloud Index (New)',
		name: 'llamaCloudIndexNew',
		icon: 'file:llamacloud.svg',
		group: ['action'],
		version: 1,
		description: 'Retrieve context from your LlamaCloud Index',
		defaults: {
			name: 'LlamaCloudIndexV2',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'llamaCloudApi',
				required: true,
				displayName: 'LlamaCloud API Credentials',
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
				description: 'Your LlamaCloud Index ID (v2)',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 5,
				placeholder: '5',
				description: 'Your LlamaCloud Index ID (v2)',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get parameters from node
		const credentials = await this.getCredentials('llamaCloudApi');
		const apiKey = credentials.apiKey as string;
		const baseUrl = (credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
		const indexId = this.getNodeParameter('indexId', 0) as string;
		let topK = this.getNodeParameter('topK', 0) as unknown;
		topK = parseInt(topK as string);
		const items = this.getInputData();
		const chatMessage = typeof items[0].json.chatInput === 'string' ? items[0].json.chatInput : '';
		const result = await postJSON<RetrievalRetrieveResponse>(
			{ apiKey, baseUrl },
			'/api/v1/retrieval/retrieve',
			{ index_id: indexId, query: chatMessage, top_k: topK as number },
		);

		const contextTexts: string[] = [];
		for (const node of result.results) {
			contextTexts.push(node.content);
		}

		return [[{ json: { context: contextTexts } }]];
	}
}
