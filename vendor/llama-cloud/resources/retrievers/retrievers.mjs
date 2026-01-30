// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as RetrieverAPI from "./retriever.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Retrievers extends APIResource {
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
        return this._client.put(path `/api/v1/retrievers/${retrieverID}`, { body, ...options });
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
        return this._client.delete(path `/api/v1/retrievers/${retrieverID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a Retriever by ID.
     */
    get(retrieverID, query = {}, options) {
        return this._client.get(path `/api/v1/retrievers/${retrieverID}`, { query, ...options });
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
//# sourceMappingURL=retrievers.mjs.map