import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { getJSON, postJSON, pollUntil, uploadFile } from '../LlamaParse/utils.js';

export class LlamaSheets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaSheets',
		name: 'llamaSheets',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Parse an Excel file and download Parquet data',
		defaults: {
			name: 'LlamaSheets',
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
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
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
					} catch (e: any) {
						console.error('LlamaSheets upload failed', e);
						throw new ApplicationError(`Could not upload the file: ${e?.message ?? e}`);
					}

					// 1) Create sheets parsing job.
					let jobId: string;
					try {
						const job = await postJSON<{ id: string }>(http, '/api/v1/beta/sheets/jobs', {
							file_id: fileId,
							config: { generate_additional_metadata: true },
						});
						jobId = job.id;
					} catch (e: any) {
						console.error('LlamaSheets create-job failed', e);
						throw new ApplicationError(`Could not create sheets job: ${e?.message ?? e}`);
					}

					// 2) Poll until complete. Terminal success: SUCCESS / PARTIAL_SUCCESS.
					const parsed = await pollUntil<any>(
						() => getJSON(http, `/api/v1/beta/sheets/jobs/${jobId}`, { include_results: true }),
						(r) => {
							console.log('Sheets status', r?.status);
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
						throw new ApplicationError('Could not parse the excel sheet');
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
							regionTitle,
							regionDescription,
							parquetUrl: regionUrl,
							secondsToExpire: 3600,
						});
					}
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
