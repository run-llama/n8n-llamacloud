import type { INodeProperties } from 'n8n-workflow';

export const extractProperties: INodeProperties[] = [
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
				description:
					'Extract structured data from a document using a saved extraction configuration',
				action: 'Extract structured data from a document',
			},
		],
		default: 'extract',
		noDataExpression: true,
	},
	{
		displayName: 'Data Schema',
		name: 'dataSchema',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				operation: ['extract'],
				resource: ['extracting'],
			},
		},
		default: '',
		placeholder: '',
		description: 'JSON schema representing the structure the extracted data should follow',
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
		description: "Name of the input item's binary property that holds the file to extract from",
	},
];
