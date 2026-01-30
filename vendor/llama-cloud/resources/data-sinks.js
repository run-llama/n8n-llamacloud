"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSinks = void 0;
const resource_1 = require("../core/resource.js");
const headers_1 = require("../internal/headers.js");
const path_1 = require("../internal/utils/path.js");
class DataSinks extends resource_1.APIResource {
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
        return this._client.put((0, path_1.path) `/api/v1/data-sinks/${dataSinkID}`, { body, ...options });
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
        return this._client.delete((0, path_1.path) `/api/v1/data-sinks/${dataSinkID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a data sink by ID.
     */
    get(dataSinkID, options) {
        return this._client.get((0, path_1.path) `/api/v1/data-sinks/${dataSinkID}`, options);
    }
}
exports.DataSinks = DataSinks;
//# sourceMappingURL=data-sinks.js.map