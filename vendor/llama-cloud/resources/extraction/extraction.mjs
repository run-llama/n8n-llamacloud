// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as JobsAPI from "./jobs.mjs";
import { Jobs, } from "./jobs.mjs";
import * as RunsAPI from "./runs.mjs";
import { Runs, } from "./runs.mjs";
import * as ExtractionAgentsAPI from "./extraction-agents/extraction-agents.mjs";
import { ExtractionAgents, } from "./extraction-agents/extraction-agents.mjs";
export class Extraction extends APIResource {
    constructor() {
        super(...arguments);
        this.jobs = new JobsAPI.Jobs(this._client);
        this.runs = new RunsAPI.Runs(this._client);
        this.extractionAgents = new ExtractionAgentsAPI.ExtractionAgents(this._client);
    }
    /**
     * Stateless extraction endpoint that uses a default extraction agent in the user's
     * default project. Requires data_schema, config, and either file_id, text, or
     * base64 encoded file data.
     */
    run(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/extraction/run', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Run a stateless extraction and wait for it to complete, returning the result.
     *
     * This is a convenience method that combines run(), waitForCompletion(),
     * and getResult() into a single call for the most common end-to-end workflow.
     *
     * This endpoint uses a default extraction agent in the user's default project.
     *
     * @param params - Extraction parameters
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
     * // One-shot: run stateless extraction, wait for completion, and get result
     * const result = await client.extraction.extract({
     *   config: {
     *     chunk_mode: 'PAGE',
     *     cite_sources: true,
     *     extraction_target: 'PER_DOC',
     *     extraction_mode: 'BALANCED'
     *   },
     *   data_schema: { model_names: { type: 'array', items: { type: 'string' } } },
     *   file_id: 'file_id'
     * }, { verbose: true });
     *
     * // Result is ready to use immediately
     * console.log(result.data);
     * ```
     */
    async extract(params, options) {
        const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};
        // Run the extraction job
        const job = await this.run(params, requestOptions);
        // Wait for completion
        await this.jobs.waitForCompletion(job.id, {
            pollingInterval,
            maxInterval,
            timeout: timeout || 2000.0,
            backoff,
            verbose,
            ...requestOptions,
        });
        // Get and return the result
        return await this.jobs.getResult(job.id, {}, requestOptions);
    }
}
Extraction.Jobs = Jobs;
Extraction.Runs = Runs;
Extraction.ExtractionAgents = ExtractionAgents;
//# sourceMappingURL=extraction.mjs.map