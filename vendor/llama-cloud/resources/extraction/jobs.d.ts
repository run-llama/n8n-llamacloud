import { APIResource } from "../../core/resource.js";
import * as FilesAPI from "../files.js";
import * as RunsAPI from "./runs.js";
import * as ExtractionAgentsAPI from "./extraction-agents/extraction-agents.js";
import { APIPromise } from "../../core/api-promise.js";
import { type Uploadable } from "../../core/uploads.js";
import { RequestOptions } from "../../internal/request-options.js";
import { PollingOptions } from "../../core/polling.js";
export declare class Jobs extends APIResource {
    /**
     * Run Job
     */
    create(params: JobCreateParams, options?: RequestOptions): APIPromise<ExtractJob>;
    /**
     * List Jobs
     */
    list(query: JobListParams, options?: RequestOptions): APIPromise<JobListResponse>;
    /**
     * Run Job On File
     */
    file(params: JobFileParams, options?: RequestOptions): APIPromise<ExtractJob>;
    /**
     * Get Job
     */
    get(jobID: string, options?: RequestOptions): APIPromise<ExtractJob>;
    /**
     * Get Job Result
     */
    getResult(jobID: string, query?: JobGetResultParams | null | undefined, options?: RequestOptions): APIPromise<JobGetResultResponse>;
    /**
     * Wait for an extraction job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * @param jobID - The ID of the extraction job to wait for
     * @param options - Polling configuration options
     * @returns The completed ExtractJob
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create an extraction job
     * const job = await client.extraction.jobs.create({
     *   extraction_agent_id: 'agent_id',
     *   file_id: 'file_id'
     * });
     *
     * // Wait for it to complete
     * const completedJob = await client.extraction.jobs.waitForCompletion(
     *   job.id,
     *   { verbose: true }
     * );
     *
     * // Get the result
     * const result = await client.extraction.jobs.getResult(job.id);
     * ```
     */
    waitForCompletion(jobID: string, options?: PollingOptions & RequestOptions): Promise<ExtractJob>;
    /**
     * Create an extraction job and wait for it to complete, returning the result.
     *
     * This is a convenience method that combines create(), waitForCompletion(),
     * and getResult() into a single call for the most common end-to-end workflow.
     *
     * @param params - Job creation parameters
     * @param options - Polling configuration and request options
     * @returns The extraction result (JobGetResultResponse)
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // One-shot: create job, wait for completion, and get result
     * const result = await client.extraction.jobs.createAndWait({
     *   extraction_agent_id: 'agent_id',
     *   file_id: 'file_id'
     * }, { verbose: true });
     *
     * // Result is ready to use immediately
     * console.log(result.data);
     * ```
     */
    createAndWait(params: JobCreateParams, options?: PollingOptions & RequestOptions): Promise<JobGetResultResponse>;
    /**
     * Create an extraction job and wait for it to complete, returning the result.
     *
     * This is an alias for createAndWait() that provides a more concise API.
     *
     * @param params - Job creation parameters
     * @param options - Polling configuration and request options
     * @returns The extraction result (JobGetResultResponse)
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // One-shot: create job, wait for completion, and get result
     * const result = await client.extraction.jobs.extract({
     *   extraction_agent_id: 'agent_id',
     *   file_id: 'file_id'
     * }, { verbose: true });
     *
     * // Result is ready to use immediately
     * console.log(result.data);
     * ```
     */
    extract(params: JobCreateParams, options?: PollingOptions & RequestOptions): Promise<JobGetResultResponse>;
}
/**
 * Schema for an extraction job.
 */
export interface ExtractJob {
    /**
     * The id of the extraction job
     */
    id: string;
    /**
     * The agent that the job was run on.
     */
    extraction_agent: ExtractionAgentsAPI.ExtractAgent;
    /**
     * The status of the extraction job
     */
    status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED';
    /**
     * The error that occurred during extraction
     */
    error?: string | null;
    /**
     * @deprecated Schema for a file.
     */
    file?: FilesAPI.File | null;
    /**
     * The id of the file that the extract was extracted from
     */
    file_id?: string | null;
}
/**
 * Allows the user to configure webhook options for notifications and callbacks.
 */
export interface WebhookConfiguration {
    /**
     * List of event names to subscribe to
     */
    webhook_events?: Array<'extract.pending' | 'extract.success' | 'extract.error' | 'extract.partial_success' | 'extract.cancelled' | 'parse.pending' | 'parse.success' | 'parse.error' | 'parse.partial_success' | 'parse.cancelled' | 'unmapped_event'> | null;
    /**
     * Custom HTTP headers to include with webhook requests.
     */
    webhook_headers?: {
        [key: string]: string;
    } | null;
    /**
     * The output format to use for the webhook. Defaults to string if none supplied.
     * Currently supported values: string, json
     */
    webhook_output_format?: string | null;
    /**
     * The URL to send webhook notifications to.
     */
    webhook_url?: string | null;
}
export type JobListResponse = Array<ExtractJob>;
/**
 * Schema for an extraction resultset.
 */
export interface JobGetResultResponse {
    /**
     * The data extracted from the file
     */
    data: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | Array<{
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    }> | null;
    /**
     * The id of the extraction agent
     */
    extraction_agent_id: string;
    /**
     * The metadata extracted from the file
     */
    extraction_metadata: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    };
    /**
     * The id of the extraction run
     */
    run_id: string;
}
export interface JobCreateParams {
    /**
     * Body param: The id of the extraction agent
     */
    extraction_agent_id: string;
    /**
     * Body param: The id of the file
     */
    file_id: string;
    /**
     * Query param
     */
    from_ui?: boolean;
    /**
     * Body param: Configuration parameters for the extraction agent.
     */
    config_override?: RunsAPI.ExtractConfig | null;
    /**
     * Body param: The data schema to override the extraction agent's data schema with
     */
    data_schema_override?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | string | null;
    /**
     * Body param: The priority for the request. This field may be ignored or
     * overwritten depending on the organization tier.
     */
    priority?: 'low' | 'medium' | 'high' | 'critical' | null;
    /**
     * Body param: The outbound webhook configurations
     */
    webhook_configurations?: Array<WebhookConfiguration> | null;
}
export interface JobListParams {
    extraction_agent_id: string;
}
export interface JobFileParams {
    /**
     * Body param: The id of the extraction agent
     */
    extraction_agent_id: string;
    /**
     * Body param: The file to run the job on
     */
    file: Uploadable;
    /**
     * Query param
     */
    from_ui?: boolean;
    /**
     * Body param: The config to override the extraction agent's config with as a JSON
     * string
     */
    config_override?: string | null;
    /**
     * Body param: The data schema to override the extraction agent's data schema with
     * as a JSON string
     */
    data_schema_override?: string | null;
}
export interface JobGetResultParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Jobs {
    export { type ExtractJob as ExtractJob, type WebhookConfiguration as WebhookConfiguration, type JobListResponse as JobListResponse, type JobGetResultResponse as JobGetResultResponse, type JobCreateParams as JobCreateParams, type JobListParams as JobListParams, type JobFileParams as JobFileParams, type JobGetResultParams as JobGetResultParams, };
}
//# sourceMappingURL=jobs.d.ts.map