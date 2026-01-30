import { APIResource } from "../../core/resource.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { PagePromise, PaginatedClassifyJobs, type PaginatedClassifyJobsParams } from "../../core/pagination.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
import { PollingOptions } from "../../core/polling.mjs";
export declare class Split extends APIResource {
    /**
     * Create a document split job. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    create(params: SplitCreateParams, options?: RequestOptions): APIPromise<SplitCreateResponse>;
    /**
     * List document split jobs. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    list(query?: SplitListParams | null | undefined, options?: RequestOptions): PagePromise<SplitListResponsesPaginatedClassifyJobs, SplitListResponse>;
    /**
     * Get a document split job.
     *
     * Experimental: This endpoint is not yet ready for production use and is subject
     * to change at any time.
     */
    get(splitJobID: string, query?: SplitGetParams | null | undefined, options?: RequestOptions): APIPromise<SplitGetResponse>;
    /**
     * Wait for a document split job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * Experimental: This endpoint is not yet ready for production use and is subject
     * to change at any time.
     *
     * @param splitJobID - The ID of the split job to wait for
     * @param params - Query parameters and polling configuration
     * @param options - Additional request options
     * @returns The completed SplitGetResponse with result populated
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails
     *
     * @example
     * ```typescript
     * import LlamaCloud from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create a split job
     * const job = await client.beta.split.create({
     *   categories: [
     *     { name: 'essay', description: 'Essay documents' },
     *     { name: 'research_paper', description: 'Research paper documents' }
     *   ],
     *   document_input: { type: 'file_id', value: 'file_id' }
     * });
     *
     * // Wait for it to complete
     * const completedJob = await client.beta.split.waitForCompletion(
     *   job.id,
     *   { verbose: true }
     * );
     *
     * // Access the results
     * console.log(completedJob.result?.segments);
     * ```
     */
    waitForCompletion(splitJobID: string, params?: SplitWaitForCompletionParams | null | undefined, options?: RequestOptions): Promise<SplitGetResponse>;
    /**
     * Create a document split job and wait for it to complete, returning the result.
     *
     * This is a convenience method that combines create() and waitForCompletion()
     * into a single call for the most common end-to-end workflow.
     *
     * Experimental: This endpoint is not yet ready for production use and is subject
     * to change at any time.
     *
     * @param params - Split job creation parameters including categories and document input
     * @param options - Request options
     * @returns The completed SplitGetResponse with result containing segments
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails
     *
     * @example
     * ```typescript
     * import LlamaCloud from 'llama-cloud';
     * import fs from 'fs';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Upload a file first
     * const fileObj = await client.files.upload({
     *   upload_file: fs.createReadStream('combined_document.pdf')
     * });
     *
     * // One-shot: create split job, wait for completion, and get result
     * const result = await client.beta.split.split({
     *   categories: [
     *     { name: 'essay', description: 'A philosophical or reflective piece of writing' },
     *     { name: 'research_paper', description: 'A formal academic paper with citations' }
     *   ],
     *   document_input: { type: 'file_id', value: fileObj.id },
     *   verbose: true
     * });
     *
     * // Access the segments
     * for (const segment of result.result?.segments || []) {
     *   console.log(`Category: ${segment.category}, Pages: ${segment.pages}`);
     * }
     * ```
     */
    split(params: SplitSplitParams, options?: RequestOptions): Promise<SplitGetResponse>;
}
export type SplitListResponsesPaginatedClassifyJobs = PaginatedClassifyJobs<SplitListResponse>;
/**
 * Category definition for document splitting.
 */
export interface SplitCategory {
    /**
     * Name of the category.
     */
    name: string;
    /**
     * Optional description of what content belongs in this category.
     */
    description?: string | null;
}
/**
 * Document input specification.
 */
export interface SplitDocumentInput {
    /**
     * Type of document input. Valid values are: file_id
     */
    type: string;
    /**
     * Document identifier.
     */
    value: string;
}
/**
 * Result of a completed split job.
 */
export interface SplitResultResponse {
    /**
     * List of document segments.
     */
    segments: Array<SplitSegmentResponse>;
}
/**
 * A segment of the split document.
 */
