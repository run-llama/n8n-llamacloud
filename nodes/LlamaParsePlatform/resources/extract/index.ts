import type { INodeProperties } from 'n8n-workflow';

export const extractProperties: INodeProperties[] = [
	{
		displayName: 'Configuration Mode',
		name: 'configMode',
		type: 'options',
		options: [
			{
				name: 'Schema',
				value: 'schema',
				description: 'Provide an inline JSON schema defining the extraction structure',
			},
			{
				name: 'Configuration ID',
				value: 'configId',
				description: 'Use a saved LlamaExtract configuration from the LlamaCloud dashboard',
			},
		],
		default: 'schema',
		noDataExpression: true,
		displayOptions: {
			show: {
				operation: ['extract'],
			},
		},
	},
	{
		displayName: 'Data Schema',
		name: 'dataSchema',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				operation: ['extract'],
				configMode: ['schema'],
			},
		},
		default: '',
		placeholder: '',
		description: 'JSON schema representing the structure the extracted data should follow',
	},
	{
		displayName: 'Configuration ID',
		name: 'configId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['extract'],
				configMode: ['configId'],
			},
		},
		default: '',
		placeholder: 'e.g. 1234abcd-...',
		description:
			'ID of the LlamaExtract configuration that defines the schema and prompts. Create one in the LlamaCloud dashboard under Extract.',
	},
	{
		displayName: 'Input Type',
		name: 'inputType',
		type: 'options',
		options: [
			{
				name: 'Binary File',
				value: 'binaryFile',
				description: 'Provide binary data as file input for extraction',
			},
			{
				name: 'File ID',
				value: 'fileId',
				description: 'Provide the ID of a file uploaded to the LlamaParse Platform',
			},
		],
		default: 'binaryFile',
		noDataExpression: true,
		displayOptions: {
			show: {
				operation: ['extract'],
			},
		},
	},
	{
		displayName: 'Input Data Field Name',
		name: 'inputDataFieldName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['extract'],
				inputType: ['binaryFile'],
			},
		},
		default: 'data',
		placeholder: 'data',
		description: "Name of the input item's binary property that holds the file to extract from",
	},
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['extract'],
				inputType: ['fileId'],
			},
		},
		default: '',
		placeholder: 'e.g. 14977a95-8b09-47a9-a309-b4f1c3593742',
		description: 'ID of a file previously uploaded using the "Upload a File" action',
	},
	{
		displayName: 'Options',
		name: 'extractOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['extract'],
			},
		},
		options: [
			{
				displayName: 'Cite Sources',
				name: 'citeSources',
				type: 'boolean',
				default: false,
				description:
					'Whether to include page, bounding-box, and matching-text citations for each extracted field. Only applied in Schema mode; with Configuration ID use the settings on the saved configuration instead. Also requests extraction metadata in the response.',
				displayOptions: {
					show: {
						'/configMode': ['schema'],
					},
				},
			},
			{
				displayName: 'Confidence Scores',
				name: 'confidenceScores',
				type: 'boolean',
				default: false,
				description:
					'Whether to include a per-field confidence score (0–1) for each extracted value. Only applied in Schema mode; with Configuration ID use the settings on the saved configuration instead. Also requests extraction metadata in the response.',
				displayOptions: {
					show: {
						'/configMode': ['schema'],
					},
				},
			},
			{
				displayName: 'Include Extraction Metadata',
				name: 'includeExtractionMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to return extract_metadata (citations and confidence scores when enabled) and the job ID alongside the result. Required in Configuration ID mode to surface metadata from a saved configuration that has citations or confidence scores enabled.',
			},
		],
	},
];
