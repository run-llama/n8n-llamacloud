// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { path } from '../../internal/utils/path';

export class Metadata extends APIResource {
  /**
   * Import metadata for a pipeline.
   */
  create(
    pipelineID: string,
    body: MetadataCreateParams,
    options?: RequestOptions,
  ): APIPromise<MetadataCreateResponse> {
    return this._client.put(
      path`/api/v1/pipelines/${pipelineID}/metadata`,
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Delete metadata for all files in a pipeline.
   */
  deleteAll(pipelineID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/pipelines/${pipelineID}/metadata`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type MetadataCreateResponse = { [key: string]: string };

export interface MetadataCreateParams {
  upload_file: Uploadable;
}

export declare namespace Metadata {
  export {
    type MetadataCreateResponse as MetadataCreateResponse,
    type MetadataCreateParams as MetadataCreateParams,
  };
}
