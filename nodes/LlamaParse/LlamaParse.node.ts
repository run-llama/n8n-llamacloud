import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import { LlamaParseReader } from 'llama-cloud-services';

export class LlamaParse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaParse',
		name: 'llamaParse',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Parse PDF files and get their content in markdown!',
		defaults: {
			name: 'LlamaParse',
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
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['parse'],
						resource: ['parsing'],
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
			if (resource === 'parsing') {
				if (operation === 'parse') {
					// Get email input
					const filePath = this.getNodeParameter('filePath', i) as string;
					// Get additional fields input
					const credentials = await this.getCredentials('llamaCloudApi');
					const apiKey = credentials.apiKey as string;

					const reader = new LlamaParseReader({ resultType: 'markdown', apiKey: apiKey });

					const documents = await reader.loadData(filePath);

					for (let j = 0; j < documents.length; j++) {
						returnData.push(documents[i].toJSON());
					}
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
