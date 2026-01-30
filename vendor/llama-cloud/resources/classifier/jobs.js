"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jobs = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const path_1 = require("../../internal/utils/path.js");
const polling_1 = require("../../core/polling.js");
class Jobs extends resource_1.APIResource {
    /**
     * Create a classify job. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/classifier/jobs', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List classify jobs. Experimental: This endpoint is not yet ready for production
     * use and is subject to change at any time.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/classifier/jobs', (pagination_1.PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Get a classify job. Experimental: This endpoint is not yet ready for production
     * use and is subject to change at any time.
     */
    get(classifyJobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/classifier/jobs/${classifyJobID}`, { query, ...options });
    }
    /**
     * Get the results of a classify job. Experimental: This endpoint is not yet ready
     * for production use and is subject to change at any time.
     */
    getResults(classifyJobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/classifier/jobs/${classifyJobID}/results`, { query, ...options });
    }
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
    async waitForCompletion(classifyJobID, query = {}, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        const getStatus = async () => {
            return await this.get(classifyJobID, query, requestOptions);
        };
        const isComplete = (job) => {
            return job.status === 'SUCCESS' || job.status === 'PARTIAL_SUCCESS';
        };
        const isError = (job) => {
            return job.status === 'ERROR' || job.status === 'CANCELLED';
        };
        const getErrorMessage = (job) => {
            const errorParts = [`Job ${classifyJobID} failed with status: ${job.status}`];
            if (job.error_message) {
                errorParts.push(`Error: ${job.error_message}`);
            }
            return errorParts.join(' | ');
        };
        return await (0, polling_1.pollUntilComplete)(getStatus, isComplete, isError, getErrorMessage, {
            pollingInterval,
            maxInterval,
            timeout: timeout || 300.0, // Default to 300 seconds for classifier
            backoff,
            verbose,
        });
    }
}
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.js.map