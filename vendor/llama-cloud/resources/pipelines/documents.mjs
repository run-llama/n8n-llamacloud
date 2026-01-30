// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { PaginatedCloudDocuments, } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Documents extends APIResource {
    /**
     * Batch create documents for a pipeline.
     */
    create(pipelineID, params, options) {
        const { body } = params;
        return this._client.post(path `/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
    }
    /**
     * Return a list of documents for a pipeline.
     */
    list(pipelineID, query = {}, options) {
        return this._client.getAPIList(path `/api/v1/pipelines/${pipelineID}/documents/paginated`, (PaginatedCloudDocuments), { query, ...options });
    }
    /**
     * Delete a document from a pipeline. Initiates an async job that will:
     *
     * 1. Delete vectors from the vector store
     * 2. Delete the document from MongoDB after vectors are successfully deleted
     */
    delete(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.delete(path `/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Return a single document for a pipeline.
     */
    get(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get(path `/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, options);
    }
    /**
     * Return a list of chunks for a pipeline document.
     */
    getChunks(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get(path `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/chunks`, options);
    }
    /**
     * Return a single document for a pipeline.
     */
    getStatus(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get(path `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/status`, options);
    }
    /**
     * Sync a specific document for a pipeline.
     */
    sync(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.post(path `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/sync`, options);
    }
    /**
     * Batch create or update a document for a pipeline.
     */
    upsert(pipelineID, params, options) {
        const { body } = params;
        return this._client.put(path `/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
    }
}
//# sourceMappingURL=documents.mjs.map