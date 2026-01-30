import { FinalRequestOptions } from "../internal/request-options.js";
import { type LlamaCloud } from "../client.js";
import { APIPromise } from "./api-promise.js";
import { type APIResponseProps } from "../internal/parse.js";
export type PageRequestOptions = Pick<FinalRequestOptions, 'query' | 'headers' | 'body' | 'path' | 'method'>;
export declare abstract class AbstractPage<Item> implements AsyncIterable<Item> {
    #private;
    protected options: FinalRequestOptions;
    protected response: Response;
    protected body: unknown;
    constructor(client: LlamaCloud, response: Response, body: unknown, options: FinalRequestOptions);
    abstract nextPageRequestOptions(): PageRequestOptions | null;
    abstract getPaginatedItems(): Item[];
    hasNextPage(): boolean;
    getNextPage(): Promise<this>;
    iterPages(): AsyncGenerator<this>;
    [Symbol.asyncIterator](): AsyncGenerator<Item>;
}
/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export declare class PagePromise<PageClass extends AbstractPage<Item>, Item = ReturnType<PageClass['getPaginatedItems']>[number]> extends APIPromise<PageClass> implements AsyncIterable<Item> {
    constructor(client: LlamaCloud, request: Promise<APIResponseProps>, Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass);
    /**
     * Allow auto-paginating iteration on an unawaited list call, eg:
     *
     *    for await (const item of client.items.list()) {
     *      console.log(item)
     *    }
     */
    [Symbol.asyncIterator](): AsyncGenerator<Item>;
}
export interface PaginatedJobsHistoryResponse<Item> {
    jobs: Array<Item>;
    total_count: number;
    offset: number;
}
export interface PaginatedJobsHistoryParams {
    /**
     * Number of items to skip
     */
    offset?: number;
    /**
     * Maximum number of items to return
     */
    limit?: number;
}
export declare class PaginatedJobsHistory<Item> extends AbstractPage<Item> implements PaginatedJobsHistoryResponse<Item> {
    jobs: Array<Item>;
    total_count: number;
    offset: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedJobsHistoryResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedPipelineFilesResponse<Item> {
    files: Array<Item>;
    total_count: number;
    offset: number;
}
export interface PaginatedPipelineFilesParams {
    /**
     * Number of items to skip
     */
    offset?: number;
    /**
     * Maximum number of items to return
     */
    limit?: number;
}
export declare class PaginatedPipelineFiles<Item> extends AbstractPage<Item> implements PaginatedPipelineFilesResponse<Item> {
    files: Array<Item>;
    total_count: number;
    offset: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedPipelineFilesResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedBatchItemsResponse<Item> {
    items: Array<Item>;
    total_size: number;
}
export interface PaginatedBatchItemsParams {
    /**
     * Number of items to skip
     */
    offset?: number;
    /**
     * Maximum number of items to return
     */
    limit?: number;
}
export declare class PaginatedBatchItems<Item> extends AbstractPage<Item> implements PaginatedBatchItemsResponse<Item> {
    items: Array<Item>;
    total_size: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedBatchItemsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedExtractRunsResponse<Item> {
    items: Array<Item>;
    total: number;
    skip: number;
}
export interface PaginatedExtractRunsParams {
    /**
     * Number of extraction runs to skip
     */
    skip?: number;
    /**
     * Maximum number of extraction runs to return
     */
    limit?: number;
}
export declare class PaginatedExtractRuns<Item> extends AbstractPage<Item> implements PaginatedExtractRunsResponse<Item> {
    items: Array<Item>;
    total: number;
    skip: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedExtractRunsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedCloudDocumentsResponse<Item> {
    documents: Array<Item>;
    total_count: number;
    offset: number;
}
export interface PaginatedCloudDocumentsParams {
    /**
     * Number of documents to skip
     */
    skip?: number;
    /**
     * Maximum number of documents to return
     */
    limit?: number;
}
export declare class PaginatedCloudDocuments<Item> extends AbstractPage<Item> implements PaginatedCloudDocumentsResponse<Item> {
    documents: Array<Item>;
    total_count: number;
    offset: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedCloudDocumentsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedQuotaConfigurationsResponse<Item> {
    items: Array<Item>;
    page: number;
    pages: number;
}
export interface PaginatedQuotaConfigurationsParams {
    /**
     * Page number to retrieve
     */
    page?: number;
    /**
     * Number of items per page
     */
    page_size?: number;
}
export declare class PaginatedQuotaConfigurations<Item> extends AbstractPage<Item> implements PaginatedQuotaConfigurationsResponse<Item> {
    items: Array<Item>;
    page: number;
    pages: number;
    constructor(client: LlamaCloud, response: Response, body: PaginatedQuotaConfigurationsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedClassifyJobsResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
}
export interface PaginatedClassifyJobsParams {
    /**
     * Token for retrieving next page
     */
    page_token?: string;
    /**
     * Maximum number of items to return
     */
    page_size?: number;
}
export declare class PaginatedClassifyJobs<Item> extends AbstractPage<Item> implements PaginatedClassifyJobsResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
    constructor(client: LlamaCloud, response: Response, body: PaginatedClassifyJobsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedSpreadsheetJobsResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
}
export interface PaginatedSpreadsheetJobsParams {
    /**
     * Token for retrieving next page
     */
    page_token?: string;
    /**
     * Maximum number of items to return
     */
    page_size?: number;
}
export declare class PaginatedSpreadsheetJobs<Item> extends AbstractPage<Item> implements PaginatedSpreadsheetJobsResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
    constructor(client: LlamaCloud, response: Response, body: PaginatedSpreadsheetJobsResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedAgentDataSearchResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
}
export interface PaginatedAgentDataSearchParams {
    /**
     * Token for retrieving next page
     */
    page_token?: string;
    /**
     * Maximum number of items to return
     */
    page_size?: number;
}
export declare class PaginatedAgentDataSearch<Item> extends AbstractPage<Item> implements PaginatedAgentDataSearchResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
    constructor(client: LlamaCloud, response: Response, body: PaginatedAgentDataSearchResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
export interface PaginatedAgentDataAggregateResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
}
export interface PaginatedAgentDataAggregateParams {
    /**
     * Token for retrieving next page
     */
    page_token?: string;
    /**
     * Maximum number of items to return
     */
    page_size?: number;
}
export declare class PaginatedAgentDataAggregate<Item> extends AbstractPage<Item> implements PaginatedAgentDataAggregateResponse<Item> {
    items: Array<Item>;
    next_page_token: string;
    constructor(client: LlamaCloud, response: Response, body: PaginatedAgentDataAggregateResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    nextPageRequestOptions(): PageRequestOptions | null;
}
//# sourceMappingURL=pagination.d.ts.map