"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const headers_1 = require("../../../internal/headers.js");
const uploads_1 = require("../../../internal/uploads.js");
const path_1 = require("../../../internal/utils/path.js");
class Files extends resource_1.APIResource {
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
        return this._client.patch((0, path_1.path) `/api/v1/beta/directories/${path_directory_id}/files/${directoryFileID}`, {
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
        return this._client.getAPIList((0, path_1.path) `/api/v1/beta/directories/${directoryID}/files`, (pagination_1.PaginatedClassifyJobs), { query, ...options });
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
        return this._client.delete((0, path_1.path) `/api/v1/beta/directories/${directory_id}/files/${directoryFileID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
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
        return this._client.post((0, path_1.path) `/api/v1/beta/directories/${directoryID}/files`, {
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
        return this._client.get((0, path_1.path) `/api/v1/beta/directories/${directory_id}/files/${directoryFileID}`, {
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
        return this._client.post((0, path_1.path) `/api/v1/beta/directories/${directoryID}/files/upload`, (0, uploads_1.multipartFormRequestOptions)({ query: { organization_id, project_id }, body, ...options }, this._client));
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map