// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { PaginatedPipelineFiles, } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Files extends APIResource {
    /**
     * Add files to a pipeline.
     */
    create(pipelineID, params, options) {
        const { body } = params;
        return this._client.put(path `/api/v1/pipelines/${pipelineID}/files`, { body: body, ...options });
    }
    /**
     * Update a file for a pipeline.
     */
    update(fileID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.put(path `/api/v1/pipelines/${pipeline_id}/files/${fileID}`, { body, ...options });
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
        return this._client.getAPIList(path `/api/v1/pipelines/${pipelineID}/files2`, (PaginatedPipelineFiles), { query, ...options });
    }
    /**
     * Delete a file from a pipeline.
     */
    delete(fileID, params, options) {
        const { pipeline_id } = params;
        return this._client.delete(path `/api/v1/pipelines/${pipeline_id}/files/${fileID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get status of a file for a pipeline.
     */
    getStatus(fileID, params, options) {
        const { pipeline_id } = params;
        return this._client.get(path `/api/v1/pipelines/${pipeline_id}/files/${fileID}/status`, options);
    }
    /**
     * Get files for a pipeline.
     */
    getStatusCounts(pipelineID, query = {}, options) {
        return this._client.get(path `/api/v1/pipelines/${pipelineID}/files/status-counts`, { query, ...options });
    }
}
//# sourceMappingURL=files.mjs.map