// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as DataSourcesAPI from '../data-sources';
import * as Shared from '../shared';
import * as PipelinesAPI from './pipelines';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class DataSources extends APIResource {
  /**
   * Update the configuration of a data source in a pipeline.
   */
  update(
    dataSourceID: string,
    params: DataSourceUpdateParams,
    options?: RequestOptions,
  ): APIPromise<PipelineDataSource> {
    const { pipeline_id, ...body } = params;
    return this._client.put(path`/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}`, {
      body,
      ...options,
    });
  }

  /**
   * Get data sources for a pipeline.
   */
  getDataSources(pipelineID: string, options?: RequestOptions): APIPromise<DataSourceGetDataSourcesResponse> {
    return this._client.get(path`/api/v1/pipelines/${pipelineID}/data-sources`, options);
  }

  /**
   * Get the status of a data source for a pipeline.
   */
  getStatus(
    dataSourceID: string,
    params: DataSourceGetStatusParams,
    options?: RequestOptions,
  ): APIPromise<PipelinesAPI.ManagedIngestionStatusResponse> {
    const { pipeline_id } = params;
    return this._client.get(
      path`/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/status`,
      options,
    );
  }

  /**
   * Run ingestion for the pipeline data source by incrementally updating the
   * data-sink with upstream changes from data-source.
   */
  sync(
    dataSourceID: string,
    params: DataSourceSyncParams,
    options?: RequestOptions,
  ): APIPromise<PipelinesAPI.Pipeline> {
    const { pipeline_id, ...body } = params;
    return this._client.post(path`/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/sync`, {
      body,
      ...options,
    });
  }

  /**
   * Add data sources to a pipeline.
   */
  updateDataSources(
    pipelineID: string,
    params: DataSourceUpdateDataSourcesParams,
    options?: RequestOptions,
  ): APIPromise<DataSourceUpdateDataSourcesResponse> {
    const { body } = params;
    return this._client.put(path`/api/v1/pipelines/${pipelineID}/data-sources`, { body: body, ...options });
  }
}

/**
 * Schema for a data source in a pipeline.
 */
export interface PipelineDataSource {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Component that implements the data source
   */
  component:
    | { [key: string]: unknown }
    | Shared.CloudS3DataSource
    | Shared.CloudAzStorageBlobDataSource
    | Shared.CloudOneDriveDataSource
    | Shared.CloudSharepointDataSource
    | Shared.CloudSlackDataSource
    | Shared.CloudNotionPageDataSource
    | Shared.CloudConfluenceDataSource
    | Shared.CloudJiraDataSource
    | Shared.CloudJiraDataSourceV2
    | Shared.CloudBoxDataSource;

  /**
   * The ID of the data source.
   */
  data_source_id: string;

  /**
   * The last time the data source was automatically synced.
   */
  last_synced_at: string;

  /**
   * The name of the data source.
   */
  name: string;

  /**
   * The ID of the pipeline.
   */
  pipeline_id: string;

  project_id: string;

  source_type:
    | 'S3'
    | 'AZURE_STORAGE_BLOB'
    | 'GOOGLE_DRIVE'
    | 'MICROSOFT_ONEDRIVE'
    | 'MICROSOFT_SHAREPOINT'
    | 'SLACK'
    | 'NOTION_PAGE'
    | 'CONFLUENCE'
    | 'JIRA'
    | 'JIRA_V2'
    | 'BOX';

  /**
   * Creation datetime
   */
  created_at?: string | null;

  /**
   * Custom metadata that will be present on all data loaded from the data source
   */
  custom_metadata?: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  } | null;

  /**
   * The status of the data source in the pipeline.
   */
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR' | 'CANCELLED' | null;

  /**
   * The last time the status was updated.
   */
  status_updated_at?: string | null;

  /**
   * The interval at which the data source should be synced.
   */
  sync_interval?: number | null;

  /**
   * The id of the user who set the sync schedule.
   */
  sync_schedule_set_by?: string | null;

  /**
   * Update datetime
   */
  updated_at?: string | null;

  /**
   * Version metadata for the data source
   */
  version_metadata?: DataSourcesAPI.DataSourceReaderVersionMetadata | null;
}

export type DataSourceGetDataSourcesResponse = Array<PipelineDataSource>;

export type DataSourceUpdateDataSourcesResponse = Array<PipelineDataSource>;

export interface DataSourceUpdateParams {
  /**
   * Path param
   */
  pipeline_id: string;

  /**
   * Body param: The interval at which the data source should be synced.
   */
  sync_interval?: number | null;
}

export interface DataSourceGetStatusParams {
  pipeline_id: string;
}

export interface DataSourceSyncParams {
  /**
   * Path param
   */
  pipeline_id: string;

  /**
   * Body param
   */
  pipeline_file_ids?: Array<string> | null;
}

export interface DataSourceUpdateDataSourcesParams {
  body: Array<DataSourceUpdateDataSourcesParams.Body>;
}

export namespace DataSourceUpdateDataSourcesParams {
  /**
   * Schema for creating an association between a data source and a pipeline.
   */
  export interface Body {
    /**
     * The ID of the data source.
     */
    data_source_id: string;

    /**
     * The interval at which the data source should be synced. Valid values are: 21600,
     * 43200, 86400
     */
    sync_interval?: number | null;
  }
}

export declare namespace DataSources {
  export {
    type PipelineDataSource as PipelineDataSource,
    type DataSourceGetDataSourcesResponse as DataSourceGetDataSourcesResponse,
    type DataSourceUpdateDataSourcesResponse as DataSourceUpdateDataSourcesResponse,
    type DataSourceUpdateParams as DataSourceUpdateParams,
    type DataSourceGetStatusParams as DataSourceGetStatusParams,
    type DataSourceSyncParams as DataSourceSyncParams,
    type DataSourceUpdateDataSourcesParams as DataSourceUpdateDataSourcesParams,
  };
}
