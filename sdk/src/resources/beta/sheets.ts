// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as FilesAPI from '../files';
import * as ParsingAPI from '../parsing';
import { APIPromise } from '../../core/api-promise';
import { PagePromise, PaginatedCursor, type PaginatedCursorParams } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import { pollUntilComplete, PollingOptions } from '../../core/polling';

export class Sheets extends APIResource {
  /**
   * Create a spreadsheet parsing job. Experimental: This endpoint is not yet ready
   * for production use and is subject to change at any time.
   */
  create(params: SheetCreateParams, options?: RequestOptions): APIPromise<SheetsJob> {
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
  list(
    query: SheetListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<SheetsJobsPaginatedCursor, SheetsJob> {
    return this._client.getAPIList('/api/v1/beta/sheets/jobs', PaginatedCursor<SheetsJob>, {
      query,
      ...options,
    });
  }

  /**
   * Delete a spreadsheet parsing job and its associated data. Experimental: This
   * endpoint is not yet ready for production use and is subject to change at any
   * time.
   */
  deleteJob(
    spreadsheetJobID: string,
    params: SheetDeleteJobParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<unknown> {
    const { organization_id, project_id } = params ?? {};
    return this._client.delete(path`/api/v1/beta/sheets/jobs/${spreadsheetJobID}`, {
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
  get(
    spreadsheetJobID: string,
    query: SheetGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SheetsJob> {
    return this._client.get(path`/api/v1/beta/sheets/jobs/${spreadsheetJobID}`, { query, ...options });
  }

  /**
   * Generate a presigned URL to download a specific extracted region. Experimental:
   * This endpoint is not yet ready for production use and is subject to change at
   * any time.
   */
  getResultTable(
    regionType: 'table' | 'extra' | 'cell_metadata',
    params: SheetGetResultTableParams,
    options?: RequestOptions,
  ): APIPromise<FilesAPI.PresignedURL> {
    const { spreadsheet_job_id, region_id, ...query } = params;
    return this._client.get(
      path`/api/v1/beta/sheets/jobs/${spreadsheet_job_id}/regions/${region_id}/result/${regionType}`,
      { query, ...options },
    );
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
  async parse(params: SheetParseParams, options?: RequestOptions): Promise<SheetsJob> {
    const { pollingInterval, maxInterval, timeout, backoff, verbose, ...createParams } = params;

    // Create the job
    const job = await this.create(createParams, options);

    // Wait for completion
    const pollingOptions: PollingOptions & RequestOptions = { ...options };
    if (pollingInterval !== undefined) pollingOptions.pollingInterval = pollingInterval;
    if (maxInterval !== undefined) pollingOptions.maxInterval = maxInterval;
    if (timeout !== undefined) pollingOptions.timeout = timeout;
    if (backoff !== undefined) pollingOptions.backoff = backoff;
    if (verbose !== undefined) pollingOptions.verbose = verbose;

    // Only pass query params that are valid for waitForCompletion
    const waitParams: SheetWaitForCompletionParams = {
      ...pollingOptions,
    };
    if (createParams.organization_id !== undefined) waitParams.organization_id = createParams.organization_id;
    if (createParams.project_id !== undefined) waitParams.project_id = createParams.project_id;

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
  async waitForCompletion(
    spreadsheetJobID: string,
    params: SheetWaitForCompletionParams | null | undefined = {},
    options?: RequestOptions,
  ): Promise<SheetsJob> {
    const { pollingInterval, maxInterval, timeout, backoff, verbose, ...queryParams } = params ?? {};

    const pollingOptions: PollingOptions = {
      pollingInterval: pollingInterval ?? 1.0,
      maxInterval: maxInterval ?? 5.0,
      timeout: timeout ?? 300.0,
      backoff: backoff ?? 'linear',
      verbose: verbose ?? false,
    };

    return pollUntilComplete(
      async () => {
        return this.get(spreadsheetJobID, { include_results: true, ...queryParams }, options);
      },
      (job) => job.status === 'SUCCESS' || job.status === 'PARTIAL_SUCCESS',
      (job) => job.status === 'ERROR' || job.status === 'CANCELLED',
      (job) => {
        const errorParts = [`Job ${spreadsheetJobID} failed with status: ${job.status}`];
        if (job.errors && job.errors.length > 0) {
          errorParts.push(`Errors: ${job.errors.join(', ')}`);
        }
        return errorParts.join(' | ');
      },
      pollingOptions,
    );
  }
}

export type SheetsJobsPaginatedCursor = PaginatedCursor<SheetsJob>;

/**
 * A spreadsheet parsing job
 */
export interface SheetsJob {
  /**
   * The ID of the job
   */
  id: string;

  /**
   * Configuration for the parsing job
   */
  config: SheetsParsingConfig;

  /**
   * When the job was created
   */
  created_at: string;

  /**
   * The ID of the input file
   */
  file_id: string | null;

  /**
   * The ID of the project
   */
  project_id: string;

  /**
   * The status of the parsing job
   */
  status: ParsingAPI.StatusEnum;

  /**
   * When the job was last updated
   */
  updated_at: string;

  /**
   * The ID of the user
   */
  user_id: string;

  /**
   * Any errors encountered
   */
  errors?: Array<string>;

  /**
   * @deprecated Schema for a file.
   */
  file?: FilesAPI.File | null;

  /**
   * All extracted regions (populated when job is complete)
   */
  regions?: Array<SheetsJob.Region>;

  /**
   * Whether the job completed successfully
   */
  success?: boolean | null;

  /**
   * Metadata for each processed worksheet (populated when job is complete)
   */
  worksheet_metadata?: Array<SheetsJob.WorksheetMetadata>;
}

export namespace SheetsJob {
  /**
   * A summary of a single extracted region from a spreadsheet
   */
  export interface Region {
    /**
     * Location of the region in the spreadsheet
     */
    location: string;

    /**
     * Type of the extracted region
     */
    region_type: string;

    /**
     * Worksheet name where region was found
     */
    sheet_name: string;

    /**
     * Generated description for the region
     */
    description?: string | null;

    /**
     * Unique identifier for this region within the file
     */
    region_id?: string;

    /**
     * Generated title for the region
     */
    title?: string | null;
  }

  /**
   * Metadata about a worksheet in a spreadsheet
   */
  export interface WorksheetMetadata {
    /**
     * Name of the worksheet
     */
    sheet_name: string;

    /**
     * Generated description of the worksheet
     */
    description?: string | null;

    /**
     * Generated title for the worksheet
     */
    title?: string | null;
  }
}

/**
 * Configuration for spreadsheet parsing and region extraction
 */
export interface SheetsParsingConfig {
  /**
   * A1 notation of the range to extract a single region from. If None, the entire
   * sheet is used.
   */
  extraction_range?: string | null;

  /**
   * Return a flattened dataframe when a detected table is recognized as
   * hierarchical.
   */
  flatten_hierarchical_tables?: boolean;

  /**
   * Whether to generate additional metadata (title, description) for each extracted
   * region.
   */
  generate_additional_metadata?: boolean;

  /**
   * Whether to include hidden cells when extracting regions from the spreadsheet.
   */
  include_hidden_cells?: boolean;

  /**
   * The names of the sheets to extract regions from. If empty, all sheets will be
   * processed.
   */
  sheet_names?: Array<string> | null;

  /**
   * Influences how likely similar-looking regions are merged into a single table.
   * Useful for spreadsheets that either have sparse tables (strong merging) or many
   * distinct tables close together (weak merging).
   */
  table_merge_sensitivity?: 'strong' | 'weak';

  /**
   * Enables experimental processing. Accuracy may be impacted.
   */
  use_experimental_processing?: boolean;
}

export type SheetDeleteJobResponse = unknown;

export interface SheetCreateParams {
  /**
   * Body param: The ID of the file to parse
   */
  file_id: string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;

  /**
   * Body param: Configuration for the parsing job
   */
  config?: SheetsParsingConfig;
}

export interface SheetListParams extends PaginatedCursorParams {
  include_results?: boolean;

  organization_id?: string | null;

  project_id?: string | null;
}

export interface SheetDeleteJobParams {
  organization_id?: string | null;

  project_id?: string | null;
}

export interface SheetGetParams {
  include_results?: boolean;

  organization_id?: string | null;

  project_id?: string | null;
}

export interface SheetGetResultTableParams {
  /**
   * Path param
   */
  spreadsheet_job_id: string;

  /**
   * Path param
   */
  region_id: string;

  /**
   * Query param
   */
  expires_at_seconds?: number | null;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;
}

export interface SheetParseParams extends SheetCreateParams, PollingOptions {}

export interface SheetWaitForCompletionParams extends PollingOptions {
  include_results?: boolean;

  organization_id?: string | null;

  project_id?: string | null;
}

export declare namespace Sheets {
  export {
    type SheetsJob as SheetsJob,
    type SheetsParsingConfig as SheetsParsingConfig,
    type SheetDeleteJobResponse as SheetDeleteJobResponse,
    type SheetsJobsPaginatedCursor as SheetsJobsPaginatedCursor,
    type SheetCreateParams as SheetCreateParams,
    type SheetListParams as SheetListParams,
    type SheetDeleteJobParams as SheetDeleteJobParams,
    type SheetGetParams as SheetGetParams,
    type SheetGetResultTableParams as SheetGetResultTableParams,
    type SheetParseParams as SheetParseParams,
    type SheetWaitForCompletionParams as SheetWaitForCompletionParams,
  };
}
