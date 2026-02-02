// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PipelinesAPI from '../pipelines/pipelines';
import { APIPromise } from '../../core/api-promise';
import { PagePromise, PaginatedCursor, type PaginatedCursorParams } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class ParseConfigurations extends APIResource {
  /**
   * Create a new parse configuration.
   *
   * Args: config_create: Parse configuration creation data project: Validated
   * project from dependency user: Current user db: Database session
   *
   * Returns: The created parse configuration
   */
  create(params: ParseConfigurationCreateParams, options?: RequestOptions): APIPromise<ParseConfiguration> {
    const { organization_id, project_id, ...body } = params;
    return this._client.post('/api/v1/beta/parse-configurations', {
      query: { organization_id, project_id },
      body,
      ...options,
    });
  }

  /**
   * Update a parse configuration.
   *
   * Args: config_id: The ID of the parse configuration to update config_update:
   * Update data project: Validated project from dependency user: Current user db:
   * Database session
   *
   * Returns: The updated parse configuration
   */
  update(
    configID: string,
    params: ParseConfigurationUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ParseConfiguration> {
    const { organization_id, project_id, ...body } = params;
    return this._client.put(path`/api/v1/beta/parse-configurations/${configID}`, {
      query: { organization_id, project_id },
      body,
      ...options,
    });
  }

  /**
   * List parse configurations for the current project.
   *
   * Args: project: Validated project from dependency user: Current user db: Database
   * session page_size: Number of items per page page_token: Token for pagination
   * name: Filter by configuration name creator: Filter by creator version: Filter by
   * version
   *
   * Returns: Paginated response with parse configurations
   */
  list(
    query: ParseConfigurationListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<ParseConfigurationsPaginatedCursor, ParseConfiguration> {
    return this._client.getAPIList('/api/v1/beta/parse-configurations', PaginatedCursor<ParseConfiguration>, {
      query,
      ...options,
    });
  }

  /**
   * Delete a parse configuration.
   *
   * Args: config_id: The ID of the parse configuration to delete project: Validated
   * project from dependency user: Current user db: Database session
   */
  delete(
    configID: string,
    params: ParseConfigurationDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const { organization_id, project_id } = params ?? {};
    return this._client.delete(path`/api/v1/beta/parse-configurations/${configID}`, {
      query: { organization_id, project_id },
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get a parse configuration by ID.
   *
   * Args: config_id: The ID of the parse configuration project: Validated project
   * from dependency user: Current user db: Database session
   *
   * Returns: The parse configuration
   */
  get(
    configID: string,
    query: ParseConfigurationGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ParseConfiguration> {
    return this._client.get(path`/api/v1/beta/parse-configurations/${configID}`, { query, ...options });
  }
}

export type ParseConfigurationsPaginatedCursor = PaginatedCursor<ParseConfiguration>;

/**
 * Parse configuration schema.
 */
export interface ParseConfiguration {
  /**
   * Unique identifier for the parse configuration
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Name of the parse configuration
   */
  name: string;

  /**
   * LlamaParseParameters configuration
   */
  parameters: PipelinesAPI.LlamaParseParameters;

  /**
   * ID of the source
   */
  source_id: string;

  /**
   * Type of the source (e.g., 'project')
   */
  source_type: string;

  /**
   * Last update timestamp
   */
  updated_at: string;

  /**
   * Version of the configuration
   */
  version: string;

  /**
   * Creator of the configuration
   */
  creator?: string | null;
}

/**
 * Schema for creating a new parse configuration (API boundary).
 */
export interface ParseConfigurationCreate {
  /**
   * Name of the parse configuration
   */
  name: string;

  /**
   * LlamaParseParameters configuration
   */
  parameters: PipelinesAPI.LlamaParseParameters;

  /**
   * Version of the configuration
   */
  version: string;

  /**
   * Creator of the configuration
   */
  creator?: string | null;

  /**
   * ID of the source
   */
  source_id?: string | null;

  /**
   * Type of the source (e.g., 'project')
   */
  source_type?: string | null;
}

/**
 * Response schema for paginated parse configuration queries.
 */
export interface ParseConfigurationQueryResponse {
  /**
   * The list of items.
   */
  items: Array<ParseConfiguration>;

  /**
   * A token, which can be sent as page_token to retrieve the next page. If this
   * field is omitted, there are no subsequent pages.
   */
  next_page_token?: string | null;

  /**
   * The total number of items available. This is only populated when specifically
   * requested. The value may be an estimate and can be used for display purposes
   * only.
   */
  total_size?: number | null;
}

export interface ParseConfigurationCreateParams {
  /**
   * Body param: Name of the parse configuration
   */
  name: string;

  /**
   * Body param: LlamaParseParameters configuration
   */
  parameters: PipelinesAPI.LlamaParseParameters;

  /**
   * Body param: Version of the configuration
   */
  version: string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;

  /**
   * Body param: Creator of the configuration
   */
  creator?: string | null;

  /**
   * Body param: ID of the source
   */
  source_id?: string | null;

  /**
   * Body param: Type of the source (e.g., 'project')
   */
  source_type?: string | null;
}

export interface ParseConfigurationUpdateParams {
  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;

  /**
   * Body param: Settings that can be configured for how to use LlamaParse to parse
   * files within a LlamaCloud pipeline.
   */
  parameters?: PipelinesAPI.LlamaParseParameters | null;
}

export interface ParseConfigurationListParams extends PaginatedCursorParams {
  creator?: string | null;

  name?: string | null;

  organization_id?: string | null;

  project_id?: string | null;

  version?: string | null;
}

export interface ParseConfigurationDeleteParams {
  organization_id?: string | null;

  project_id?: string | null;
}

export interface ParseConfigurationGetParams {
  organization_id?: string | null;

  project_id?: string | null;
}

export declare namespace ParseConfigurations {
  export {
    type ParseConfiguration as ParseConfiguration,
    type ParseConfigurationCreate as ParseConfigurationCreate,
    type ParseConfigurationQueryResponse as ParseConfigurationQueryResponse,
    type ParseConfigurationsPaginatedCursor as ParseConfigurationsPaginatedCursor,
    type ParseConfigurationCreateParams as ParseConfigurationCreateParams,
    type ParseConfigurationUpdateParams as ParseConfigurationUpdateParams,
    type ParseConfigurationListParams as ParseConfigurationListParams,
    type ParseConfigurationDeleteParams as ParseConfigurationDeleteParams,
    type ParseConfigurationGetParams as ParseConfigurationGetParams,
  };
}
