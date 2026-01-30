"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSources = void 0;
const resource_1 = require("../core/resource.js");
const headers_1 = require("../internal/headers.js");
const path_1 = require("../internal/utils/path.js");
class DataSources extends resource_1.APIResource {
    /**
     * Create a new data source.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/data-sources', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update a data source by ID.
     */
    update(dataSourceID, body, options) {
        return this._client.put((0, path_1.path) `/api/v1/data-sources/${dataSourceID}`, { body, ...options });
    }
    /**
     * List data sources for a given project. If project_id is not provided, uses the
     * default project.
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/data-sources', { query, ...options });
    }
    /**
     * Delete a data source by ID.
     */
    delete(dataSourceID, options) {
        return this._client.delete((0, path_1.path) `/api/v1/data-sources/${dataSourceID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a data source by ID.
     */
    get(dataSourceID, options) {
        return this._client.get((0, path_1.path) `/api/v1/data-sources/${dataSourceID}`, options);
    }
}
exports.DataSources = DataSources;
//# sourceMappingURL=data-sources.js.map