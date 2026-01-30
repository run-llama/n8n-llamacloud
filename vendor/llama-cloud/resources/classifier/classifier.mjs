// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as JobsAPI from "./jobs.mjs";
import { Jobs, } from "./jobs.mjs";
export class Classifier extends APIResource {
    constructor() {
        super(...arguments);
        this.jobs = new JobsAPI.Jobs(this._client);
    }
    /**
     * Create a classify job and wait for it to complete, returning the results.
     *
     * This is a convenience method that combines create(), waitForCompletion(),
     * and getResults() into a single call for the most common end-to-end workflow.
     *
     * @param params - Parameters for creating the classify job
     * @param options - Polling configuration options
     * @returns The classification results (JobGetResultsResponse)
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
     * const results = await client.classifier.classify({
     *   file_ids: ['file1', 'file2', 'file3'],
     *   rules: [
     *     { type: 'invoice', description: 'Invoice documents' },
     *     { type: 'receipt', description: 'Receipt documents' },
     *   ],
     * }, { verbose: true });
     *
     * // Results are ready to use immediately
     * for (const item of results.items) {
     *   console.log(`File ${item.file_id}: ${item.result?.type}`);
     * }
     * ```
     */
    async classify(params, options) {
        // Create the job
        const job = await this.jobs.create(params, options);
        // Prepare query params, filtering out undefined values
        const queryParams = {
            ...(params.organization_id !== undefined && { organization_id: params.organization_id }),
            ...(params.project_id !== undefined && { project_id: params.project_id }),
        };
        // Wait for completion
        await this.jobs.waitForCompletion(job.id, queryParams, options);
        // Get and return the results
        return await this.jobs.getResults(job.id, queryParams, options);
    }
}
Classifier.Jobs = Jobs;
//# sourceMappingURL=classifier.mjs.map