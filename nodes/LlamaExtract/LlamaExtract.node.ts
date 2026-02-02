import {
	ApplicationError,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import fs from 'fs';
import LlamaCloud from '../../sdk/index.js';

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
				displayName: 'Agent ID',
				name: 'agentId',
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
				description: 'Extraction Agent ID',
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['extract'],
						resource: ['extracting'],
					},
				},
				default: '',
				placeholder: '/User/user/Desktop/file.pdf',
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
			if (resource === 'extracting') {
				if (operation === 'extract') {
					// Get file path input
					const filePath = this.getNodeParameter('filePath', i) as string;
					// Get additional fields input
					const credentials = await this.getCredentials('llamaCloudApi');
					const apiKey = credentials.apiKey as string;

					const agentId = this.getNodeParameter('agentId', i) as string;
					const client = new LlamaCloud({ apiKey: apiKey });
					const fileObj = await client.files.create({
						file: fs.createReadStream(filePath),
						purpose: 'extract',
					});
					const fileId = fileObj.id;
					const result = await client.extraction.jobs.extract({
						extraction_agent_id: agentId,
						file_id: fileId,
					});
					if (result.data) {
						const stringified = JSON.stringify(result.data, null, 2);
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
