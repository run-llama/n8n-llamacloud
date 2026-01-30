// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PipelinesAPI from './pipelines';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Sync extends APIResource {
  /**
   * Run ingestion for the pipeline by incrementally updating the data-sink with
   * upstream changes from data-sources & files.
   */
  create(pipelineID: string, options?: RequestOptions): APIPromise<PipelinesAPI.Pipeline> {
    return this._client.post(path`/api/v1/pipelines/${pipelineID}/sync`, options);
  }

  /**
   * Cancel Pipeline Sync
   */
  cancel(pipelineID: string, options?: RequestOptions): APIPromise<PipelinesAPI.Pipeline> {
    return this._client.post(path`/api/v1/pipelines/${pipelineID}/sync/cancel`, options);
  }
}
