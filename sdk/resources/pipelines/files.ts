// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PipelinesAPI from './pipelines';
import { APIPromise } from '../../core/api-promise';
import {
  PagePromise,
  PaginatedPipelineFiles,
  type PaginatedPipelineFilesParams,
} from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Files extends APIResource {
  /**
   * Add files to a pipeline.
   */
  create(
    pipelineID: string,
    params: FileCreateParams,
    options?: RequestOptions,
  ): APIPromise<FileCreateResponse> {
    const { body } = params;
    return this._client.put(path`/api/v1/pipelines/${pipelineID}/files`, { body: body, ...options });
  }

  /**
   * Update a file for a pipeline.
   */
  update(fileID: string, params: FileUpdateParams, options?: RequestOptions): APIPromise<PipelineFile> {
    const { pipeline_id, ...body } = params;
    return this._client.put(path`/api/v1/pipelines/${pipeline_id}/files/${fileID}`, { body, ...options });
  }

  /**
   * Get files for a pipeline.
   *
   * Args: pipeline_id: ID of the pipeline data_source_id: Optional filter by data
   * source ID only_manually_uploaded: Filter for only manually uploaded files
   * file_name_contains: Optional filter by file name (substring match) limit: Limit
   * number of results offset: Offset for pagination order_by: Field to order by
   *
   * @deprecated
   */
  list(
    pipelineID: string,
    query: FileListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PipelineFilesPaginatedPipelineFiles, PipelineFile> {
    return this._client.getAPIList(
      path`/api/v1/pipelines/${pipelineID}/files2`,
      PaginatedPipelineFiles<PipelineFile>,
      { query, ...options },
    );
  }

  /**
   * Delete a file from a pipeline.
   */
  delete(fileID: string, params: FileDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { pipeline_id } = params;
    return this._client.delete(path`/api/v1/pipelines/${pipeline_id}/files/${fileID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get status of a file for a pipeline.
   */
  getStatus(
    fileID: string,
    params: FileGetStatusParams,
    options?: RequestOptions,
  ): APIPromise<PipelinesAPI.ManagedIngestionStatusResponse> {
    const { pipeline_id } = params;
    return this._client.get(path`/api/v1/pipelines/${pipeline_id}/files/${fileID}/status`, options);
  }

  /**
   * Get files for a pipeline.
   */
  getStatusCounts(
    pipelineID: string,
    query: FileGetStatusCountsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<FileGetStatusCountsResponse> {
    return this._client.get(path`/api/v1/pipelines/${pipelineID}/files/status-counts`, { query, ...options });
  }
}

export type PipelineFilesPaginatedPipelineFiles = PaginatedPipelineFiles<PipelineFile>;

/**
 * Schema for a file that is associated with a pipeline.
 */
export interface PipelineFile {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * The ID of the pipeline that the file is associated with
   */
  pipeline_id: string;

  /**
   * Hashes for the configuration of the pipeline.
   */
  config_hash?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;

  /**
   * Creation datetime
   */
  created_at?: string | null;

  /**
   * Custom metadata for the file
   */
  custom_metadata?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;

  /**
   * The ID of the data source that the file belongs to
   */
  data_source_id?: string | null;

  /**
   * The ID of the file in the external system
   */
  external_file_id?: string | null;

  /**
   * The ID of the file
   */
  file_id?: string | null;

  /**
   * Size of the file in bytes
   */
  file_size?: number | null;

  /**
   * File type (e.g. pdf, docx, etc.)
   */
  file_type?: string | null;

  /**
   * The number of pages that have been indexed for this file
   */
  indexed_page_count?: number | null;

  /**
   * The last modified time of the file
   */
  last_modified_at?: string | null;

  /**
   * Name of the file
   */
  name?: string | null;

  /**
   * Permission information for the file
   */
  permission_info?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;

  /**
   * The ID of the project that the file belongs to
   */
  project_id?: string | null;

  /**
   * Resource information for the file
   */
  resource_info?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;

  /**
   * Status of the pipeline file
   */
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR' | 'CANCELLED' | null;

  /**
   * The last time the status was updated
   */
  status_updated_at?: string | null;

  /**
   * Update datetime
   */
  updated_at?: string | null;
}

export type FileCreateResponse = Array<PipelineFile>;

export interface FileGetStatusCountsResponse {
  /**
   * The counts of files by status
   */
  counts: { [key: string]: number };

  /**
   * The total number of files
   */
  total_count: number;

  /**
   * The ID of the data source that the files belong to
   */
  data_source_id?: string | null;

  /**
   * Whether to only count manually uploaded files
   */
  only_manually_uploaded?: boolean;

  /**
   * The ID of the pipeline that the files belong to
   */
  pipeline_id?: string | null;
}

export interface FileCreateParams {
  body: Array<FileCreateParams.Body>;
}

export namespace FileCreateParams {
  /**
   * Schema for creating a file that is associated with a pipeline.
   */
  export interface Body {
    /**
     * The ID of the file
     */
    file_id: string;

    /**
     * Custom metadata for the file
     */
    custom_metadata?: {
      [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
    } | null;
  }
}

export interface FileUpdateParams {
  /**
   * Path param
   */
  pipeline_id: string;

  /**
   * Body param: Custom metadata for the file
   */
  custom_metadata?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;
}

export interface FileListParams extends PaginatedPipelineFilesParams {
  data_source_id?: string | null;

  file_name_contains?: string | null;

  only_manually_uploaded?: boolean;

  order_by?: string | null;
}

export interface FileDeleteParams {
  pipeline_id: string;
}

export interface FileGetStatusParams {
  pipeline_id: string;
}

export interface FileGetStatusCountsParams {
  data_source_id?: string | null;

  only_manually_uploaded?: boolean;
}

export declare namespace Files {
  export {
    type PipelineFile as PipelineFile,
    type FileCreateResponse as FileCreateResponse,
    type FileGetStatusCountsResponse as FileGetStatusCountsResponse,
    type PipelineFilesPaginatedPipelineFiles as PipelineFilesPaginatedPipelineFiles,
    type FileCreateParams as FileCreateParams,
    type FileUpdateParams as FileUpdateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileGetStatusParams as FileGetStatusParams,
    type FileGetStatusCountsParams as FileGetStatusCountsParams,
  };
}
