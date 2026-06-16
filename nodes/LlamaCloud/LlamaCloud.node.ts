import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { postJSON, errorMessage } from '../LlamaParse/utils.js';

interface PipelineRetrieveResponse {
	retrieval_nodes: Array<{ node: { text?: string | null } }>;
}

export class LlamaCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaCloud',
		subtitle: 'Retrieve context from your LlamaCloud Index',
		name: 'llamaCloud',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Retrieve context from your LlamaCloud Index',
		defaults: {
			name: 'LlamaCloud',
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
				description: 'Your LlamaCloud Index ID',
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
				const pipelineId = this.getNodeParameter('indexId', i) as string;
				const chatMessage =
					typeof items[i].json.chatInput === 'string' ? (items[i].json.chatInput as string) : '';
				const result = await postJSON<PipelineRetrieveResponse>(
					{ apiKey, baseUrl },
					`/api/v1/pipelines/${pipelineId}/retrieve`,
					{ dense_similarity_top_k: 5, query: chatMessage },
				);

				const contextTexts: string[] = [];
				for (const node of result.retrieval_nodes) {
					if (node.node.text) {
						contextTexts.push(node.node.text);
					}
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
