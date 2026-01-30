"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jobs = void 0;
const resource_1 = require("../../core/resource.js");
const uploads_1 = require("../../internal/uploads.js");
const path_1 = require("../../internal/utils/path.js");
const polling_1 = require("../../core/polling.js");
class Jobs extends resource_1.APIResource {
    /**
     * Run Job
     */
    create(params, options) {
        const { from_ui, ...body } = params;
        return this._client.post('/api/v1/extraction/jobs', { query: { from_ui }, body, ...options });
    }
    /**
     * List Jobs
     */
    list(query, options) {
        return this._client.get('/api/v1/extraction/jobs', { query, ...options });
    }
    /**
     * Run Job On File
     */
    file(params, options) {
        const { from_ui, ...body } = params;
        return this._client.post('/api/v1/extraction/jobs/file', (0, uploads_1.multipartFormRequestOptions)({ query: { from_ui }, body, ...options }, this._client));
    }
    /**
     * Get Job
     */
    get(jobID, options) {
        return this._client.get((0, path_1.path) `/api/v1/extraction/jobs/${jobID}`, options);
    }
    /**
     * Get Job Result
     */
    getResult(jobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/extraction/jobs/${jobID}/result`, { query, ...options });
    }
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
    async waitForCompletion(jobID, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        const getStatus = async () => {
            return await this.get(jobID, requestOptions);
        };
        const isComplete = (job) => {
            return job.status === 'SUCCESS' || job.status === 'PARTIAL_SUCCESS';
        };
        const isError = (job) => {
            return job.status === 'ERROR' || job.status === 'CANCELLED';
        };
        const getErrorMessage = (job) => {
            const errorParts = [`Job ${jobID} failed with status: ${job.status}`];
            if (job.error) {
                errorParts.push(`Error: ${job.error}`);
            }
            return errorParts.join(' | ');
        };
        return await (0, polling_1.pollUntilComplete)(getStatus, isComplete, isError, getErrorMessage, {
            pollingInterval,
            maxInterval,
            timeout,
            backoff,
            verbose,
        });
    }
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
    async createAndWait(params, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        // Create the job
        const job = await this.create(params, requestOptions);
        // Wait for completion
        await this.waitForCompletion(job.id, {
            pollingInterval,
            maxInterval,
            timeout: timeout || 2000.0,
            backoff,
            verbose,
            ...requestOptions,
        });
        // Get and return the result
        return await this.getResult(job.id, {}, requestOptions);
    }
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
    async extract(params, options) {
        return await this.createAndWait(params, options);
    }
}
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.js.map