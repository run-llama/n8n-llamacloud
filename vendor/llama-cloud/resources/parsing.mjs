// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { PaginatedClassifyJobs } from "../core/pagination.mjs";
import { path } from "../internal/utils/path.mjs";
import { multipartFormRequestOptions } from "../internal/uploads.mjs";
import { pollUntilComplete } from "../core/polling.mjs";
export class Parsing extends APIResource {
    /**
     * Parse a file by file ID, URL, or direct file upload.
     */
    create(params, options) {
        const { organization_id, project_id, upload_file, ...body } = params;
        // If file is provided, use multipart upload endpoint
        if (upload_file) {
            // Prepare configuration as JSON string
            const configuration = JSON.stringify(body);
            return this._client.post('/api/v2/parse', multipartFormRequestOptions({
                query: { organization_id, project_id },
                body: { configuration, file: upload_file },
                ...options,
            }, this._client));
        }
        // Otherwise use regular JSON endpoint
        return this._client.post('/api/v2/parse', { query: { organization_id, project_id }, body, ...options });
    }
    /**
     * List parse jobs for the current project with optional status filtering and
     * pagination.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v2/parse', (PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Retrieve parse job with optional content or metadata.
     */
    get(jobID, query = {}, options) {
        return this._client.get(path `/api/v2/parse/${jobID}`, { query, ...options });
    }
    /**
     * Wait for a parse job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * @param jobID - The ID of the parse job to wait for
     * @param options - Polling configuration options
     * @returns The completed ParsingGetResponse
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create a parse job
     * const job = await client.parsing.create({
     *   tier: 'fast',
     *   version: 'latest',
     *   source_url: 'https://example.com/document.pdf'
     * });
     *
     * // Wait for it to complete
     * const result = await client.parsing.waitForCompletion(
     *   job.id,
     *   { verbose: true }
     * );
     * ```
     */
    async waitForCompletion(jobID, query, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        const getStatus = async () => {
            return await this.get(jobID, query, requestOptions);
        };
        const isComplete = (result) => {
            return result.job.status === 'COMPLETED';
        };
        const isError = (result) => {
            return result.job.status === 'FAILED' || result.job.status === 'CANCELLED';
        };
        const getErrorMessage = (result) => {
            const errorParts = [`Job ${jobID} failed with status: ${result.job.status}`];
            if (result.job.error_message) {
                errorParts.push(`Error: ${result.job.error_message}`);
            }
            return errorParts.join(' | ');
        };
        return await pollUntilComplete(getStatus, isComplete, isError, getErrorMessage, {
            pollingInterval,
            maxInterval,
            timeout: timeout || 2000.0,
            backoff,
            verbose,
        });
    }
    /**
     * Parse a file and wait for it to complete, returning the result.
     *
     * This is a convenience method that combines create() and waitForCompletion()
     * into a single call for the most common end-to-end workflow.
     *
     * @param params - Parse job creation parameters (including optional file for direct upload)
     * @param options - Polling configuration and request options
     * @returns The parse result (ParsingGetResponse) with job status and optional result data
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // One-shot: parse, wait for completion, and get result
     * const result = await client.parsing.parse({
     *   tier: 'fast',
     *   version: 'latest',
     *   source_url: 'https://example.com/document.pdf',
     *   expand: ['text', 'markdown']
     * }, { verbose: true });
     *
     * // Result is ready to use immediately
     * console.log(result.text);
     * console.log(result.markdown);
     * ```
     *
     * @example
     * ```typescript
     * // Parse with file upload
     * import fs from 'fs';
     *
     * const result = await client.parsing.parse({
     *   tier: 'fast',
     *   version: 'latest',
     *   upload_file: fs.createReadStream('./document.pdf'),
     *   expand: ['text', 'markdown']
     * });
     * ```
     */
    async parse(params, options) {
        const { expand, ...createParams } = params;
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        // Create the parsing job
        const job = await this.create(createParams, requestOptions);
        // Build query params for get, only including defined values
        const getQuery = {};
        if (params.organization_id !== undefined) {
            getQuery.organization_id = params.organization_id;
        }
        if (params.project_id !== undefined) {
            getQuery.project_id = params.project_id;
        }
        if (expand) {
            getQuery.expand = expand;
        }
        // Wait for completion and return the result with requested expansions
        return await this.waitForCompletion(job.id, getQuery, {
            pollingInterval,
            maxInterval,
            timeout: timeout || 2000.0,
            backoff,
            verbose,
            ...requestOptions,
        });
    }
}
//# sourceMappingURL=parsing.mjs.map