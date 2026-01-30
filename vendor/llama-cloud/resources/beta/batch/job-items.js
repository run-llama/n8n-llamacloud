"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobItems = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const path_1 = require("../../../internal/utils/path.js");
class JobItems extends resource_1.APIResource {
    /**
     * List items in a batch job with optional status filtering.
     *
     * Useful for finding failed items, viewing completed items, or debugging issues.
     * Results are paginated for performance with configurable limit and offset
     * parameters.
     */
    list(jobID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/api/v1/beta/batch-processing/${jobID}/items`, (pagination_1.PaginatedBatchItems), { query, ...options });
    }
    /**
     * Get all processing results for a specific item (lineage query).
     *
     * Shows complete processing history including what operations have been performed,
     * with what parameters, and where outputs are stored. Useful for understanding
     * what processing has already been done to avoid redundant work. Optionally filter
     * by job type to see only specific processing operations.
     */
    getProcessingResults(itemID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/batch-processing/items/${itemID}/processing-results`, {
            query,
            ...options,
        });
    }
}
exports.JobItems = JobItems;
//# sourceMappingURL=job-items.js.map