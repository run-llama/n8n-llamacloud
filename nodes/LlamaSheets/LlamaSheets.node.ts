import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import fs from 'fs';
import LlamaCloud from '../../vendor/llama-cloud/index.js';

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
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sheets'],
						resource: ['sheets'],
					},
				},
				default: '',
				placeholder: '/User/user/Desktop/file.xlsx',
				description: 'Path to your file',
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
					// Get email input
					const filePath = this.getNodeParameter('filePath', i) as string;
					// Get additional fields input
					const credentials = await this.getCredentials('llamaCloudApi');
					const apiKey = credentials.apiKey as string;
					const client = new LlamaCloud({ apiKey: apiKey });
					const fileObj = await client.files.create({
						file: fs.createReadStream(filePath),
						purpose: 'sheet',
					});
					const fileId = fileObj.id;
					const parsed = await client.beta.sheets.parse({
						file_id: fileId,
						config: {
							generate_additional_metadata: true,
						},
					});
					if (parsed.success) {
						if (parsed.regions) {
							for (const region of parsed.regions) {
								const regionTitle = region.title ? region.title : '';
								const regionDescription = region.description ? region.description : '';
								const regionId = region.region_id ? region.region_id : null;
								let regionUrl: string | null = null;
								if (regionId) {
									const parquetUrl = await client.beta.sheets.getResultTable('table', {
										region_id: regionId,
										spreadsheet_job_id: parsed.id,
										expires_at_seconds: 3600,
									});
									regionUrl = parquetUrl.url;
								}
								const obj = {
									regionTitle: regionTitle,
									regionDescription: regionDescription,
									parquetUrl: regionUrl,
									secondsToExpire: 3600,
								};
								returnData.push(obj);
							}
						} else {
							throw new ApplicationError('Could not parse the excel sheet');
						}
					} else {
						throw new ApplicationError('Could not parse the excel sheet');
					}
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
