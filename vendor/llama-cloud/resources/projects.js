"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projects = void 0;
const resource_1 = require("../core/resource.js");
const path_1 = require("../internal/utils/path.js");
class Projects extends resource_1.APIResource {
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
        return this._client.get((0, path_1.path) `/api/v1/projects/${projectID}`, { query, ...options });
    }
}
exports.Projects = Projects;
//# sourceMappingURL=projects.js.map