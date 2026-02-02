// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as RetrieversAPI from './retrievers';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Retriever extends APIResource {
  /**
   * Retrieve data using a Retriever.
   */
  search(
    retrieverID: string,
    params: RetrieverSearchParams,
    options?: RequestOptions,
  ): APIPromise<RetrieversAPI.CompositeRetrievalResult> {
    const { organization_id, project_id, ...body } = params;
    return this._client.post(path`/api/v1/retrievers/${retrieverID}/retrieve`, {
      query: { organization_id, project_id },
      body,
      ...options,
    });
  }
}

export interface RetrieverSearchParams {
  /**
   * Body param: The query to retrieve against.
   */
  query: string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;

  /**
   * Body param: The mode of composite retrieval.
   */
  mode?: RetrieversAPI.CompositeRetrievalMode;

  /**
   * Body param: The rerank configuration for composite retrieval.
   */
  rerank_config?: RetrieversAPI.ReRankConfig;

  /**
   * @deprecated Body param: (use rerank_config.top_n instead) The number of nodes to
   * retrieve after reranking over retrieved nodes from all retrieval tools.
   */
  rerank_top_n?: number | null;
}

export declare namespace Retriever {
  export { type RetrieverSearchParams as RetrieverSearchParams };
}
