import {
	NodeOperationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { getJSON, postJSON, pollUntil, uploadFile, errorMessage } from '../LlamaParse/utils.js';

type SheetsRegion = {
	title?: string;
	description?: string;
	region_id?: string;
};

type SheetsStatus = {
	id?: string;
	status?: string;
	errors?: string[];
	regions?: SheetsRegion[];
};

export class LlamaSheets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaSheets',
		subtitle: 'Parse Excel sheets and extract LLM-friendly data from them.',
		name: 'llamaSheets',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Parse an Excel file and download Parquet data',
		defaults: {
			name: 'LlamaSheets',
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
						name: 'Parse an Excel File',
						value: 'sheets',
					},
				],
				default: 'sheets',
				noDataExpression: true,
				required: true,
				description: 'Parse an Excel File, download Parquet data',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['sheets'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'sheets',
						description: 'Parse a Excel File',
						action: 'Parse an xlsx file',
					},
				],
				default: 'sheets',
				noDataExpression: true,
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sheets'],
						resource: ['sheets'],
					},
				},
				default: 'data',
				placeholder: 'data',
				description: 'Name of the binary property containing the Excel file to parse',
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
				if (resource === 'sheets') {
					if (operation === 'sheets') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaCloudApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
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

						// 1) Create sheets parsing job.
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v1/beta/sheets/jobs', {
								file_id: fileId,
								config: { generate_additional_metadata: true },
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeOperationError(
								this.getNode(),
								`Could not create sheets job: ${errorMessage(e)}`,
								{ itemIndex: i },
							);
						}

						// 2) Poll until complete. Terminal success: SUCCESS / PARTIAL_SUCCESS.
						const parsed = await pollUntil<SheetsStatus>(
							() =>
								getJSON<SheetsStatus>(http, `/api/v1/beta/sheets/jobs/${jobId}`, {
									include_results: true,
								}),
							(r) => {
								return r?.status === 'SUCCESS' || r?.status === 'PARTIAL_SUCCESS';
							},
							(r) => r?.status === 'ERROR' || r?.status === 'CANCELLED',
							(r) => {
								const errs =
									Array.isArray(r?.errors) && r.errors.length ? `: ${r.errors.join(', ')}` : '';
								return `Sheets job ${jobId} ${r?.status}${errs}`;
							},
							{ label: `Sheets job ${jobId}` },
						);

						if (!parsed.regions || parsed.regions.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Could not parse the excel sheet', {
								itemIndex: i,
							});
						}
						for (const region of parsed.regions) {
							const regionTitle = region.title ? region.title : '';
							const regionDescription = region.description ? region.description : '';
							const regionId = region.region_id ? region.region_id : null;
							let regionUrl: string | null = null;
							if (regionId) {
								const presigned = await getJSON<{ url: string }>(
									http,
									`/api/v1/beta/sheets/jobs/${parsed.id}/regions/${regionId}/result/table`,
									{ expires_at_seconds: 3600 },
								);
								regionUrl = presigned.url;
							}
							returnData.push({
								json: {
									regionTitle,
									regionDescription,
									parquetUrl: regionUrl,
									secondsToExpire: 3600,
								},
								pairedItem: { item: i },
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
