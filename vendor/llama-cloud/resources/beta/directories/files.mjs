// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { PaginatedClassifyJobs, } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { multipartFormRequestOptions } from "../../../internal/uploads.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Files extends APIResource {
    /**
     * Update file metadata within the specified directory.
     *
     * Supports moving files to a different directory by setting directory_id.
     *
     * Note: This endpoint uses directory_file_id (the internal ID). If you're trying
     * to update a file by its unique_id, use the list endpoint with a filter to find
     * the directory_file_id first.
     */
    update(directoryFileID, params, options) {
        const { path_directory_id, organization_id, project_id, ...body } = params;
        return this._client.patch(path `/api/v1/beta/directories/${path_directory_id}/files/${directoryFileID}`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List all files within the specified directory with optional filtering and
     * pagination.
     */
    list(directoryID, query = {}, options) {
        return this._client.getAPIList(path `/api/v1/beta/directories/${directoryID}/files`, (PaginatedClassifyJobs), { query, ...options });
    }
    /**
     * Delete a file from the specified directory.
     *
     * Note: This endpoint uses directory_file_id (the internal ID). If you're trying
     * to delete a file by its unique_id, use the list endpoint with a filter to find
     * the directory_file_id first.
     */
    delete(directoryFileID, params, options) {
        const { directory_id, organization_id, project_id } = params;
        return this._client.delete(path `/api/v1/beta/directories/${directory_id}/files/${directoryFileID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Create a new file within the specified directory.
     *
     * The directory must exist and belong to the project passed in. The file_id must
     * be provided and exist in the project.
     */
    add(directoryID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post(path `/api/v1/beta/directories/${directoryID}/files`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Get a file by its directory_file_id within the specified directory. If you're
     * trying to get a file by its unique_id, use the list endpoint with a filter
     * instead.
     */
    get(directoryFileID, params, options) {
        const { directory_id, ...query } = params;
        return this._client.get(path `/api/v1/beta/directories/${directory_id}/files/${directoryFileID}`, {
            query,
            ...options,
        });
    }
    /**
     * Upload a file directly to a directory.
     *
     * Uploads a file and creates a directory file entry in a single operation. If
     * unique_id or display_name are not provided, they will be derived from the file
     * metadata.
     */
    upload(directoryID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post(path `/api/v1/beta/directories/${directoryID}/files/upload`, multipartFormRequestOptions({ query: { organization_id, project_id }, body, ...options }, this._client));
    }
}
//# sourceMappingURL=files.mjs.map