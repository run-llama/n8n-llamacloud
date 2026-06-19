import type { INodeProperties } from 'n8n-workflow';

export const splitProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['splitting'],
			},
		},
		options: [
			{
				name: 'Split',
				value: 'split',
				description: 'Split a document into segments by category',
				action: 'Split a file',
			},
		],
		default: 'split',
		noDataExpression: true,
	},
	{
		displayName: 'Categories',
		name: 'categoriesUi',
		placeholder: 'Add Category',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		description: 'Categories used to split the document into segments',
		options: [
			{
				name: 'categories',
				displayName: 'Categories',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						default: '',
						required: true,
						type: 'string',
						description: 'Name of the category, e.g. "essay" or "research_paper"',
					},
					{
						displayName: 'Description',
						name: 'description',
						default: '',
						type: 'string',
						description: 'Optional description of what content belongs in this category',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['split'],
				resource: ['splitting'],
			},
		},
	},
	{
		displayName: 'Allow Uncategorized',
		name: 'allowUncategorized',
		type: 'options',
		default: 'include',
		description:
			'How to handle pages that do not match any defined category: include them as "uncategorized" in results, forbid (all pages must match a category), or omit (excluded from results)',
		options: [
			{ name: 'Include', value: 'include' },
			{ name: 'Forbid', value: 'forbid' },
			{ name: 'Omit', value: 'omit' },
		],
		displayOptions: {
			show: {
				operation: ['split'],
				resource: ['splitting'],
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
				operation: ['split'],
				resource: ['splitting'],
			},
		},
		default: 'data',
		placeholder: 'data',
		description: 'Name of the input item\'s binary property that holds the file to split',
	},
];
