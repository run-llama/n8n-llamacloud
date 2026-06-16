import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { getJSON, postJSON, pollUntil, uploadFile } from '../LlamaParse/utils.js';

export class LlamaExtract implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaExtract',
		name: 'llamaExtract',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Extract content from files through LlamaExtract agents!',
		defaults: {
			name: 'LlamaExtract',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Extract Data',
						value: 'extracting',
					},
				],
				default: 'extracting',
				noDataExpression: true,
				required: true,
				description: 'Extract Data From a File and Get Elegant Structured Information about it',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['extracting'],
					},
				},
				options: [
					{
						name: 'Extract',
						value: 'extract',
						description: 'Extract Data from a File',
						action: 'Extract data from a file',
					},
				],
				default: 'extract',
				noDataExpression: true,
			},
			{
				displayName: 'Configuration ID',
				name: 'configId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['extract'],
						resource: ['extracting'],
					},
				},
				default: '',
				placeholder: '',
				description: 'Extraction Configuration ID',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['extract'],
						resource: ['extracting'],
					},
				},
				default: 'data',
				placeholder: 'data',
				description: 'Name of the binary property containing the file to extract from',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			if (resource === 'extracting') {
				if (operation === 'extract') {
					// Get binary data input
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					// Get additional fields input
					const credentials = await this.getCredentials('llamaCloudApi');
					const apiKey = credentials.apiKey as string;
					const baseUrl =
						(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';

					const configId = this.getNodeParameter('configId', i) as string;
					const http = { apiKey, baseUrl };

					let fileId: string;
					try {
						fileId = await uploadFile(http, {
							buffer,
							mimeType: binaryData.mimeType,
							fileName: binaryData.fileName,
							fileExtension: binaryData.fileExtension,
						});
					} catch (e: any) {
						console.error('LlamaExtract upload failed', e);
						throw new ApplicationError(`Could not upload the file: ${e?.message ?? e}`);
					}

					// 1) Create extract job.
					let jobId: string;
					try {
						const job = await postJSON<{ id: string }>(http, '/api/v2/extract', {
							configuration_id: configId,
							file_input: fileId,
						});
						jobId = job.id;
					} catch (e: any) {
						console.error('LlamaExtract create-job failed', e);
						throw new ApplicationError(`Could not create extract job: ${e?.message ?? e}`);
					}

					// 2) Poll until complete.
					const result = await pollUntil<any>(
						() => getJSON(http, `/api/v2/extract/${jobId}`),
						(r) => {
							console.log('Extract status', r?.status);
							return r?.status === 'COMPLETED';
						},
						(r) => r?.status === 'FAILED' || r?.status === 'CANCELLED',
						(r) => `Extract job ${jobId} ${r?.status}: ${r?.error_message ?? 'unknown error'}`,
						{ label: `Extract job ${jobId}` },
					);

					if (result.extract_result) {
						const stringified = JSON.stringify(result.extract_result, null, 2);
						const obj = { result: stringified } as IDataObject;
						returnData.push(obj);
					} else {
						throw new ApplicationError('Could not extract data');
					}
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
