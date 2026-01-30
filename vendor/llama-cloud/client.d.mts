import type { RequestInit, RequestInfo } from "./internal/builtin-types.mjs";
import type { PromiseOrValue, MergedRequestInit, FinalizedRequestInit } from "./internal/types.mjs";
export type { Logger, LogLevel } from "./internal/utils/log.mjs";
import * as Opts from "./internal/request-options.mjs";
import * as Errors from "./core/error.mjs";
import * as Pagination from "./core/pagination.mjs";
import { type PaginatedAgentDataAggregateParams, PaginatedAgentDataAggregateResponse, type PaginatedAgentDataSearchParams, PaginatedAgentDataSearchResponse, type PaginatedBatchItemsParams, PaginatedBatchItemsResponse, type PaginatedClassifyJobsParams, PaginatedClassifyJobsResponse, type PaginatedCloudDocumentsParams, PaginatedCloudDocumentsResponse, type PaginatedExtractRunsParams, PaginatedExtractRunsResponse, type PaginatedJobsHistoryParams, PaginatedJobsHistoryResponse, type PaginatedPipelineFilesParams, PaginatedPipelineFilesResponse, type PaginatedQuotaConfigurationsParams, PaginatedQuotaConfigurationsResponse, type PaginatedSpreadsheetJobsParams, PaginatedSpreadsheetJobsResponse } from "./core/pagination.mjs";
import * as Uploads from "./core/uploads.mjs";
import * as API from "./resources/index.mjs";
import { APIPromise } from "./core/api-promise.mjs";
import { DataSink, DataSinkCreateParams, DataSinkListParams, DataSinkListResponse, DataSinkUpdateParams, DataSinks } from "./resources/data-sinks.mjs";
import { DataSource, DataSourceCreateParams, DataSourceListParams, DataSourceListResponse, DataSourceReaderVersionMetadata, DataSourceUpdateParams, DataSources } from "./resources/data-sources.mjs";
import { File, FileCreate, FileCreateParams, FileCreateResponse, FileDeleteParams, FileGetParams, FileQueryParams, FileQueryResponse, Files, PresignedURL } from "./resources/files.mjs";
import { BBox, FailPageMode, ListItem, LlamaParseSupportedFileExtensions, Parsing, ParsingCreateParams, ParsingCreateResponse, ParsingGetParams, ParsingGetResponse, ParsingJob, ParsingLanguages, ParsingListParams, ParsingListResponse, ParsingListResponsesPaginatedClassifyJobs, ParsingMode, StatusEnum } from "./resources/parsing.mjs";
import { Project, ProjectGetParams, ProjectListParams, ProjectListResponse, Projects } from "./resources/projects.mjs";
import { Beta } from "./resources/beta/beta.mjs";
import { Classifier } from "./resources/classifier/classifier.mjs";
import { Extraction, ExtractionRunParams } from "./resources/extraction/extraction.mjs";
import { AdvancedModeTransformConfig, AutoTransformConfig, AzureOpenAIEmbedding, AzureOpenAIEmbeddingConfig, BedrockEmbedding, BedrockEmbeddingConfig, CohereEmbedding, CohereEmbeddingConfig, DataSinkCreate, GeminiEmbedding, GeminiEmbeddingConfig, HuggingFaceInferenceAPIEmbedding, HuggingFaceInferenceAPIEmbeddingConfig, LlamaParseParameters, LlmParameters, ManagedIngestionStatusResponse, MessageRole, MetadataFilters, OpenAIEmbedding, OpenAIEmbeddingConfig, PageFigureNodeWithScore, PageScreenshotNodeWithScore, Pipeline, PipelineCreate, PipelineCreateParams, PipelineGetStatusParams, PipelineListParams, PipelineListResponse, PipelineMetadataConfig, PipelineRetrieveParams, PipelineRetrieveResponse, PipelineType, PipelineUpdateParams, PipelineUpsertParams, Pipelines, PresetRetrievalParams, RetrievalMode, SparseModelConfig, VertexAIEmbeddingConfig, VertexTextEmbedding } from "./resources/pipelines/pipelines.mjs";
import { CompositeRetrievalMode, CompositeRetrievalResult, ReRankConfig, Retriever, RetrieverCreate, RetrieverCreateParams, RetrieverGetParams, RetrieverListParams, RetrieverListResponse, RetrieverPipeline, RetrieverSearchParams, RetrieverUpdateParams, RetrieverUpsertParams, Retrievers } from "./resources/retrievers/retrievers.mjs";
import { type Fetch } from "./internal/builtin-types.mjs";
import { HeadersLike, NullableHeaders } from "./internal/headers.mjs";
import { FinalRequestOptions, RequestOptions } from "./internal/request-options.mjs";
import { type LogLevel, type Logger } from "./internal/utils/log.mjs";
export interface ClientOptions {
    /**
     * Defaults to process.env['LLAMA_CLOUD_API_KEY'].
     */
    apiKey?: string | undefined;
    /**
     * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
     *
     * Defaults to process.env['LLAMA_CLOUD_BASE_URL'].
     */
    baseURL?: string | null | undefined;
    /**
     * The maximum amount of time (in milliseconds) that the client should wait for a response
     * from the server before timing out a single request.
     *
     * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
     * much longer than this timeout before the promise succeeds or fails.
     *
     * @unit milliseconds
     */
    timeout?: number | undefined;
    /**
     * Additional `RequestInit` options to be passed to `fetch` calls.
     * Properties will be overridden by per-request `fetchOptions`.
     */
    fetchOptions?: MergedRequestInit | undefined;
    /**
     * Specify a custom `fetch` function implementation.
     *
     * If not provided, we expect that `fetch` is defined globally.
     */
    fetch?: Fetch | undefined;
    /**
     * The maximum number of times that the client will retry a request in case of a
     * temporary failure, like a network error or a 5XX error from the server.
     *
     * @default 2
     */
    maxRetries?: number | undefined;
    /**
     * Default headers to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * header to `null` in request options.
     */
    defaultHeaders?: HeadersLike | undefined;
    /**
     * Default query parameters to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * param to `undefined` in request options.
     */
    defaultQuery?: Record<string, string | undefined> | undefined;
    /**
     * Set the log level.
     *
     * Defaults to process.env['LLAMA_CLOUD_LOG'] or 'warn' if it isn't set.
     */
    logLevel?: LogLevel | undefined;
    /**
     * Set the logger.
     *
     * Defaults to globalThis.console.
     */
    logger?: Logger | undefined;
}
/**
 * API Client for interfacing with the Llama Cloud API.
 */
