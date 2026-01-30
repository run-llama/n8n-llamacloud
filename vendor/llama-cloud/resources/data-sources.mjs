// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { buildHeaders } from "../internal/headers.mjs";
import { path } from "../internal/utils/path.mjs";
export class DataSources extends APIResource {
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
        return this._client.put(path `/api/v1/data-sources/${dataSourceID}`, { body, ...options });
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
        return this._client.delete(path `/api/v1/data-sources/${dataSourceID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a data source by ID.
     */
    get(dataSourceID, options) {
        return this._client.get(path `/api/v1/data-sources/${dataSourceID}`, options);
    }
}
//# sourceMappingURL=data-sources.mjs.map