export interface SplitSegmentResponse {
    /**
     * Category name this split belongs to.
     */
    category: string;
    /**
     * Categorical confidence level. Valid values are: high, medium, low.
     */
    confidence_category: string;
    /**
     * 1-indexed page numbers in this split.
     */
    pages: Array<number>;
}
/**
 * A document split job.
 */
export interface SplitCreateResponse {
    /**
     * Unique identifier for the split job.
     */
    id: string;
    /**
     * Categories used for splitting.
     */
    categories: Array<SplitCategory>;
    /**
     * Document that was split.
     */
    document_input: SplitDocumentInput;
    /**
     * Project ID this job belongs to.
     */
    project_id: string;
    /**
     * Current status of the job. Valid values are: pending, processing, completed,
     * failed.
     */
    status: string;
    /**
     * User ID who created this job.
     */
    user_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Error message if the job failed.
     */
    error_message?: string | null;
    /**
     * Result of a completed split job.
     */
    result?: SplitResultResponse | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * A document split job.
 */
export interface SplitListResponse {
    /**
     * Unique identifier for the split job.
     */
    id: string;
    /**
     * Categories used for splitting.
     */
    categories: Array<SplitCategory>;
    /**
     * Document that was split.
     */
    document_input: SplitDocumentInput;
    /**
     * Project ID this job belongs to.
     */
    project_id: string;
    /**
     * Current status of the job. Valid values are: pending, processing, completed,
     * failed.
     */
    status: string;
    /**
     * User ID who created this job.
     */
    user_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Error message if the job failed.
     */
    error_message?: string | null;
    /**
     * Result of a completed split job.
     */
    result?: SplitResultResponse | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * A document split job.
 */
export interface SplitGetResponse {
    /**
     * Unique identifier for the split job.
     */
    id: string;
    /**
     * Categories used for splitting.
     */
    categories: Array<SplitCategory>;
    /**
     * Document that was split.
     */
    document_input: SplitDocumentInput;
    /**
     * Project ID this job belongs to.
     */
    project_id: string;
    /**
     * Current status of the job. Valid values are: pending, processing, completed,
     * failed.
     */
    status: string;
    /**
     * User ID who created this job.
     */
    user_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Error message if the job failed.
     */
    error_message?: string | null;
    /**
     * Result of a completed split job.
     */
    result?: SplitResultResponse | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export interface SplitCreateParams {
    /**
     * Body param: Categories to split the document into.
     */
    categories: Array<SplitCategory>;
    /**
     * Body param: Document to be split.
     */
    document_input: SplitDocumentInput;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Strategy for splitting the document.
     */
    splitting_strategy?: SplitCreateParams.SplittingStrategy;
}
export declare namespace SplitCreateParams {
    /**
     * Strategy for splitting the document.
     */
    interface SplittingStrategy {
        /**
         * Whether to allow pages that don't match any category to be grouped as
         * 'uncategorized'. If False, all pages must be assigned to a defined category.
         */
        allow_uncategorized?: boolean;
    }
}
export interface SplitListParams extends PaginatedClassifyJobsParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface SplitGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface SplitSplitParams extends SplitCreateParams, PollingOptions {
}
export interface SplitWaitForCompletionParams extends PollingOptions {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Split {
    export { type SplitCategory as SplitCategory, type SplitDocumentInput as SplitDocumentInput, type SplitResultResponse as SplitResultResponse, type SplitSegmentResponse as SplitSegmentResponse, type SplitCreateResponse as SplitCreateResponse, type SplitListResponse as SplitListResponse, type SplitGetResponse as SplitGetResponse, type SplitListResponsesPaginatedClassifyJobs as SplitListResponsesPaginatedClassifyJobs, type SplitCreateParams as SplitCreateParams, type SplitListParams as SplitListParams, type SplitGetParams as SplitGetParams, type SplitSplitParams as SplitSplitParams, type SplitWaitForCompletionParams as SplitWaitForCompletionParams, };
}
//# sourceMappingURL=split.d.mts.map