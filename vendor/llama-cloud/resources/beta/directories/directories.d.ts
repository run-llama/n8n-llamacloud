import { APIResource } from "../../../core/resource.js";
import * as FilesAPI from "./files.js";
import { FileAddParams, FileAddResponse, FileDeleteParams, FileGetParams, FileGetResponse, FileListParams, FileListResponse, FileListResponsesPaginatedClassifyJobs, FileUpdateParams, FileUpdateResponse, FileUploadParams, FileUploadResponse, Files } from "./files.js";
import { APIPromise } from "../../../core/api-promise.js";
import { PagePromise, PaginatedClassifyJobs, type PaginatedClassifyJobsParams } from "../../../core/pagination.js";
import { RequestOptions } from "../../../internal/request-options.js";
export declare class Directories extends APIResource {
    files: FilesAPI.Files;
    /**
     * Create a new directory within the specified project.
     *
     * If data_source_id is provided, validates that the data source exists and belongs
     * to the same project.
     */
    create(params: DirectoryCreateParams, options?: RequestOptions): APIPromise<DirectoryCreateResponse>;
    /**
     * Update directory metadata.
     */
    update(directoryID: string, params: DirectoryUpdateParams, options?: RequestOptions): APIPromise<DirectoryUpdateResponse>;
    /**
     * List Directories
     */
    list(query?: DirectoryListParams | null | undefined, options?: RequestOptions): PagePromise<DirectoryListResponsesPaginatedClassifyJobs, DirectoryListResponse>;
    /**
     * Permanently delete a directory.
     */
    delete(directoryID: string, params?: DirectoryDeleteParams | null | undefined, options?: RequestOptions): APIPromise<void>;
    /**
     * Retrieve a directory by its identifier.
     */
    get(directoryID: string, query?: DirectoryGetParams | null | undefined, options?: RequestOptions): APIPromise<DirectoryGetResponse>;
}
export type DirectoryListResponsesPaginatedClassifyJobs = PaginatedClassifyJobs<DirectoryListResponse>;
/**
 * API response schema for a directory.
 */
export interface DirectoryCreateResponse {
    /**
     * Unique identifier for the directory.
     */
    id: string;
    /**
     * Human-readable name for the directory.
     */
    name: string;
    /**
     * Project the directory belongs to.
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Optional data source id the directory syncs from. Null if just manual uploads.
     */
    data_source_id?: string | null;
    /**
     * Optional timestamp of when the directory was deleted. Null if not deleted.
     */
    deleted_at?: string | null;
    /**
     * Optional description shown to users.
     */
    description?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * API response schema for a directory.
 */
export interface DirectoryUpdateResponse {
    /**
     * Unique identifier for the directory.
     */
    id: string;
    /**
     * Human-readable name for the directory.
     */
    name: string;
    /**
     * Project the directory belongs to.
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Optional data source id the directory syncs from. Null if just manual uploads.
     */
    data_source_id?: string | null;
    /**
     * Optional timestamp of when the directory was deleted. Null if not deleted.
     */
    deleted_at?: string | null;
    /**
     * Optional description shown to users.
     */
    description?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * API response schema for a directory.
 */
export interface DirectoryListResponse {
    /**
     * Unique identifier for the directory.
     */
    id: string;
    /**
     * Human-readable name for the directory.
     */
    name: string;
    /**
     * Project the directory belongs to.
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Optional data source id the directory syncs from. Null if just manual uploads.
     */
    data_source_id?: string | null;
    /**
     * Optional timestamp of when the directory was deleted. Null if not deleted.
     */
    deleted_at?: string | null;
    /**
     * Optional description shown to users.
     */
    description?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * API response schema for a directory.
 */
export interface DirectoryGetResponse {
    /**
     * Unique identifier for the directory.
     */
    id: string;
    /**
     * Human-readable name for the directory.
     */
    name: string;
    /**
     * Project the directory belongs to.
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Optional data source id the directory syncs from. Null if just manual uploads.
     */
    data_source_id?: string | null;
    /**
     * Optional timestamp of when the directory was deleted. Null if not deleted.
     */
    deleted_at?: string | null;
    /**
     * Optional description shown to users.
     */
    description?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export interface DirectoryCreateParams {
    /**
     * Body param: Human-readable name for the directory.
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
    /**
     * Body param: Optional data source id the directory syncs from.
     */
    data_source_id?: string | null;
    /**
     * Body param: Optional description shown to users.
     */
    description?: string | null;
}
export interface DirectoryUpdateParams {
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Updated description for the directory.
     */
    description?: string | null;
    /**
     * Body param: Updated name for the directory.
     */
    name?: string | null;
}
export interface DirectoryListParams extends PaginatedClassifyJobsParams {
    data_source_id?: string | null;
    include_deleted?: boolean;
    name?: string | null;
    organization_id?: string | null;
    project_id?: string | null;
}
export interface DirectoryDeleteParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface DirectoryGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Directories {
    export { type DirectoryCreateResponse as DirectoryCreateResponse, type DirectoryUpdateResponse as DirectoryUpdateResponse, type DirectoryListResponse as DirectoryListResponse, type DirectoryGetResponse as DirectoryGetResponse, type DirectoryListResponsesPaginatedClassifyJobs as DirectoryListResponsesPaginatedClassifyJobs, type DirectoryCreateParams as DirectoryCreateParams, type DirectoryUpdateParams as DirectoryUpdateParams, type DirectoryListParams as DirectoryListParams, type DirectoryDeleteParams as DirectoryDeleteParams, type DirectoryGetParams as DirectoryGetParams, };
    export { Files as Files, type FileUpdateResponse as FileUpdateResponse, type FileListResponse as FileListResponse, type FileAddResponse as FileAddResponse, type FileGetResponse as FileGetResponse, type FileUploadResponse as FileUploadResponse, type FileListResponsesPaginatedClassifyJobs as FileListResponsesPaginatedClassifyJobs, type FileUpdateParams as FileUpdateParams, type FileListParams as FileListParams, type FileDeleteParams as FileDeleteParams, type FileAddParams as FileAddParams, type FileGetParams as FileGetParams, type FileUploadParams as FileUploadParams, };
}
//# sourceMappingURL=directories.d.ts.map