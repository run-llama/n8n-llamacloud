// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { PaginatedClassifyJobs } from "../../core/pagination.mjs";
import { path } from "../../internal/utils/path.mjs";
import { pollUntilComplete } from "../../core/polling.mjs";
export class Sheets extends APIResource {
    /**
     * Create a spreadsheet parsing job. Experimental: This endpoint is not yet ready
     * for production use and is subject to change at any time.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/sheets/jobs', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List spreadsheet parsing jobs. Experimental: This endpoint is not yet ready for
     * production use and is subject to change at any time.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/beta/sheets/jobs', (PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Delete a spreadsheet parsing job and its associated data. Experimental: This
     * endpoint is not yet ready for production use and is subject to change at any
     * time.
     */
    deleteJob(spreadsheetJobID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete(path `/api/v1/beta/sheets/jobs/${spreadsheetJobID}`, {
            query: { organization_id, project_id },
            ...options,
        });
    }
    /**
     * Get a spreadsheet parsing job.
     *
     * When include_results=True (default), the response will include extracted regions
     * and results if the job is complete, eliminating the need for a separate /results
     * call.
     *
     * Experimental: This endpoint is not yet ready for production use and is subject
     * to change at any time.
     */
    get(spreadsheetJobID, query = {}, options) {
        return this._client.get(path `/api/v1/beta/sheets/jobs/${spreadsheetJobID}`, { query, ...options });
    }
    /**
     * Generate a presigned URL to download a specific extracted region. Experimental:
     * This endpoint is not yet ready for production use and is subject to change at
     * any time.
     */
    getResultTable(regionType, params, options) {
        const { spreadsheet_job_id, region_id, ...query } = params;
        return this._client.get(path `/api/v1/beta/sheets/jobs/${spreadsheet_job_id}/regions/${region_id}/result/${regionType}`, { query, ...options });
    }
    /**
     * Create a spreadsheet parsing job and wait for it to complete, returning the job with results.
     *
     * This is a convenience method that combines create() and waitForCompletion()
     * into a single call for the most common end-to-end workflow.
     *
     * @param params - Parameters including the file_id and parsing configuration
     * @param options - Request and polling configuration options
     * @returns The completed SheetsJob with results included
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import LlamaCloud from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // One-shot: create job, wait for completion, and get results
     * const job = await client.beta.sheets.parse({
     *   file_id: 'file_123',
     *   verbose: true
     * });
     *
     * // Results are ready to use immediately
     * for (const region of job.regions ?? []) {
     *   console.log(`Region ${region.region_id}: ${region.region_type}`);
     * }
     * ```
     */
    async parse(params, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...createParams } = params;
        // Create the job
        const job = await this.create(createParams, options);
        // Wait for completion
        const pollingOptions = { ...options };
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
        return this.waitForCompletion(job.id, waitParams);
    }
    /**
     * Wait for a spreadsheet parsing job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * @param spreadsheetJobID - The ID of the spreadsheet job to wait for
     * @param params - Query parameters and polling configuration
     * @param options - Additional request options
     * @returns The completed SheetsJob with results included
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import LlamaCloud from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create a spreadsheet parsing job
     * const job = await client.beta.sheets.create({ file_id: 'file_123' });
     *
     * // Wait for it to complete
     * const completedJob = await client.beta.sheets.waitForCompletion(job.id, {
     *   verbose: true
     * });
     *
     * // Access the results
     * for (const region of completedJob.regions ?? []) {
     *   console.log(`Region ${region.region_id}: ${region.region_type}`);
     * }
     * ```
     */
    async waitForCompletion(spreadsheetJobID, params = {}, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...queryParams } = params ?? {};
        const pollingOptions = {
            pollingInterval: pollingInterval ?? 1.0,
            maxInterval: maxInterval ?? 5.0,
            timeout: timeout ?? 300.0,
            backoff: backoff ?? 'linear',
            verbose: verbose ?? false,
        };
        return pollUntilComplete(async () => {
            return this.get(spreadsheetJobID, { include_results: true, ...queryParams }, options);
        }, (job) => job.status === 'SUCCESS' || job.status === 'PARTIAL_SUCCESS', (job) => job.status === 'ERROR' || job.status === 'CANCELLED', (job) => {
            const errorParts = [`Job ${spreadsheetJobID} failed with status: ${job.status}`];
            if (job.errors && job.errors.length > 0) {
                errorParts.push(`Errors: ${job.errors.join(', ')}`);
            }
            return errorParts.join(' | ');
        }, pollingOptions);
    }
}
//# sourceMappingURL=sheets.mjs.map