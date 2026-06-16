import {
	NodeOperationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { getJSON, postJSON, pollUntil, uploadFile, errorMessage } from '../LlamaParse/utils.js';

interface ClassifyRule {
	type: string;
	description: string;
}

type ClassifyStatus = {
	status?: string;
	error_message?: string;
	result?: {
		type?: string;
		reasoning?: string;
		confidence?: number;
	};
};

export class LlamaClassify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaClassify',
		subtitle: 'Classify files according to pre-defined rules',
		name: 'llamaClassify',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Classify files based on specific rules.',
		defaults: {
			name: 'LlamaClassify',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Classify File',
						value: 'classify',
					},
				],
				default: 'classify',
				noDataExpression: true,
				required: true,
				description: 'Classify a file based on pre-defined rules',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['classify'],
					},
				},
				options: [
					{
						name: 'Classify',
						value: 'classify',
						description: 'Classify a file based on pre-defined rules',
						action: 'Classify a file',
					},
				],
				default: 'classify',
				noDataExpression: true,
			},
			{
				displayName: 'Rules',
				name: 'rulesUi',
				placeholder: 'Add Rule',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				required: true,
				description: 'Classification Rules',
				options: [
					{
						name: 'rules',
						displayName: 'Rules',
						values: [
							{
								displayName: 'Category',
								name: 'category',
								default: '',
								required: true,
								type: 'string',
							},
							{
								displayName: 'Description',
								name: 'description',
								default: '',
								required: true,
								type: 'string',
							},
						],
					},
				],
				displayOptions: {
					show: {
						operation: ['classify'],
						resource: ['classify'],
					},
				},
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['classify'],
						resource: ['classify'],
					},
				},
				default: 'data',
				placeholder: 'data',
				description: 'Name of the binary property containing the file to classify',
			},
		],
		usableAsTool: true,
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'classify') {
					if (operation === 'classify') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaCloudApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';

						const rules = this.getNodeParameter('rulesUi', i) as {
							rules: {
								category: string;
								description: string;
							}[];
						};
						const http = { apiKey, baseUrl };

						let fileId: string;
						try {
							fileId = await uploadFile(http, {
								buffer,
								mimeType: binaryData.mimeType,
								fileName: binaryData.fileName,
								fileExtension: binaryData.fileExtension,
							});
						} catch (e) {
							throw new NodeOperationError(
								this.getNode(),
								`Could not upload the file: ${errorMessage(e)}`,
								{ itemIndex: i },
							);
						}

						const classifyRules: ClassifyRule[] = rules.rules.map((rule) => ({
							type: rule.category,
							description: rule.description,
						}));

						// 1) Create classify job.
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v2/classify', {
								file_input: fileId,
								configuration: { rules: classifyRules },
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeOperationError(
								this.getNode(),
								`Could not create classify job: ${errorMessage(e)}`,
								{ itemIndex: i },
							);
						}

						// 2) Poll until complete.
						const result = await pollUntil<ClassifyStatus>(
							() => getJSON<ClassifyStatus>(http, `/api/v2/classify/${jobId}`),
							(r) => {
								return r?.status === 'COMPLETED';
							},
							(r) => r?.status === 'FAILED',
							(r) => `Classify job ${jobId} ${r?.status}: ${r?.error_message ?? 'unknown error'}`,
							{ label: `Classify job ${jobId}` },
						);

						if (result.result) {
							returnData.push({
								json: {
									category: result.result.type ?? 'unclassified',
									reasons: result.result.reasoning,
									confidence: result.result.confidence,
								},
								pairedItem: { item: i },
							});
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Could not produce a classification for the file',
								{ itemIndex: i },
							);
						}
					}
				}
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
		// Map data to n8n data structure
		return [returnData];
	}
}
