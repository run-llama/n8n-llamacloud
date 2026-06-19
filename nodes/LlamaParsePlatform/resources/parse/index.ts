import type { INodeProperties } from 'n8n-workflow';

export const parseProperties: INodeProperties[] = [
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
				description: 'Parse a document into clean text or Markdown',
				action: 'Parse a document',
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
				name: 'Fast',
				value: 'fast',
				description: 'Fastest, lowest cost. Plain text output only (best for simple documents).',
			},
			{
				name: 'Cost Effective',
				value: 'cost_effective',
				description: 'Balanced speed and quality with Markdown output',
			},
			{
				name: 'Agentic',
				value: 'agentic',
				description:
					'High-quality parsing with reasoning over complex layouts, tables, and figures',
			},
			{
				name: 'Agentic Plus',
				value: 'agentic_plus',
				description: 'Highest quality. Best for difficult documents where accuracy matters most.',
			},
		],
		default: 'fast',
		description: 'Quality and cost tier used to parse the document',
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
		description:
			'Version of the Parse service to use. Use "latest" unless you need to pin to a specific release.',
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
		description: "Name of the input item's binary property that holds the file to parse",
	},
];
