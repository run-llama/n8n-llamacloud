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
		],
		default: 'retrieveIndex',
		noDataExpression: true,
	},
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select an index...',
				typeOptions: {
					searchListMethod: 'searchIndexes',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 1234abcd-...',
			},
		],
		description: 'The LlamaCloud Index to retrieve from',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveIndex'],
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
				operation: ['retrieveIndex'],
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
				operation: ['retrieveIndex'],
			},
		},
	},
];
