import { APIResource } from "../../core/resource.mjs";
import * as ParsingAPI from "../parsing.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { PagePromise, PaginatedClassifyJobs, type PaginatedClassifyJobsParams } from "../../core/pagination.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
import { PollingOptions } from "../../core/polling.mjs";
export declare class Jobs extends APIResource {
    /**
     * Create a classify job. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    create(params: JobCreateParams, options?: RequestOptions): APIPromise<ClassifyJob>;
    /**
     * List classify jobs. Experimental: This endpoint is not yet ready for production
     * use and is subject to change at any time.
     */
    list(query?: JobListParams | null | undefined, options?: RequestOptions): PagePromise<ClassifyJobsPaginatedClassifyJobs, ClassifyJob>;
    /**
     * Get a classify job. Experimental: This endpoint is not yet ready for production
     * use and is subject to change at any time.
     */
    get(classifyJobID: string, query?: JobGetParams | null | undefined, options?: RequestOptions): APIPromise<ClassifyJob>;
    /**
     * Get the results of a classify job. Experimental: This endpoint is not yet ready
     * for production use and is subject to change at any time.
     */
    getResults(classifyJobID: string, query?: JobGetResultsParams | null | undefined, options?: RequestOptions): APIPromise<JobGetResultsResponse>;
    /**
     * Wait for a classify job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * @param classifyJobID - The ID of the classify job to wait for
     * @param query - Query parameters for the get request
     * @param options - Polling configuration options
     * @returns The completed ClassifyJob
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create a classify job
     * const job = await client.classifier.jobs.create({
     *   file_ids: ['file1', 'file2'],
     *   rules: [...]
     * });
     *
     * // Wait for it to complete
     * const completedJob = await client.classifier.jobs.waitForCompletion(
     *   job.id,
     *   {},
     *   { verbose: true }
     * );
     *
     * // Get the results
     * const results = await client.classifier.jobs.getResults(job.id);
     * ```
     */
    waitForCompletion(classifyJobID: string, query?: JobGetParams | null | undefined, options?: PollingOptions & RequestOptions): Promise<ClassifyJob>;
}
export type ClassifyJobsPaginatedClassifyJobs = PaginatedClassifyJobs<ClassifyJob>;
/**
 * A rule for classifying documents - v0 simplified version.
 *
 * This represents a single classification rule that will be applied to documents.
 * All rules are content-based and use natural language descriptions.
 */
export interface ClassifierRule {
    /**
     * Natural language description of what to classify. Be specific about the content
     * characteristics that identify this document type.
     */
    description: string;
    /**
     * The document type to assign when this rule matches (e.g., 'invoice', 'receipt',
     * 'contract')
     */
    type: string;
}
/**
 * A classify job.
 */
export interface ClassifyJob {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * The ID of the project
     */
    project_id: string;
    /**
     * The rules to classify the files
     */
    rules: Array<ClassifierRule>;
    /**
     * The status of the classify job
     */
    status: ParsingAPI.StatusEnum;
    /**
     * The ID of the user
     */
    user_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    effective_at?: string;
    /**
     * Error message for the latest job attempt, if any.
     */
    error_message?: string | null;
    /**
     * The job record ID associated with this status, if any.
     */
    job_record_id?: string | null;
    /**
     * The classification mode to use
     */
    mode?: 'FAST' | 'MULTIMODAL';
    /**
     * The configuration for the parsing job
     */
    parsing_configuration?: ClassifyParsingConfiguration;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * Parsing configuration for a classify job.
 */
export interface ClassifyParsingConfiguration {
    /**
     * The language to parse the files in
     */
    lang?: ParsingAPI.ParsingLanguages;
    /**
     * The maximum number of pages to parse
     */
    max_pages?: number | null;
    /**
     * The pages to target for parsing (0-indexed, so first page is at 0)
     */
    target_pages?: Array<number> | null;
}
/**
 * Response model for the classify endpoint following AIP-132 pagination standard.
 */
export interface JobGetResultsResponse {
    /**
     * The list of items.
     */
    items: Array<JobGetResultsResponse.Item>;
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this
     * field is omitted, there are no subsequent pages.
     */
    next_page_token?: string | null;
    /**
     * The total number of items available. This is only populated when specifically
     * requested. The value may be an estimate and can be used for display purposes
     * only.
     */
    total_size?: number | null;
}
export declare namespace JobGetResultsResponse {
    /**
     * A file classification.
     */
    interface Item {
        /**
         * Unique identifier
         */
        id: string;
        /**
         * The ID of the classify job
         */
        classify_job_id: string;
        /**
         * Creation datetime
         */
        created_at?: string | null;
        /**
         * The ID of the classified file
         */
        file_id?: string | null;
        /**
         * Result of classifying a single file.
         */
        result?: Item.Result | null;
        /**
         * Update datetime
         */
        updated_at?: string | null;
    }
    namespace Item {
        /**
         * Result of classifying a single file.
         */
        interface Result {
            /**
             * Confidence score of the classification (0.0-1.0)
             */
            confidence: number;
            /**
             * Step-by-step explanation of why this classification was chosen and the
             * confidence score assigned
             */
            reasoning: string;
            /**
             * The document type that best matches, or null if no match.
             */
            type: string | null;
        }
    }
}
export interface JobCreateParams {
    /**
     * Body param: The IDs of the files to classify
     */
    file_ids: Array<string>;
    /**
     * Body param: The rules to classify the files
     */
    rules: Array<ClassifierRule>;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The classification mode to use
     */
    mode?: 'FAST' | 'MULTIMODAL';
    /**
     * Body param: The configuration for the parsing job
     */
    parsing_configuration?: ClassifyParsingConfiguration;
}
export interface JobListParams extends PaginatedClassifyJobsParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface JobGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface JobGetResultsParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Jobs {
    export { type ClassifierRule as ClassifierRule, type ClassifyJob as ClassifyJob, type ClassifyParsingConfiguration as ClassifyParsingConfiguration, type JobGetResultsResponse as JobGetResultsResponse, type ClassifyJobsPaginatedClassifyJobs as ClassifyJobsPaginatedClassifyJobs, type JobCreateParams as JobCreateParams, type JobListParams as JobListParams, type JobGetParams as JobGetParams, type JobGetResultsParams as JobGetResultsParams, };
}
//# sourceMappingURL=jobs.d.mts.map