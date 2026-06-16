import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { postJSON, errorMessage } from '../LlamaParse/utils.js';

interface RetrievalRetrieveResponse {
	results: Array<{ content: string }>;
}

export class LlamaCloudIndexNew implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaCloud Index (New)',
		subtitle: 'Retrieve context from a knowledge base',
		name: 'llamaCloudIndexNew',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Retrieve context from your LlamaCloud Index',
		defaults: {
			name: 'LlamaCloudIndexNew',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
		usableAsTool: true,
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// Get parameters from node
				const credentials = await this.getCredentials('llamaCloudApi');
				const apiKey = credentials.apiKey as string;
				const baseUrl = (credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
				const indexId = this.getNodeParameter('indexId', i) as string;
				const topKRaw = this.getNodeParameter('topK', i) as unknown;
				const topK = parseInt(String(topKRaw), 10);
				const chatMessage =
					typeof items[i].json.chatInput === 'string' ? (items[i].json.chatInput as string) : '';
				const result = await postJSON<RetrievalRetrieveResponse>(
					{ apiKey, baseUrl },
					'/api/v1/retrieval/retrieve',
					{ index_id: indexId, query: chatMessage, top_k: topK },
				);

				const contextTexts: string[] = [];
				for (const node of result.results) {
					contextTexts.push(node.content);
				}

				returnData.push({
					json: { context: contextTexts },
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: errorMessage(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), errorMessage(error), { itemIndex: i });
			}
		}

		return [returnData];
	}
}
