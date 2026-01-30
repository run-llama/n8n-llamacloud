// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { PaginatedBatchItems } from "../../../core/pagination.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class JobItems extends APIResource {
    /**
     * List items in a batch job with optional status filtering.
     *
     * Useful for finding failed items, viewing completed items, or debugging issues.
     * Results are paginated for performance with configurable limit and offset
     * parameters.
     */
    list(jobID, query = {}, options) {
        return this._client.getAPIList(path `/api/v1/beta/batch-processing/${jobID}/items`, (PaginatedBatchItems), { query, ...options });
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
        return this._client.get(path `/api/v1/beta/batch-processing/items/${itemID}/processing-results`, {
            query,
            ...options,
        });
    }
}
//# sourceMappingURL=job-items.mjs.map