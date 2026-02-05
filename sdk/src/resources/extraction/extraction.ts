// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as JobsAPI from './jobs';
import {
  ExtractJob,
  JobCreateParams,
  JobFileParams,
  JobGetResultParams,
  JobGetResultResponse,
  JobListParams,
  JobListResponse,
  Jobs,
  WebhookConfiguration,
} from './jobs';
import * as RunsAPI from './runs';
import {
  ExtractConfig,
  ExtractRun,
  ExtractRunsPaginatedExtractRuns,
  RunDeleteParams,
  RunDeleteResponse,
  RunGetByJobParams,
  RunGetParams,
  RunListParams,
  Runs,
} from './runs';
import * as ExtractionAgentsAPI from './extraction-agents/extraction-agents';
import {
  ExtractAgent,
  ExtractionAgentCreateParams,
  ExtractionAgentDeleteResponse,
  ExtractionAgentListParams,
  ExtractionAgentListResponse,
  ExtractionAgentUpdateParams,
  ExtractionAgents,
} from './extraction-agents/extraction-agents';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { PollingOptions } from '../../core/polling';

export class Extraction extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
  runs: RunsAPI.Runs = new RunsAPI.Runs(this._client);
  extractionAgents: ExtractionAgentsAPI.ExtractionAgents = new ExtractionAgentsAPI.ExtractionAgents(
    this._client,
  );

  /**
   * Stateless extraction endpoint that uses a default extraction agent in the user's
   * default project. Requires data_schema, config, and either file_id, text, or
   * base64 encoded file data.
   */
  run(params: ExtractionRunParams, options?: RequestOptions): APIPromise<JobsAPI.ExtractJob> {
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
  async extract(
    params: ExtractionRunParams,
    options?: PollingOptions & RequestOptions,
  ): Promise<JobsAPI.JobGetResultResponse> {
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

export interface ExtractionRunParams {
  /**
   * Body param: The configuration parameters for the extraction
   */
  config: RunsAPI.ExtractConfig;

  /**
   * Body param: The schema of the data to extract
   */
  data_schema:
    | { [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null }
    | string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;

  /**
   * Body param: Schema for file data with base64 content and MIME type.
   */
  file?: ExtractionRunParams.File | null;

  /**
   * Body param: The ID of the file to extract from
   */
  file_id?: string | null;

  /**
   * Body param: The text content to extract from
   */
  text?: string | null;

  /**
   * Body param: The outbound webhook configurations
   */
  webhook_configurations?: Array<JobsAPI.WebhookConfiguration> | null;
}

export namespace ExtractionRunParams {
  /**
   * Schema for file data with base64 content and MIME type.
   */
  export interface File {
    /**
     * The file content as base64-encoded string
     */
    data: string;

    /**
     * The MIME type of the file (e.g., 'application/pdf', 'text/plain')
     */
    mime_type: string;
  }
}

Extraction.Jobs = Jobs;
Extraction.Runs = Runs;
Extraction.ExtractionAgents = ExtractionAgents;

export declare namespace Extraction {
  export { type ExtractionRunParams as ExtractionRunParams };

  export {
    Jobs as Jobs,
    type ExtractJob as ExtractJob,
    type WebhookConfiguration as WebhookConfiguration,
    type JobListResponse as JobListResponse,
    type JobGetResultResponse as JobGetResultResponse,
    type JobCreateParams as JobCreateParams,
    type JobListParams as JobListParams,
    type JobFileParams as JobFileParams,
    type JobGetResultParams as JobGetResultParams,
  };

  export {
    Runs as Runs,
    type ExtractConfig as ExtractConfig,
    type ExtractRun as ExtractRun,
    type RunDeleteResponse as RunDeleteResponse,
    type ExtractRunsPaginatedExtractRuns as ExtractRunsPaginatedExtractRuns,
    type RunListParams as RunListParams,
    type RunDeleteParams as RunDeleteParams,
    type RunGetParams as RunGetParams,
    type RunGetByJobParams as RunGetByJobParams,
  };

  export {
    ExtractionAgents as ExtractionAgents,
    type ExtractAgent as ExtractAgent,
    type ExtractionAgentListResponse as ExtractionAgentListResponse,
    type ExtractionAgentDeleteResponse as ExtractionAgentDeleteResponse,
    type ExtractionAgentCreateParams as ExtractionAgentCreateParams,
    type ExtractionAgentUpdateParams as ExtractionAgentUpdateParams,
    type ExtractionAgentListParams as ExtractionAgentListParams,
  };
}
