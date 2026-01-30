"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extraction = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const JobsAPI = tslib_1.__importStar(require("./jobs.js"));
const jobs_1 = require("./jobs.js");
const RunsAPI = tslib_1.__importStar(require("./runs.js"));
const runs_1 = require("./runs.js");
const ExtractionAgentsAPI = tslib_1.__importStar(require("./extraction-agents/extraction-agents.js"));
const extraction_agents_1 = require("./extraction-agents/extraction-agents.js");
class Extraction extends resource_1.APIResource {
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
exports.Extraction = Extraction;
Extraction.Jobs = jobs_1.Jobs;
Extraction.Runs = runs_1.Runs;
Extraction.ExtractionAgents = extraction_agents_1.ExtractionAgents;
//# sourceMappingURL=extraction.js.map