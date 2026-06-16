import {
	NodeOperationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { getJSON, postJSON, pollUntil, uploadFile, errorMessage } from './utils.js';

type ParseStatus = {
	job?: { status?: string; error_message?: string };
	markdown_full?: string;
	text_full?: string;
};

export class LlamaParse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaParse',
		subtitle: 'Parse unstructured documents into structured markdown or plain text',
		name: 'llamaParse',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Parse PDF files and get their content in markdown!',
		defaults: {
			name: 'LlamaParse',
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
						name: 'Parse the File',
						value: 'parsing',
					},
				],
				default: 'parsing',
				noDataExpression: true,
				required: true,
				description: 'Parse a PDF file and get the markdown content!',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['parsing'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'parse',
						description: 'Parse a PDF File',
						action: 'Parse a pdf file',
					},
				],
				default: 'parse',
				noDataExpression: true,
			},
			{
				displayName: 'Tier',
				name: 'tier',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['parse'],
						resource: ['parsing'],
					},
				},
				options: [
					{
						name: 'Agentic',
						value: 'agentic',
					},
					{
						name: 'Agentic Plus',
						value: 'agentic_plus',
					},
					{
						name: 'Cost Effective',
						value: 'cost_effective',
					},
					{
						name: 'Fast',
						value: 'fast',
					},
				],
				default: 'fast',
				description: 'Parsing tier',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['parse'],
						resource: ['parsing'],
					},
				},
				default: 'latest',
				placeholder: 'latest',
				description: 'Version of the Parse service to use for the parsing job',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['parse'],
						resource: ['parsing'],
					},
				},
				default: 'data',
				placeholder: 'data',
				description: 'Name of the binary property containing the file to parse',
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
				if (resource === 'parsing') {
					if (operation === 'parse') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaCloudApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
						const tier = this.getNodeParameter('tier', i) as
							| 'fast'
							| 'cost_effective'
							| 'agentic'
							| 'agentic_plus';
						const version = this.getNodeParameter('version', i) as string;

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

						const expand: string[] =
							tier === 'fast' ? ['text_full'] : ['text_full', 'markdown_full'];

						// 1) Create the parse job (POST /api/v2/parse).
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v2/parse', {
								file_id: fileId,
								tier,
								version,
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeOperationError(
								this.getNode(),
								`Could not create parse job: ${errorMessage(e)}`,
								{ itemIndex: i },
							);
						}

						// 2) Poll GET /api/v2/parse/{job_id} until terminal status.
						const parsed = await pollUntil<ParseStatus>(
							() => getJSON<ParseStatus>(http, `/api/v2/parse/${jobId}`, { expand }),
							(r) => {
								return r?.job?.status === 'COMPLETED';
							},
							(r) => r?.job?.status === 'FAILED' || r?.job?.status === 'CANCELLED',
							(r) =>
								`Parse job ${jobId} ${r?.job?.status}: ${r?.job?.error_message ?? 'unknown error'}`,
							{ label: `Parse job ${jobId}` },
						);

						if (parsed.markdown_full) {
							returnData.push({
								json: { text: parsed.markdown_full },
								pairedItem: { item: i },
							});
						} else if (parsed.text_full) {
							returnData.push({
								json: { text: parsed.text_full },
								pairedItem: { item: i },
							});
						} else {
							throw new NodeOperationError(this.getNode(), 'Could not parse the file', {
								itemIndex: i,
							});
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
