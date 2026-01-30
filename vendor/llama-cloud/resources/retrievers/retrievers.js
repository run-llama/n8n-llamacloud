"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retrievers = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const RetrieverAPI = tslib_1.__importStar(require("./retriever.js"));
const headers_1 = require("../../internal/headers.js");
const path_1 = require("../../internal/utils/path.js");
class Retrievers extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.retriever = new RetrieverAPI.Retriever(this._client);
    }
    /**
     * Create a new Retriever.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/retrievers', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update an existing Retriever.
     */
    update(retrieverID, body, options) {
        return this._client.put((0, path_1.path) `/api/v1/retrievers/${retrieverID}`, { body, ...options });
    }
    /**
     * List Retrievers for a project.
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/retrievers', { query, ...options });
    }
    /**
     * Delete a Retriever by ID.
     */
    delete(retrieverID, options) {
        return this._client.delete((0, path_1.path) `/api/v1/retrievers/${retrieverID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a Retriever by ID.
     */
    get(retrieverID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/retrievers/${retrieverID}`, { query, ...options });
    }
    /**
     * Retrieve data using specified pipelines without creating a persistent retriever.
     */
    search(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/retrievers/retrieve', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Upsert a new Retriever.
     */
    upsert(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.put('/api/v1/retrievers', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.Retrievers = Retrievers;
//# sourceMappingURL=retrievers.js.map