export declare class LlamaCloud {
    #private;
    apiKey: string;
    baseURL: string;
    maxRetries: number;
    timeout: number;
    logger: Logger;
    logLevel: LogLevel | undefined;
    fetchOptions: MergedRequestInit | undefined;
    private fetch;
    protected idempotencyHeader?: string;
    private _options;
    /**
     * API Client for interfacing with the Llama Cloud API.
     *
     * @param {string | undefined} [opts.apiKey=process.env['LLAMA_CLOUD_API_KEY'] ?? undefined]
     * @param {string} [opts.baseURL=process.env['LLAMA_CLOUD_BASE_URL'] ?? https://api.cloud.llamaindex.ai] - Override the default base URL for the API.
     * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
     * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
     */
    constructor({ baseURL, apiKey, ...opts }?: ClientOptions);
    /**
     * Create a new client instance re-using the same options given to the current client with optional overriding.
     */
    withOptions(options: Partial<ClientOptions>): this;
    protected defaultQuery(): Record<string, string | undefined> | undefined;
    protected validateHeaders({ values, nulls }: NullableHeaders): void;
    protected authHeaders(opts: FinalRequestOptions): Promise<NullableHeaders | undefined>;
    protected stringifyQuery(query: Record<string, unknown>): string;
    private getUserAgent;
    protected defaultIdempotencyKey(): string;
    protected makeStatusError(status: number, error: Object, message: string | undefined, headers: Headers): Errors.APIError;
    buildURL(path: string, query: Record<string, unknown> | null | undefined, defaultBaseURL?: string | undefined): string;
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */
    protected prepareOptions(options: FinalRequestOptions): Promise<void>;
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    protected prepareRequest(request: RequestInit, { url, options }: {
        url: string;
        options: FinalRequestOptions;
    }): Promise<void>;
    get<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp>;
    post<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp>;
    patch<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp>;
    put<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp>;
    delete<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp>;
    private methodRequest;
    request<Rsp>(options: PromiseOrValue<FinalRequestOptions>, remainingRetries?: number | null): APIPromise<Rsp>;
    private makeRequest;
    getAPIList<Item, PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>>(path: string, Page: new (...args: any[]) => PageClass, opts?: RequestOptions): Pagination.PagePromise<PageClass, Item>;
    requestAPIList<Item = unknown, PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>>(Page: new (...args: ConstructorParameters<typeof Pagination.AbstractPage>) => PageClass, options: FinalRequestOptions): Pagination.PagePromise<PageClass, Item>;
    fetchWithTimeout(url: RequestInfo, init: RequestInit | undefined, ms: number, controller: AbortController): Promise<Response>;
    private shouldRetry;
    private retryRequest;
    private calculateDefaultRetryTimeoutMillis;
    buildRequest(inputOptions: FinalRequestOptions, { retryCount }?: {
        retryCount?: number;
    }): Promise<{
        req: FinalizedRequestInit;
        url: string;
        timeout: number;
    }>;
    private buildHeaders;
    private buildBody;
    static LlamaCloud: typeof LlamaCloud;
    static DEFAULT_TIMEOUT: number;
    static LlamaCloudError: typeof Errors.LlamaCloudError;
    static APIError: typeof Errors.APIError;
    static APIConnectionError: typeof Errors.APIConnectionError;
    static APIConnectionTimeoutError: typeof Errors.APIConnectionTimeoutError;
    static APIUserAbortError: typeof Errors.APIUserAbortError;
    static NotFoundError: typeof Errors.NotFoundError;
    static ConflictError: typeof Errors.ConflictError;
    static RateLimitError: typeof Errors.RateLimitError;
    static BadRequestError: typeof Errors.BadRequestError;
    static AuthenticationError: typeof Errors.AuthenticationError;
    static InternalServerError: typeof Errors.InternalServerError;
    static PermissionDeniedError: typeof Errors.PermissionDeniedError;
    static UnprocessableEntityError: typeof Errors.UnprocessableEntityError;
    static toFile: typeof Uploads.toFile;
    projects: API.Projects;
    dataSinks: API.DataSinks;
    dataSources: API.DataSources;
    files: API.Files;
    pipelines: API.Pipelines;
    retrievers: API.Retrievers;
    parsing: API.Parsing;
    classifier: API.Classifier;
    extraction: API.Extraction;
    beta: API.Beta;
}
export declare namespace LlamaCloud {
    export type RequestOptions = Opts.RequestOptions;
    export import PaginatedJobsHistory = Pagination.PaginatedJobsHistory;
    export { type PaginatedJobsHistoryParams as PaginatedJobsHistoryParams, type PaginatedJobsHistoryResponse as PaginatedJobsHistoryResponse, };
    export import PaginatedPipelineFiles = Pagination.PaginatedPipelineFiles;
    export { type PaginatedPipelineFilesParams as PaginatedPipelineFilesParams, type PaginatedPipelineFilesResponse as PaginatedPipelineFilesResponse, };
    export import PaginatedBatchItems = Pagination.PaginatedBatchItems;
    export { type PaginatedBatchItemsParams as PaginatedBatchItemsParams, type PaginatedBatchItemsResponse as PaginatedBatchItemsResponse, };
    export import PaginatedExtractRuns = Pagination.PaginatedExtractRuns;
    export { type PaginatedExtractRunsParams as PaginatedExtractRunsParams, type PaginatedExtractRunsResponse as PaginatedExtractRunsResponse, };
    export import PaginatedCloudDocuments = Pagination.PaginatedCloudDocuments;
    export { type PaginatedCloudDocumentsParams as PaginatedCloudDocumentsParams, type PaginatedCloudDocumentsResponse as PaginatedCloudDocumentsResponse, };
    export import PaginatedQuotaConfigurations = Pagination.PaginatedQuotaConfigurations;
    export { type PaginatedQuotaConfigurationsParams as PaginatedQuotaConfigurationsParams, type PaginatedQuotaConfigurationsResponse as PaginatedQuotaConfigurationsResponse, };
    export import PaginatedClassifyJobs = Pagination.PaginatedClassifyJobs;
    export { type PaginatedClassifyJobsParams as PaginatedClassifyJobsParams, type PaginatedClassifyJobsResponse as PaginatedClassifyJobsResponse, };
    export import PaginatedSpreadsheetJobs = Pagination.PaginatedSpreadsheetJobs;
    export { type PaginatedSpreadsheetJobsParams as PaginatedSpreadsheetJobsParams, type PaginatedSpreadsheetJobsResponse as PaginatedSpreadsheetJobsResponse, };
    export import PaginatedAgentDataSearch = Pagination.PaginatedAgentDataSearch;
    export { type PaginatedAgentDataSearchParams as PaginatedAgentDataSearchParams, type PaginatedAgentDataSearchResponse as PaginatedAgentDataSearchResponse, };
    export import PaginatedAgentDataAggregate = Pagination.PaginatedAgentDataAggregate;
    export { type PaginatedAgentDataAggregateParams as PaginatedAgentDataAggregateParams, type PaginatedAgentDataAggregateResponse as PaginatedAgentDataAggregateResponse, };
    export { Projects as Projects, type Project as Project, type ProjectListResponse as ProjectListResponse, type ProjectListParams as ProjectListParams, type ProjectGetParams as ProjectGetParams, };
    export { DataSinks as DataSinks, type DataSink as DataSink, type DataSinkListResponse as DataSinkListResponse, type DataSinkCreateParams as DataSinkCreateParams, type DataSinkUpdateParams as DataSinkUpdateParams, type DataSinkListParams as DataSinkListParams, };
    export { DataSources as DataSources, type DataSource as DataSource, type DataSourceReaderVersionMetadata as DataSourceReaderVersionMetadata, type DataSourceListResponse as DataSourceListResponse, type DataSourceCreateParams as DataSourceCreateParams, type DataSourceUpdateParams as DataSourceUpdateParams, type DataSourceListParams as DataSourceListParams, };
    export { Files as Files, type File as File, type FileCreate as FileCreate, type PresignedURL as PresignedURL, type FileCreateResponse as FileCreateResponse, type FileQueryResponse as FileQueryResponse, type FileCreateParams as FileCreateParams, type FileDeleteParams as FileDeleteParams, type FileGetParams as FileGetParams, type FileQueryParams as FileQueryParams, };
    export { Pipelines as Pipelines, type AdvancedModeTransformConfig as AdvancedModeTransformConfig, type AutoTransformConfig as AutoTransformConfig, type AzureOpenAIEmbedding as AzureOpenAIEmbedding, type AzureOpenAIEmbeddingConfig as AzureOpenAIEmbeddingConfig, type BedrockEmbedding as BedrockEmbedding, type BedrockEmbeddingConfig as BedrockEmbeddingConfig, type CohereEmbedding as CohereEmbedding, type CohereEmbeddingConfig as CohereEmbeddingConfig, type DataSinkCreate as DataSinkCreate, type GeminiEmbedding as GeminiEmbedding, type GeminiEmbeddingConfig as GeminiEmbeddingConfig, type HuggingFaceInferenceAPIEmbedding as HuggingFaceInferenceAPIEmbedding, type HuggingFaceInferenceAPIEmbeddingConfig as HuggingFaceInferenceAPIEmbeddingConfig, type LlamaParseParameters as LlamaParseParameters, type LlmParameters as LlmParameters, type ManagedIngestionStatusResponse as ManagedIngestionStatusResponse, type MessageRole as MessageRole, type MetadataFilters as MetadataFilters, type OpenAIEmbedding as OpenAIEmbedding, type OpenAIEmbeddingConfig as OpenAIEmbeddingConfig, type PageFigureNodeWithScore as PageFigureNodeWithScore, type PageScreenshotNodeWithScore as PageScreenshotNodeWithScore, type Pipeline as Pipeline, type PipelineCreate as PipelineCreate, type PipelineMetadataConfig as PipelineMetadataConfig, type PipelineType as PipelineType, type PresetRetrievalParams as PresetRetrievalParams, type RetrievalMode as RetrievalMode, type SparseModelConfig as SparseModelConfig, type VertexAIEmbeddingConfig as VertexAIEmbeddingConfig, type VertexTextEmbedding as VertexTextEmbedding, type PipelineRetrieveResponse as PipelineRetrieveResponse, type PipelineListResponse as PipelineListResponse, type PipelineCreateParams as PipelineCreateParams, type PipelineRetrieveParams as PipelineRetrieveParams, type PipelineUpdateParams as PipelineUpdateParams, type PipelineListParams as PipelineListParams, type PipelineGetStatusParams as PipelineGetStatusParams, type PipelineUpsertParams as PipelineUpsertParams, };
    export { Retrievers as Retrievers, type CompositeRetrievalMode as CompositeRetrievalMode, type CompositeRetrievalResult as CompositeRetrievalResult, type ReRankConfig as ReRankConfig, type Retriever as Retriever, type RetrieverCreate as RetrieverCreate, type RetrieverPipeline as RetrieverPipeline, type RetrieverListResponse as RetrieverListResponse, type RetrieverCreateParams as RetrieverCreateParams, type RetrieverUpdateParams as RetrieverUpdateParams, type RetrieverListParams as RetrieverListParams, type RetrieverGetParams as RetrieverGetParams, type RetrieverSearchParams as RetrieverSearchParams, type RetrieverUpsertParams as RetrieverUpsertParams, };
    export { Parsing as Parsing, type BBox as BBox, type FailPageMode as FailPageMode, type ListItem as ListItem, type LlamaParseSupportedFileExtensions as LlamaParseSupportedFileExtensions, type ParsingJob as ParsingJob, type ParsingLanguages as ParsingLanguages, type ParsingMode as ParsingMode, type StatusEnum as StatusEnum, type ParsingCreateResponse as ParsingCreateResponse, type ParsingListResponse as ParsingListResponse, type ParsingGetResponse as ParsingGetResponse, type ParsingListResponsesPaginatedClassifyJobs as ParsingListResponsesPaginatedClassifyJobs, type ParsingCreateParams as ParsingCreateParams, type ParsingListParams as ParsingListParams, type ParsingGetParams as ParsingGetParams, };
    export { Classifier as Classifier };
    export { Extraction as Extraction, type ExtractionRunParams as ExtractionRunParams };
    export { Beta as Beta };
    export type CloudAstraDBVectorStore = API.CloudAstraDBVectorStore;
    export type CloudAzStorageBlobDataSource = API.CloudAzStorageBlobDataSource;
    export type CloudAzureAISearchVectorStore = API.CloudAzureAISearchVectorStore;
    export type CloudBoxDataSource = API.CloudBoxDataSource;
    export type CloudConfluenceDataSource = API.CloudConfluenceDataSource;
    export type CloudJiraDataSource = API.CloudJiraDataSource;
    export type CloudJiraDataSourceV2 = API.CloudJiraDataSourceV2;
    export type CloudMilvusVectorStore = API.CloudMilvusVectorStore;
    export type CloudMongoDBAtlasVectorSearch = API.CloudMongoDBAtlasVectorSearch;
    export type CloudNotionPageDataSource = API.CloudNotionPageDataSource;
    export type CloudOneDriveDataSource = API.CloudOneDriveDataSource;
    export type CloudPineconeVectorStore = API.CloudPineconeVectorStore;
    export type CloudPostgresVectorStore = API.CloudPostgresVectorStore;
    export type CloudQdrantVectorStore = API.CloudQdrantVectorStore;
    export type CloudS3DataSource = API.CloudS3DataSource;
    export type CloudSharepointDataSource = API.CloudSharepointDataSource;
    export type CloudSlackDataSource = API.CloudSlackDataSource;
    export type FailureHandlingConfig = API.FailureHandlingConfig;
    export type PgVectorHnswSettings = API.PgVectorHnswSettings;
}
//# sourceMappingURL=client.d.mts.map