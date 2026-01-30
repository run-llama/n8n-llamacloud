import { APIResource } from "../core/resource.js";
import { APIPromise } from "../core/api-promise.js";
import { type Uploadable } from "../core/uploads.js";
import { RequestOptions } from "../internal/request-options.js";
export declare class Files extends APIResource {
    /**
     * Upload a file using multipart/form-data.
     */
    create(params: FileCreateParams, options?: RequestOptions): APIPromise<FileCreateResponse>;
    /**
     * Delete a single file from the project.
     *
     * Args: file_id: The ID of the file to delete project: Validated project from
     * dependency db: Database session
     *
     * Returns: None (204 No Content on success)
     */
    delete(fileID: string, params?: FileDeleteParams | null | undefined, options?: RequestOptions): APIPromise<void>;
    /**
     * Returns a presigned url to read the file content.
     */
    get(fileID: string, query?: FileGetParams | null | undefined, options?: RequestOptions): APIPromise<PresignedURL>;
    /**
     * Query files with flexible filtering and pagination.
     *
     * **Deprecated**: Use GET /files instead for listing files with query parameters.
     *
     * Args: request: The query request with filters and pagination project: Validated
     * project from dependency db: Database session
     *
     * Returns: Paginated response with files
     *
     * @deprecated
     */
    query(params: FileQueryParams, options?: RequestOptions): APIPromise<FileQueryResponse>;
}
/**
 * Schema for a file.
 */
export interface File {
    /**
     * Unique identifier
     */
    id: string;
    name: string;
    /**
     * The ID of the project that the file belongs to
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * The ID of the data source that the file belongs to
     */
    data_source_id?: string | null;
    /**
     * The expiration date for the file. Files past this date can be deleted.
     */
    expires_at?: string | null;
    /**
     * The ID of the file in the external system
     */
    external_file_id?: string | null;
    /**
     * Size of the file in bytes
     */
    file_size?: number | null;
    /**
     * File type (e.g. pdf, docx, etc.)
     */
    file_type?: string | null;
    /**
     * The last modified time of the file
     */
    last_modified_at?: string | null;
    /**
     * Permission information for the file
     */
    permission_info?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * The intended purpose of the file (e.g., 'user_data', 'parse', 'extract',
     * 'split', 'classify')
     */
    purpose?: string | null;
    /**
     * Resource information for the file
     */
    resource_info?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * Schema for creating a file.
 */
export interface FileCreate {
    /**
     * Name that will be used for created file. If possible, always include the file
     * extension in the name.
     */
    name: string;
    /**
     * The ID of the data source that the file belongs to
     */
    data_source_id?: string | null;
    /**
     * The ID of the file in the external system
     */
    external_file_id?: string | null;
    /**
     * Size of the file in bytes
     */
    file_size?: number | null;
    /**
     * The last modified time of the file
     */
    last_modified_at?: string | null;
    /**
     * Permission information for the file
     */
    permission_info?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Resource information for the file
     */
    resource_info?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Storage type for the file. Valid values: 'Ephemeral', 'Permanent' (no
     * expiration). If not specified, defaults to permanent storage.
     */
    storage_type?: 'ephemeral' | 'permanent' | (string & {});
}
/**
 * Schema for a presigned URL.
 */
export interface PresignedURL {
    /**
     * The time at which the presigned URL expires
     */
    expires_at: string;
    /**
     * A presigned URL for IO operations against a private file
     */
    url: string;
    /**
     * Form fields for a presigned POST request
     */
    form_fields?: {
        [key: string]: string;
    } | null;
}
/**
 * Schema for a file in the v2 API.
 */
export interface FileCreateResponse {
    /**
     * Unique identifier
     */
    id: string;
    name: string;
    /**
     * The ID of the project that the file belongs to
     */
    project_id: string;
    /**
     * The expiration date for the file. Files past this date can be deleted.
     */
    expires_at?: string | null;
    /**
     * The ID of the file in the external system
     */
    external_file_id?: string | null;
    /**
     * File type (e.g. pdf, docx, etc.)
     */
    file_type?: string | null;
    /**
     * The last modified time of the file
     */
    last_modified_at?: string | null;
    /**
     * The intended purpose of the file (e.g., 'user_data', 'parse', 'extract',
     * 'split', 'classify', 'sheet')
     */
    purpose?: string | null;
}
/**
 * Response schema for paginated file queries in V2 API.
 */
export interface FileQueryResponse {
    /**
     * The list of items.
     */
    items: Array<FileQueryResponse.Item>;
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
export declare namespace FileQueryResponse {
    /**
     * Schema for a file in the v2 API.
     */
    interface Item {
        /**
         * Unique identifier
         */
        id: string;
        name: string;
        /**
         * The ID of the project that the file belongs to
         */
        project_id: string;
        /**
         * The expiration date for the file. Files past this date can be deleted.
         */
        expires_at?: string | null;
        /**
         * The ID of the file in the external system
         */
        external_file_id?: string | null;
        /**
         * File type (e.g. pdf, docx, etc.)
         */
        file_type?: string | null;
        /**
         * The last modified time of the file
         */
        last_modified_at?: string | null;
        /**
         * The intended purpose of the file (e.g., 'user_data', 'parse', 'extract',
         * 'split', 'classify', 'sheet')
         */
        purpose?: string | null;
    }
}
export interface FileCreateParams {
    /**
     * Body param: The file to upload
     */
    file: Uploadable;
    /**
     * Body param: The intended purpose of the file. Valid values: 'user_data',
     * 'parse', 'extract', 'split', 'classify', 'sheet'
     */
    purpose: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The ID of the file in the external system
     */
    external_file_id?: string | null;
}
export interface FileDeleteParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface FileGetParams {
    expires_at_seconds?: number | null;
    organization_id?: string | null;
    project_id?: string | null;
}
export interface FileQueryParams {
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Filter parameters for file queries.
     */
    filter?: FileQueryParams.Filter | null;
    /**
     * Body param: A comma-separated list of fields to order by, sorted in ascending
     * order. Use 'field_name desc' to specify descending order.
     */
    order_by?: string | null;
    /**
     * Body param: The maximum number of items to return. The service may return fewer
     * than this value. If unspecified, a default page size will be used. The maximum
     * value is typically 1000; values above this will be coerced to the maximum.
     */
    page_size?: number | null;
    /**
     * Body param: A page token, received from a previous list call. Provide this to
     * retrieve the subsequent page.
     */
    page_token?: string | null;
}
export declare namespace FileQueryParams {
    /**
     * Filter parameters for file queries.
     */
    interface Filter {
        /**
         * Filter by data source ID
         */
        data_source_id?: string | null;
        /**
         * Filter by external file ID
         */
        external_file_id?: string | null;
        /**
         * Filter by specific file IDs
         */
        file_ids?: Array<string> | null;
        /**
         * Filter by file name
         */
        file_name?: string | null;
        /**
         * Filter only manually uploaded files (data_source_id is null)
         */
        only_manually_uploaded?: boolean | null;
        /**
         * Filter by project ID
         */
        project_id?: string | null;
    }
}
export declare namespace Files {
    export { type File as File, type FileCreate as FileCreate, type PresignedURL as PresignedURL, type FileCreateResponse as FileCreateResponse, type FileQueryResponse as FileQueryResponse, type FileCreateParams as FileCreateParams, type FileDeleteParams as FileDeleteParams, type FileGetParams as FileGetParams, type FileQueryParams as FileQueryParams, };
}
//# sourceMappingURL=files.d.ts.map