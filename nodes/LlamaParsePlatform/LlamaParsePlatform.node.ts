import {
	NodeOperationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	IDataObject,
	NodeApiError,
} from 'n8n-workflow';

import { getJSON, postJSON, pollUntil, uploadFile, errorMessage } from './resources/utils.js';
import {
	classifyProperties,
	extractProperties,
	parseProperties,
	retrieveProperties,
	splitProperties,
} from './resources/index.js';
import type {
	ClassifyRule,
	ClassifyStatus,
	ExtractStatus,
	ParseStatus,
	SplitCategory,
	SplitStatus,
} from './resources/types.js';

export class LlamaParsePlatform implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LlamaParse Platform',
		subtitle: '={{$parameter["operation"]}}',
		name: 'llamaParsePlatform',
		icon: { light: 'file:./llamaindex_white.svg', dark: 'file:./llamaindex_dark.svg' },
		group: ['transform'],
		version: 1,
		description:
			'Parse, classify, split, extract structured data, and retrieve context from documents and indexes using the LlamaParse Platform',
		defaults: {
			name: 'LlamaParse Platform',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'llamaParseApi',
				required: true,
				displayName: 'LlamaParse API Credentials',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Classify',
						value: 'classifying',
					},
					{
						name: 'Extract',
						value: 'extracting',
					},
					{
						name: 'Parse',
						value: 'parsing',
					},
					{
						name: 'Retrieve',
						value: 'retrieval',
					},
					{
						name: 'Split',
						value: 'splitting',
					},
				],
				default: 'parsing',
				noDataExpression: true,
				required: true,
				description: 'The LlamaCloud service to use on the input document',
			},
			...parseProperties,
			...classifyProperties,
			...extractProperties,
			...retrieveProperties,
			...splitProperties,
		],
		usableAsTool: true,
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as
			| 'parsing'
			| 'classifying'
			| 'extracting'
			| 'retrieval'
			| 'splitting';
		const operation = this.getNodeParameter('operation', 0) as
			| 'parse'
			| 'classify'
			| 'extract'
			| 'retrieveIndex'
			| 'retrievePipeline'
			| 'split';

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'parsing') {
					if (operation === 'parse') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaParseApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
						const tier = this.getNodeParameter('tier', i) as
							| 'fast'
							| 'cost_effective'
							| 'agentic'
							| 'agentic_plus';
						const version = this.getNodeParameter('version', i) as string;

						const http = { apiKey, baseUrl };

						let fileId: string;
						try {
							fileId = await uploadFile(http, {
								buffer,
								mimeType: binaryData.mimeType,
								fileName: binaryData.fileName,
								fileExtension: binaryData.fileExtension,
							});
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not upload the file: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						const expand: string[] =
							tier === 'fast' ? ['text_full'] : ['text_full', 'markdown_full'];

						// 1) Create the parse job (POST /api/v2/parse).
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v2/parse', {
								file_id: fileId,
								tier,
								version,
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not create parse job: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 2) Poll GET /api/v2/parse/{job_id} until terminal status.
						const parsed = await pollUntil<ParseStatus>(
							() => getJSON<ParseStatus>(http, `/api/v2/parse/${jobId}`, { expand }),
							(r) => {
								return r?.job?.status === 'COMPLETED';
							},
							(r) => r?.job?.status === 'FAILED' || r?.job?.status === 'CANCELLED',
							(r) =>
								`Parse job ${jobId} ${r?.job?.status}: ${r?.job?.error_message ?? 'unknown error'}`,
							{ label: `Parse job ${jobId}` },
						);

						if (parsed.markdown_full) {
							returnData.push({
								json: { text: parsed.markdown_full },
								pairedItem: { item: i },
							});
						} else if (parsed.text_full) {
							returnData.push({
								json: { text: parsed.text_full },
								pairedItem: { item: i },
							});
						} else {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(this.getNode(), 'Could not parse the file', {
								itemIndex: i,
							});
						}
					} else {
						// this is a non-HTTP related failure, hence the NodeOperationError
						throw new NodeOperationError(
							this.getNode(),
							`Operation ${operation} not supported for resource ${resource}`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'classifying') {
					if (operation === 'classify') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaParseApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';

						const rules = this.getNodeParameter('rulesUi', i) as {
							rules: {
								category: string;
								description: string;
							}[];
						};
						const http = { apiKey, baseUrl };

						let fileId: string;
						try {
							fileId = await uploadFile(http, {
								buffer,
								mimeType: binaryData.mimeType,
								fileName: binaryData.fileName,
								fileExtension: binaryData.fileExtension,
							});
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not upload the file: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						const classifyRules: ClassifyRule[] = rules.rules.map((rule) => ({
							type: rule.category,
							description: rule.description,
						}));

						// 1) Create classify job.
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v2/classify', {
								file_input: fileId,
								configuration: { rules: classifyRules },
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not create classify job: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 2) Poll until complete.
						const result = await pollUntil<ClassifyStatus>(
							() => getJSON<ClassifyStatus>(http, `/api/v2/classify/${jobId}`),
							(r) => {
								return r?.status === 'COMPLETED';
							},
							(r) => r?.status === 'FAILED',
							(r) => `Classify job ${jobId} ${r?.status}: ${r?.error_message ?? 'unknown error'}`,
							{ label: `Classify job ${jobId}` },
						);

						if (result.result) {
							returnData.push({
								json: {
									category: result.result.type ?? 'unclassified',
									reasons: result.result.reasoning,
									confidence: result.result.confidence,
								},
								pairedItem: { item: i },
							});
						} else {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(
								this.getNode(),
								'Could not produce a classification for the file',
								{ itemIndex: i },
							);
						}
					} else {
						// this is a non-HTTP related failure, hence the NodeOperationError
						throw new NodeOperationError(
							this.getNode(),
							`Operation ${operation} not supported for resource ${resource}`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'extracting') {
					if (operation === 'extract') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get additional fields input
						const credentials = await this.getCredentials('llamaParseApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';

						const configId = this.getNodeParameter('configId', i) as string;
						const http = { apiKey, baseUrl };

						let fileId: string;
						try {
							fileId = await uploadFile(http, {
								buffer,
								mimeType: binaryData.mimeType,
								fileName: binaryData.fileName,
								fileExtension: binaryData.fileExtension,
							});
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not upload the file: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 1) Create extract job.
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v2/extract', {
								configuration_id: configId,
								file_input: fileId,
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not create extract job: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 2) Poll until complete.
						const result = await pollUntil<ExtractStatus>(
							() => getJSON<ExtractStatus>(http, `/api/v2/extract/${jobId}`),
							(r) => {
								return r?.status === 'COMPLETED';
							},
							(r) => r?.status === 'FAILED' || r?.status === 'CANCELLED',
							(r) => `Extract job ${jobId} ${r?.status}: ${r?.error_message ?? 'unknown error'}`,
							{ label: `Extract job ${jobId}` },
						);

						if (result.extract_result) {
							const stringified = JSON.stringify(result.extract_result, null, 2);
							const obj: IDataObject = { result: stringified };
							returnData.push({ json: obj, pairedItem: { item: i } });
						} else {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(this.getNode(), 'Could not extract data', {
								itemIndex: i,
							});
						}
					} else {
						// this is a non-HTTP related failure, hence the NodeOperationError
						throw new NodeOperationError(
							this.getNode(),
							`Operation ${operation} not supported for resource ${resource}`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'retrieval') {
					if (operation === 'retrieveIndex' || operation === 'retrievePipeline') {
						const credentials = await this.getCredentials('llamaParseApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
						const http = { apiKey, baseUrl };

						const indexId = this.getNodeParameter('indexId', i) as string;
						const queryRaw = this.getNodeParameter('query', i, '') as unknown;
						const query = typeof queryRaw === 'string' ? queryRaw : String(queryRaw ?? '');
						const topKRaw = this.getNodeParameter('topK', i, 5) as unknown;
						const topK = Number.parseInt(String(topKRaw), 10) || 5;

						if (!indexId) {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(this.getNode(), 'Index ID is required', {
								itemIndex: i,
							});
						}
						if (!query) {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(
								this.getNode(),
								'Query is required (defaults to {{ $json.chatInput }})',
								{ itemIndex: i },
							);
						}

						const contextTexts: string[] = [];
						try {
							if (operation === 'retrievePipeline') {
								const result = await postJSON<{
									retrieval_nodes: Array<{ node: { text?: string | null } }>;
								}>(http, `/api/v1/pipelines/${indexId}/retrieve`, {
									dense_similarity_top_k: topK,
									query,
								});
								for (const node of result.retrieval_nodes ?? []) {
									if (node?.node?.text) contextTexts.push(node.node.text);
								}
							} else {
								const result = await postJSON<{ results: Array<{ content: string }> }>(
									http,
									'/api/v1/retrieval/retrieve',
									{ index_id: indexId, query, top_k: topK },
								);
								for (const node of result.results ?? []) {
									if (node?.content) contextTexts.push(node.content);
								}
							}
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not retrieve context: ${errorMessage(e)}}` },
								{ itemIndex: i },
							);
						}

						returnData.push({
							json: { context: contextTexts },
							pairedItem: { item: i },
						});
					} else {
						// this is a non-HTTP related failure, hence the NodeOperationError
						throw new NodeOperationError(
							this.getNode(),
							`Operation ${operation} not supported for resource ${resource}`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'splitting') {
					if (operation === 'split') {
						// Get binary data input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						// Get credentials
						const credentials = await this.getCredentials('llamaParseApi');
						const apiKey = credentials.apiKey as string;
						const baseUrl =
							(credentials.baseURL as string | null) ?? 'https://api.cloud.llamaindex.ai';
						const http = { apiKey, baseUrl };

						const categoriesParam = this.getNodeParameter('categoriesUi', i, {}) as {
							categories?: { name: string; description?: string }[];
						};
						const categories: SplitCategory[] = (categoriesParam.categories ?? []).map((c) => ({
							name: c.name,
							...(c.description ? { description: c.description } : {}),
						}));
						if (categories.length === 0) {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(
								this.getNode(),
								'At least one Category is required to split a document',
								{ itemIndex: i },
							);
						}

						const allowUncategorized = this.getNodeParameter('allowUncategorized', i, 'include') as
							| 'include'
							| 'forbid'
							| 'omit';

						let fileId: string;
						try {
							fileId = await uploadFile(http, {
								buffer,
								mimeType: binaryData.mimeType,
								fileName: binaryData.fileName,
								fileExtension: binaryData.fileExtension,
							});
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not upload the file: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 1) Create split job.
						let jobId: string;
						try {
							const job = await postJSON<{ id: string }>(http, '/api/v1/beta/split/jobs', {
								document_input: { type: 'file_id', value: fileId },
								configuration: {
									categories,
									splitting_strategy: { allow_uncategorized: allowUncategorized },
								},
							});
							jobId = job.id;
						} catch (e) {
							throw new NodeApiError(
								this.getNode(),
								{ message: `Could not create split job: ${errorMessage(e)}` },
								{ itemIndex: i },
							);
						}

						// 2) Poll until complete. Status values are lowercase here:
						//    pending | processing | completed | failed | cancelled.
						const result = await pollUntil<SplitStatus>(
							() => getJSON<SplitStatus>(http, `/api/v1/beta/split/jobs/${jobId}`),
							(r) => r?.status === 'completed',
							(r) => r?.status === 'failed' || r?.status === 'cancelled',
							(r) => `Split job ${jobId} ${r?.status}: ${r?.error_message ?? 'unknown error'}`,
							{ label: `Split job ${jobId}` },
						);

						const segments = result.result?.segments ?? [];
						if (segments.length === 0) {
							// this is a non-HTTP related failure, hence the NodeOperationError
							throw new NodeOperationError(
								this.getNode(),
								'Split job completed but produced no segments',
								{ itemIndex: i },
							);
						}
						for (const seg of segments) {
							returnData.push({
								json: {
									category: seg.category,
									confidence: seg.confidence_category,
									pages: seg.pages,
								},
								pairedItem: { item: i },
							});
						}
					} else {
						// this is a non-HTTP related failure, hence the NodeOperationError
						throw new NodeOperationError(
							this.getNode(),
							`Operation ${operation} not supported for resource ${resource}`,
							{ itemIndex: i },
						);
					}
				} else {
					// this is a non-HTTP related failure, hence the NodeOperationError
					throw new NodeOperationError(
						this.getNode(),
						`Resource ${resource} not supported for this node`,
						{ itemIndex: i },
					);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: errorMessage(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeOperationError) {
					// apparently n8n eslint rules do not allow re-throwing, even if
					// the type of the error is an approved one, hence the re-instantiation
					throw new NodeOperationError(error.node, error.message, { itemIndex: i });
				}
				throw new NodeApiError(this.getNode(), { message: errorMessage(error) }, { itemIndex: i });
			}
		}
		// Map data to n8n data structure
		return [returnData];
	}
}
