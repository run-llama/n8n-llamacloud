"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Split = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const path_1 = require("../../internal/utils/path.js");
const polling_1 = require("../../core/polling.js");
class Split extends resource_1.APIResource {
    /**
     * Create a document split job. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/split/jobs', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List document split jobs. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/beta/split/jobs', (pagination_1.PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Get a document split job.
     *
     * Experimental: This endpoint is not yet ready for production use and is subject
     * to change at any time.
     */
    get(splitJobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/split/jobs/${splitJobID}`, { query, ...options });
    }
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
    async waitForCompletion(splitJobID, params = {}, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...queryParams } = params ?? {};
        const pollingOptions = {
            pollingInterval: pollingInterval ?? 1.0,
            maxInterval: maxInterval ?? 5.0,
            timeout: timeout ?? 2000.0,
            backoff: backoff ?? 'linear',
            verbose: verbose ?? false,
        };
        return (0, polling_1.pollUntilComplete)(async () => {
            return this.get(splitJobID, queryParams, options);
        }, (job) => job.status === 'completed', (job) => job.status === 'failed', (job) => {
            const errorParts = [`Split job ${splitJobID} failed with status: ${job.status}`];
            if (job.error_message) {
                errorParts.push(`Error: ${job.error_message}`);
            }
            return errorParts.join(' | ');
        }, pollingOptions);
    }
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
    async split(params, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...createParams } = params;
        // Create the split job
        const job = await this.create(createParams, options);
        // Wait for completion
        const pollingOptions = {};
        if (pollingInterval !== undefined)
            pollingOptions.pollingInterval = pollingInterval;
        if (maxInterval !== undefined)
            pollingOptions.maxInterval = maxInterval;
        if (timeout !== undefined)
            pollingOptions.timeout = timeout;
        if (backoff !== undefined)
            pollingOptions.backoff = backoff;
        if (verbose !== undefined)
            pollingOptions.verbose = verbose;
        // Only pass query params that are valid for waitForCompletion
        const waitParams = {
            ...pollingOptions,
        };
        if (createParams.organization_id !== undefined)
            waitParams.organization_id = createParams.organization_id;
        if (createParams.project_id !== undefined)
            waitParams.project_id = createParams.project_id;
        return this.waitForCompletion(job.id, waitParams, options);
    }
}
exports.Split = Split;
//# sourceMappingURL=split.js.map