"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const resource_1 = require("../core/resource.js");
const headers_1 = require("../internal/headers.js");
const uploads_1 = require("../internal/uploads.js");
const path_1 = require("../internal/utils/path.js");
class Files extends resource_1.APIResource {
    /**
     * Upload a file using multipart/form-data.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/files', (0, uploads_1.multipartFormRequestOptions)({ query: { organization_id, project_id }, body, ...options }, this._client));
    }
    /**
     * Delete a single file from the project.
     *
     * Args: file_id: The ID of the file to delete project: Validated project from
     * dependency db: Database session
     *
     * Returns: None (204 No Content on success)
     */
    delete(fileID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/api/v1/beta/files/${fileID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Returns a presigned url to read the file content.
     */
    get(fileID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/files/${fileID}/content`, { query, ...options });
    }
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
    query(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/files/query', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map