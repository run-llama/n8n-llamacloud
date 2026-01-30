"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Documents = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const headers_1 = require("../../internal/headers.js");
const path_1 = require("../../internal/utils/path.js");
class Documents extends resource_1.APIResource {
    /**
     * Batch create documents for a pipeline.
     */
    create(pipelineID, params, options) {
        const { body } = params;
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
    }
    /**
     * Return a list of documents for a pipeline.
     */
    list(pipelineID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/api/v1/pipelines/${pipelineID}/documents/paginated`, (pagination_1.PaginatedCloudDocuments), { query, ...options });
    }
    /**
     * Delete a document from a pipeline. Initiates an async job that will:
     *
     * 1. Delete vectors from the vector store
     * 2. Delete the document from MongoDB after vectors are successfully deleted
     */
    delete(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.delete((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Return a single document for a pipeline.
     */
    get(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/documents/${documentID}`, options);
    }
    /**
     * Return a list of chunks for a pipeline document.
     */
    getChunks(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/chunks`, options);
    }
    /**
     * Return a single document for a pipeline.
     */
    getStatus(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/status`, options);
    }
    /**
     * Sync a specific document for a pipeline.
     */
    sync(documentID, params, options) {
        const { pipeline_id } = params;
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/documents/${documentID}/sync`, options);
    }
    /**
     * Batch create or update a document for a pipeline.
     */
    upsert(pipelineID, params, options) {
        const { body } = params;
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipelineID}/documents`, { body: body, ...options });
    }
}
exports.Documents = Documents;
//# sourceMappingURL=documents.js.map