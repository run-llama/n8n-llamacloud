// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { path } from "../internal/utils/path.mjs";
export class Projects extends APIResource {
    /**
     * List projects or get one by name
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/projects', { query, ...options });
    }
    /**
     * Get a project by ID.
     */
    get(projectID, query = {}, options) {
        return this._client.get(path `/api/v1/projects/${projectID}`, { query, ...options });
    }
}
//# sourceMappingURL=projects.mjs.map