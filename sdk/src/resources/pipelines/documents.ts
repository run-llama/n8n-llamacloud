// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PipelinesAPI from './pipelines';
import { APIPromise } from '../../core/api-promise';
import {
  PagePromise,
  PaginatedCloudDocuments,
  type PaginatedCloudDocumentsParams,
} from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Documents extends APIResource {
  /**
   * Batch create documents for a pipeline.
   */
  create(
    pipelineID: string,
    params: DocumentCreateParams,
    options?: RequestOptions,
  ): APIPromise<DocumentCreateResponse> {
    const { body } = params;
    return this._client.post(path`/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
  }

  /**
   * Return a list of documents for a pipeline.
   */
  list(
    pipelineID: string,
    query: DocumentListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<CloudDocumentsPaginatedCloudDocuments, CloudDocument> {
    return this._client.getAPIList(
      path`/api/v1/pipelines/${pipelineID}/documents/paginated`,
      PaginatedCloudDocuments<CloudDocument>,
      { query, ...options },
    );
  }

  /**
   * Delete a document from a pipeline. Initiates an async job that will:
   *
   * 1. Delete vectors from the vector store
   * 2. Delete the document from MongoDB after vectors are successfully deleted
   */
  delete(documentID: string, params: DocumentDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { pipeline_id } = params;
    return this._client.delete(path`/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Return a single document for a pipeline.
   */
  get(documentID: string, params: DocumentGetParams, options?: RequestOptions): APIPromise<CloudDocument> {
    const { pipeline_id } = params;
    return this._client.get(path`/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, options);
  }

  /**
   * Return a list of chunks for a pipeline document.
   */
  getChunks(
    documentID: string,
    params: DocumentGetChunksParams,
    options?: RequestOptions,
  ): APIPromise<DocumentGetChunksResponse> {
    const { pipeline_id } = params;
    return this._client.get(path`/api/v1/pipelines/${pipeline_id}/documents/${documentID}/chunks`, options);
  }

  /**
   * Return a single document for a pipeline.
   */
  getStatus(
    documentID: string,
    params: DocumentGetStatusParams,
    options?: RequestOptions,
  ): APIPromise<PipelinesAPI.ManagedIngestionStatusResponse> {
    const { pipeline_id } = params;
    return this._client.get(path`/api/v1/pipelines/${pipeline_id}/documents/${documentID}/status`, options);
  }

  /**
   * Sync a specific document for a pipeline.
   */
  sync(documentID: string, params: DocumentSyncParams, options?: RequestOptions): APIPromise<unknown> {
    const { pipeline_id } = params;
    return this._client.post(path`/api/v1/pipelines/${pipeline_id}/documents/${documentID}/sync`, options);
  }

  /**
   * Batch create or update a document for a pipeline.
   */
  upsert(
    pipelineID: string,
    params: DocumentUpsertParams,
    options?: RequestOptions,
  ): APIPromise<DocumentUpsertResponse> {
    const { body } = params;
    return this._client.put(path`/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
  }
}

export type CloudDocumentsPaginatedCloudDocuments = PaginatedCloudDocuments<CloudDocument>;

/**
 * Cloud document stored in S3.
 */
export interface CloudDocument {
  id: string;

  metadata: { [key: string]: unknown };

  text: string;

  excluded_embed_metadata_keys?: Array<string>;

  excluded_llm_metadata_keys?: Array<string>;

  /**
   * indices in the CloudDocument.text where a new page begins. e.g. Second page
   * starts at index specified by page_positions[1].
   */
  page_positions?: Array<number> | null;

  status_metadata?: { [key: string]: unknown } | null;
}

/**
 * Create a new cloud document.
 */
export interface CloudDocumentCreate {
  metadata: { [key: string]: unknown };

  text: string;

  id?: string | null;

  excluded_embed_metadata_keys?: Array<string>;

  excluded_llm_metadata_keys?: Array<string>;

  /**
   * indices in the CloudDocument.text where a new page begins. e.g. Second page
   * starts at index specified by page_positions[1].
   */
  page_positions?: Array<number> | null;
}

/**
 * Provided for backward compatibility.
 *
 * Note: we keep the field with the typo "seperator" to maintain backward
 * compatibility for serialized objects.
 */
export interface TextNode {
  class_name?: string;

  /**
   * Embedding of the node.
   */
  embedding?: Array<number> | null;

  /**
   * End char index of the node.
   */
  end_char_idx?: number | null;

  /**
   * Metadata keys that are excluded from text for the embed model.
   */
  excluded_embed_metadata_keys?: Array<string>;

  /**
   * Metadata keys that are excluded from text for the LLM.
   */
  excluded_llm_metadata_keys?: Array<string>;

  /**
   * A flat dictionary of metadata fields
   */
  extra_info?: { [key: string]: unknown };

  /**
   * Unique ID of the node.
   */
  id_?: string;

  /**
   * Separator between metadata fields when converting to string.
   */
  metadata_seperator?: string;

  /**
   * Template for how metadata is formatted, with {key} and {value} placeholders.
   */
  metadata_template?: string;

  /**
   * MIME type of the node content.
   */
  mimetype?: string;

  /**
   * A mapping of relationships to other node information.
   */
  relationships?: { [key: string]: TextNode.RelatedNodeInfo | Array<TextNode.UnionMember1> };

  /**
   * Start char index of the node.
   */
  start_char_idx?: number | null;

  /**
   * Text content of the node.
   */
  text?: string;

  /**
   * Template for how text is formatted, with {content} and {metadata_str}
   * placeholders.
   */
  text_template?: string;
}

export namespace TextNode {
  export interface RelatedNodeInfo {
    node_id: string;

    class_name?: string;

    hash?: string | null;

    metadata?: { [key: string]: unknown };

    node_type?: '1' | '2' | '3' | '4' | '5' | (string & {}) | null;
  }

  export interface UnionMember1 {
    node_id: string;

    class_name?: string;

    hash?: string | null;

    metadata?: { [key: string]: unknown };

    node_type?: '1' | '2' | '3' | '4' | '5' | (string & {}) | null;
  }
}

export type DocumentCreateResponse = Array<CloudDocument>;

export type DocumentGetChunksResponse = Array<TextNode>;

export type DocumentSyncResponse = unknown;

export type DocumentUpsertResponse = Array<CloudDocument>;

export interface DocumentCreateParams {
  body: Array<CloudDocumentCreate>;
}

export interface DocumentListParams extends PaginatedCloudDocumentsParams {
  file_id?: string | null;

  only_api_data_source_documents?: boolean | null;

  only_direct_upload?: boolean | null;

  status_refresh_policy?: 'cached' | 'ttl';
}

export interface DocumentDeleteParams {
  pipeline_id: string;
}

export interface DocumentGetParams {
  pipeline_id: string;
}

export interface DocumentGetChunksParams {
  pipeline_id: string;
}

export interface DocumentGetStatusParams {
  pipeline_id: string;
}

export interface DocumentSyncParams {
  pipeline_id: string;
}

export interface DocumentUpsertParams {
  body: Array<CloudDocumentCreate>;
}

export declare namespace Documents {
  export {
    type CloudDocument as CloudDocument,
    type CloudDocumentCreate as CloudDocumentCreate,
    type TextNode as TextNode,
    type DocumentCreateResponse as DocumentCreateResponse,
    type DocumentGetChunksResponse as DocumentGetChunksResponse,
    type DocumentSyncResponse as DocumentSyncResponse,
    type DocumentUpsertResponse as DocumentUpsertResponse,
    type CloudDocumentsPaginatedCloudDocuments as CloudDocumentsPaginatedCloudDocuments,
    type DocumentCreateParams as DocumentCreateParams,
    type DocumentListParams as DocumentListParams,
    type DocumentDeleteParams as DocumentDeleteParams,
    type DocumentGetParams as DocumentGetParams,
    type DocumentGetChunksParams as DocumentGetChunksParams,
    type DocumentGetStatusParams as DocumentGetStatusParams,
    type DocumentSyncParams as DocumentSyncParams,
    type DocumentUpsertParams as DocumentUpsertParams,
  };
}
