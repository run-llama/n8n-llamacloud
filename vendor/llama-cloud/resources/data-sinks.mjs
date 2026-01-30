// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { buildHeaders } from "../internal/headers.mjs";
import { path } from "../internal/utils/path.mjs";
export class DataSinks extends APIResource {
    /**
     * Create a new data sink.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/data-sinks', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update a data sink by ID.
     */
    update(dataSinkID, body, options) {
        return this._client.put(path `/api/v1/data-sinks/${dataSinkID}`, { body, ...options });
    }
    /**
     * List data sinks for a given project.
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/data-sinks', { query, ...options });
    }
    /**
     * Delete a data sink by ID.
     */
    delete(dataSinkID, options) {
        return this._client.delete(path `/api/v1/data-sinks/${dataSinkID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a data sink by ID.
     */
    get(dataSinkID, options) {
        return this._client.get(path `/api/v1/data-sinks/${dataSinkID}`, options);
    }
}
//# sourceMappingURL=data-sinks.mjs.map