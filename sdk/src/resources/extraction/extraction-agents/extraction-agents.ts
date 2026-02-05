// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as RunsAPI from '../runs';
import * as SchemaAPI from './schema';
import {
  Schema,
  SchemaGenerateSchemaParams,
  SchemaGenerateSchemaResponse,
  SchemaValidateSchemaParams,
  SchemaValidateSchemaResponse,
} from './schema';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class ExtractionAgents extends APIResource {
  schema: SchemaAPI.Schema = new SchemaAPI.Schema(this._client);

  /**
   * Create Extraction Agent
   */
  create(params: ExtractionAgentCreateParams, options?: RequestOptions): APIPromise<ExtractAgent> {
    const { organization_id, project_id, ...body } = params;
    return this._client.post('/api/v1/extraction/extraction-agents', {
      query: { organization_id, project_id },
      body,
      ...options,
    });
  }

  /**
   * Update Extraction Agent
   */
  update(
    extractionAgentID: string,
    body: ExtractionAgentUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ExtractAgent> {
    return this._client.put(path`/api/v1/extraction/extraction-agents/${extractionAgentID}`, {
      body,
      ...options,
    });
  }

  /**
   * List Extraction Agents
   */
  list(
    query: ExtractionAgentListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ExtractionAgentListResponse> {
    return this._client.get('/api/v1/extraction/extraction-agents', { query, ...options });
  }

  /**
   * Delete Extraction Agent
   */
  delete(extractionAgentID: string, options?: RequestOptions): APIPromise<unknown> {
    return this._client.delete(path`/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
  }

  /**
   * Get Extraction Agent
   */
  get(extractionAgentID: string, options?: RequestOptions): APIPromise<ExtractAgent> {
    return this._client.get(path`/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
  }
}

/**
 * Schema and configuration for an extraction agent.
 */
export interface ExtractAgent {
  /**
   * The id of the extraction agent.
   */
  id: string;

  /**
   * The configuration parameters for the extraction agent.
   */
  config: RunsAPI.ExtractConfig;

  /**
   * The schema of the data.
   */
  data_schema: {
    [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null;
  };

  /**
   * The name of the extraction agent.
   */
  name: string;

  /**
   * The ID of the project that the extraction agent belongs to.
   */
  project_id: string;

  /**
   * The creation time of the extraction agent.
   */
  created_at?: string | null;

  /**
   * Custom configuration type for the extraction agent. Currently supports
   * 'default'.
   */
  custom_configuration?: 'default' | null;

  /**
   * The last update time of the extraction agent.
   */
  updated_at?: string | null;
}

export type ExtractionAgentListResponse = Array<ExtractAgent>;

export type ExtractionAgentDeleteResponse = unknown;

export interface ExtractionAgentCreateParams {
  /**
   * Body param: The configuration parameters for the extraction agent.
   */
  config: RunsAPI.ExtractConfig;

  /**
   * Body param: The schema of the data.
   */
  data_schema:
    | { [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null }
    | string;

  /**
   * Body param: The name of the extraction schema
   */
  name: string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;
}

export interface ExtractionAgentUpdateParams {
  /**
   * The configuration parameters for the extraction agent.
   */
  config: RunsAPI.ExtractConfig;

  /**
   * The schema of the data
   */
  data_schema:
    | { [key: string]: { [key: string]: unknown } | Array<unknown> | string | number | boolean | null }
    | string;
}

export interface ExtractionAgentListParams {
  /**
   * Whether to include default agents in the results
   */
  include_default?: boolean;

  organization_id?: string | null;

  project_id?: string | null;
}

ExtractionAgents.Schema = Schema;

export declare namespace ExtractionAgents {
  export {
    type ExtractAgent as ExtractAgent,
    type ExtractionAgentListResponse as ExtractionAgentListResponse,
    type ExtractionAgentDeleteResponse as ExtractionAgentDeleteResponse,
    type ExtractionAgentCreateParams as ExtractionAgentCreateParams,
    type ExtractionAgentUpdateParams as ExtractionAgentUpdateParams,
    type ExtractionAgentListParams as ExtractionAgentListParams,
  };

  export {
    Schema as Schema,
    type SchemaGenerateSchemaResponse as SchemaGenerateSchemaResponse,
    type SchemaValidateSchemaResponse as SchemaValidateSchemaResponse,
    type SchemaGenerateSchemaParams as SchemaGenerateSchemaParams,
    type SchemaValidateSchemaParams as SchemaValidateSchemaParams,
  };
}
