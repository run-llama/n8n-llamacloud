import { APIResource } from "../../../core/resource.js";
import { APIPromise } from "../../../core/api-promise.js";
import { RequestOptions } from "../../../internal/request-options.js";
export declare class Schema extends APIResource {
    /**
     * Generates or refines an extraction agent's schema definition from a file,
     * natural language prompt, or existing schema.
     */
    generateSchema(params: SchemaGenerateSchemaParams, options?: RequestOptions): APIPromise<SchemaGenerateSchemaResponse>;
    /**
     * Validates an extraction agent's schema definition. Returns the normalized and
     * validated schema if valid, otherwise raises an HTTP 400.
     */
    validateSchema(body: SchemaValidateSchemaParams, options?: RequestOptions): APIPromise<SchemaValidateSchemaResponse>;
}
/**
 * Response schema for schema generation.
 */
export interface SchemaGenerateSchemaResponse {
    /**
     * The generated JSON schema
     */
    data_schema: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    };
}
/**
 * Response schema for schema validation.
 */
export interface SchemaValidateSchemaResponse {
    data_schema: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    };
}
export interface SchemaGenerateSchemaParams {
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Optional schema to validate, refine, or extend during generation
     */
    data_schema?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | string | null;
    /**
     * Body param: Optional file ID to analyze for schema generation
     */
    file_id?: string | null;
    /**
     * Body param: Natural language description of the data structure to extract
     */
    prompt?: string | null;
}
export interface SchemaValidateSchemaParams {
    data_schema: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | string;
}
export declare namespace Schema {
    export { type SchemaGenerateSchemaResponse as SchemaGenerateSchemaResponse, type SchemaValidateSchemaResponse as SchemaValidateSchemaResponse, type SchemaGenerateSchemaParams as SchemaGenerateSchemaParams, type SchemaValidateSchemaParams as SchemaValidateSchemaParams, };
}
//# sourceMappingURL=schema.d.ts.map