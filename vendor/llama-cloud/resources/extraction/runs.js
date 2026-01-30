"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runs = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const path_1 = require("../../internal/utils/path.js");
class Runs extends resource_1.APIResource {
    /**
     * List Extract Runs
     */
    list(query, options) {
        return this._client.getAPIList('/api/v1/extraction/runs', (pagination_1.PaginatedExtractRuns), {
            query,
            ...options,
        });
    }
    /**
     * Delete Extraction Run
     */
    delete(runID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/api/v1/extraction/runs/${runID}`, {
            query: { organization_id, project_id },
            ...options,
        });
    }
    /**
     * Get Run
     */
    get(runID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/extraction/runs/${runID}`, { query, ...options });
    }
    /**
     * Get Run By Job Id
     */
    getByJob(jobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/extraction/runs/by-job/${jobID}`, { query, ...options });
    }
}
exports.Runs = Runs;
//# sourceMappingURL=runs.js.map