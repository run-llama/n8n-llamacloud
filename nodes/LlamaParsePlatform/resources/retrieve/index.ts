import type { INodeProperties } from 'n8n-workflow';

export const retrieveProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['retrieval'],
			},
		},
		options: [
			{
				name: 'Retrieve From Index',
				value: 'retrieveIndex',
				description:
					'Retrieve context from a LlamaCloud Index using the /api/v1/retrieval/retrieve endpoint',
				action: 'Retrieve context from an index',
			},
			{
				name: 'Retrieve From Pipeline (Legacy)',
				value: 'retrievePipeline',
				description:
					'Retrieve context from a legacy LlamaCloud pipeline using the /api/v1/pipelines retrieve endpoint',
				action: 'Retrieve context from a legacy pipeline',
			},
		],
		default: 'retrieveIndex',
		noDataExpression: true,
	},
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1234abcd-...',
		description: 'The LlamaCloud Index (or legacy pipeline) ID to retrieve from',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveIndex', 'retrievePipeline'],
			},
		},
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '={{ $json.chatInput }}',
		required: true,
		description:
			'The natural-language query to retrieve context for. Defaults to the chatInput field on the current item so the node works as an AI Agent tool out of the box.',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveIndex', 'retrievePipeline'],
			},
		},
	},
	{
		displayName: 'Top K',
		name: 'topK',
		type: 'number',
		default: 5,
		typeOptions: {
			minValue: 1,
		},
		description: 'Maximum number of context chunks to return',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveIndex', 'retrievePipeline'],
			},
		},
	},
];
