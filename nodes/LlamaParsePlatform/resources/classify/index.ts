import type { INodeProperties } from 'n8n-workflow';

export const classifyProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['classifying'],
			},
		},
		options: [
			{
				name: 'Classify',
				value: 'classify',
				description: 'Classify a document into one of your defined categories',
				action: 'Classify a document',
			},
		],
		default: 'classify',
		noDataExpression: true,
	},
	{
		displayName: 'Rules',
		name: 'rulesUi',
		placeholder: 'Add Rule',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		description: 'Categories the document may be classified into. Add one rule per category.',
		options: [
			{
				name: 'rules',
				displayName: 'Rules',
				values: [
					{
						displayName: 'Category',
						name: 'category',
						default: '',
						required: true,
						type: 'string',
						description: 'Short label for this category, e.g. "invoice" or "contract"',
					},
					{
						displayName: 'Description',
						name: 'description',
						default: '',
						required: true,
						type: 'string',
						description:
							'Plain-language description of what content belongs in this category. Used by the model to decide.',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['classify'],
				resource: ['classifying'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['classify'],
				resource: ['classifying'],
			},
		},
		default: 'data',
		placeholder: 'data',
		description: 'Name of the input item\'s binary property that holds the file to classify',
	},
];
