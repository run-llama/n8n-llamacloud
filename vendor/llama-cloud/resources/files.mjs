// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { buildHeaders } from "../internal/headers.mjs";
import { multipartFormRequestOptions } from "../internal/uploads.mjs";
import { path } from "../internal/utils/path.mjs";
export class Files extends APIResource {
    /**
     * Upload a file using multipart/form-data.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/files', multipartFormRequestOptions({ query: { organization_id, project_id }, body, ...options }, this._client));
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
        return this._client.delete(path `/api/v1/beta/files/${fileID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Returns a presigned url to read the file content.
     */
    get(fileID, query = {}, options) {
        return this._client.get(path `/api/v1/beta/files/${fileID}/content`, { query, ...options });
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
//# sourceMappingURL=files.mjs.map