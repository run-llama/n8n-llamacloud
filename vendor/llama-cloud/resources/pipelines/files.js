"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const headers_1 = require("../../internal/headers.js");
const path_1 = require("../../internal/utils/path.js");
class Files extends resource_1.APIResource {
    /**
     * Add files to a pipeline.
     */
    create(pipelineID, params, options) {
        const { body } = params;
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipelineID}/files`, { body: body, ...options });
    }
    /**
     * Update a file for a pipeline.
     */
    update(fileID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/files/${fileID}`, { body, ...options });
    }
    /**
     * Get files for a pipeline.
     *
     * Args: pipeline_id: ID of the pipeline data_source_id: Optional filter by data
     * source ID only_manually_uploaded: Filter for only manually uploaded files
     * file_name_contains: Optional filter by file name (substring match) limit: Limit
     * number of results offset: Offset for pagination order_by: Field to order by
     *
     * @deprecated
     */
    list(pipelineID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/api/v1/pipelines/${pipelineID}/files2`, (pagination_1.PaginatedPipelineFiles), { query, ...options });
    }
    /**
     * Delete a file from a pipeline.
     */
    delete(fileID, params, options) {
        const { pipeline_id } = params;
        return this._client.delete((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/files/${fileID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get status of a file for a pipeline.
     */
    getStatus(fileID, params, options) {
        const { pipeline_id } = params;
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/files/${fileID}/status`, options);
    }
    /**
     * Get files for a pipeline.
     */
    getStatusCounts(pipelineID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipelineID}/files/status-counts`, { query, ...options });
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map