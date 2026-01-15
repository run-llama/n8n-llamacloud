import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow/dist/index.js';

import fs from 'fs';
import LlamaCloud from '@llamaindex/llama-cloud';
import { ClassifierRule } from '@llamaindex/llama-cloud/resources/classifier.js';

export class LlamaClassify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaClassify',
		name: 'llamaClassify',
		icon: 'file:llamacloud.svg',
		group: ['transform'],
		version: 1,
		description: 'Classify files based on specific rules.',
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
						name: 'Classify File',
						value: 'classify',
					},
				],
				default: 'classify',
				noDataExpression: true,
				required: true,
				description: 'Classify a file based on pre-defined rules',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['classify'],
					},
				},
				options: [
					{
						name: 'Classify',
						value: 'classify',
						description: 'Classify a file based on pre-defined rules',
						action: 'Classify a file',
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
				default: [],
				required: true,
				description: 'Classification Rules',
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
							},
							{
								displayName: 'Description',
								name: 'description',
								default: '',
								required: true,
								type: 'string',
							},
						],
					},
				],
				displayOptions: {
					show: {
						operation: ['classify'],
						resource: ['classify'],
					},
				},
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['classify'],
						resource: ['classify'],
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
			if (resource === 'classify') {
				if (operation === 'classify') {
					// Get file path input
					const filePath = this.getNodeParameter('filePath', i) as string;
					// Get additional fields input
					const credentials = await this.getCredentials('llamaCloudApi');
					const apiKey = credentials.apiKey as string;

					const rules = this.getNodeParameter('rulesUi', i) as {
						rules: {
							category: string;
							description: string;
						}[];
					};
					const client = new LlamaCloud({ apiKey: apiKey });
					const fileObj = await client.files.create({
						file: fs.createReadStream(filePath),
						purpose: 'classify',
					});
					const fileId = fileObj.id;
					const classifyRules: ClassifierRule[] = [];
					for (const rule of rules.rules) {
						const classifierRule = {
							type: rule.category,
							description: rule.description,
						} as ClassifierRule;
						classifyRules.push(classifierRule);
					}
					const result = await client.classifier.classify({
						rules: classifyRules,
						file_ids: [fileId],
					});
					const class_res = result.items[0];
					if (class_res.result) {
						const obj = {
							category: class_res.result.type,
							reasons: class_res.result.reasoning,
							confidence: class_res.result.confidence,
						};
						returnData.push(obj);
					} else {
						throw new ApplicationError('Could not produce a classification for the file');
					}
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
