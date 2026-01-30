import { APIResource } from "../../core/resource.js";
import * as PipelinesAPI from "../pipelines/pipelines.js";
import { APIPromise } from "../../core/api-promise.js";
import { RequestOptions } from "../../internal/request-options.js";
export declare class ParseConfigurations extends APIResource {
    /**
     * Update a parse configuration.
     *
     * Args: config_id: The ID of the parse configuration to update config_update:
     * Update data project: Validated project from dependency user: Current user db:
     * Database session
     *
     * Returns: The updated parse configuration
     */
    update(configID: string, params: ParseConfigurationUpdateParams, options?: RequestOptions): APIPromise<ParseConfiguration>;
    /**
     * Delete a parse configuration.
     *
     * Args: config_id: The ID of the parse configuration to delete project: Validated
     * project from dependency user: Current user db: Database session
     */
    delete(configID: string, params?: ParseConfigurationDeleteParams | null | undefined, options?: RequestOptions): APIPromise<void>;
    /**
     * Get a parse configuration by ID.
     *
     * Args: config_id: The ID of the parse configuration project: Validated project
     * from dependency user: Current user db: Database session
     *
     * Returns: The parse configuration
     */
    get(configID: string, query?: ParseConfigurationGetParams | null | undefined, options?: RequestOptions): APIPromise<ParseConfiguration>;
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
    getParseConfigurations(query?: ParseConfigurationGetParseConfigurationsParams | null | undefined, options?: RequestOptions): APIPromise<ParseConfigurationQueryResponse>;
    /**
     * Create a new parse configuration.
     *
     * Args: config_create: Parse configuration creation data project: Validated
     * project from dependency user: Current user db: Database session
     *
     * Returns: The created parse configuration
     */
    parseConfigurations(params: ParseConfigurationParseConfigurationsParams, options?: RequestOptions): APIPromise<ParseConfiguration>;
}
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
export interface ParseConfigurationDeleteParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface ParseConfigurationGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface ParseConfigurationGetParseConfigurationsParams {
    creator?: string | null;
    name?: string | null;
    organization_id?: string | null;
    page_size?: number | null;
    page_token?: string | null;
    project_id?: string | null;
    version?: string | null;
}
export interface ParseConfigurationParseConfigurationsParams {
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
export declare namespace ParseConfigurations {
    export { type ParseConfiguration as ParseConfiguration, type ParseConfigurationCreate as ParseConfigurationCreate, type ParseConfigurationQueryResponse as ParseConfigurationQueryResponse, type ParseConfigurationUpdateParams as ParseConfigurationUpdateParams, type ParseConfigurationDeleteParams as ParseConfigurationDeleteParams, type ParseConfigurationGetParams as ParseConfigurationGetParams, type ParseConfigurationGetParseConfigurationsParams as ParseConfigurationGetParseConfigurationsParams, type ParseConfigurationParseConfigurationsParams as ParseConfigurationParseConfigurationsParams, };
}
//# sourceMappingURL=parse-configurations.d.ts.map