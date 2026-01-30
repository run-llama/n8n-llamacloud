"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const tslib_1 = require("../../../internal/tslib.js");
const resource_1 = require("../../../core/resource.js");
const JobItemsAPI = tslib_1.__importStar(require("./job-items.js"));
const job_items_1 = require("./job-items.js");
const pagination_1 = require("../../../core/pagination.js");
const headers_1 = require("../../../internal/headers.js");
const path_1 = require("../../../internal/utils/path.js");
class Batch extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.jobItems = new JobItemsAPI.JobItems(this._client);
    }
    /**
     * Create a new batch processing job for a directory.
     *
     * Processes all files in the specified directory according to the job
     * configuration. The job runs asynchronously and you can monitor progress using
     * the job status endpoint.
     */
    create(params, options) {
        const { organization_id, project_id, 'temporal-namespace': temporalNamespace, ...body } = params;
        return this._client.post('/api/v1/beta/batch-processing', {
            query: { organization_id, project_id },
            body,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(temporalNamespace != null ? { 'temporal-namespace': temporalNamespace } : undefined) },
                options?.headers,
            ]),
        });
    }
    /**
     * List all batch processing jobs for a project with optional filtering.
     *
     * Returns a paginated list of batch jobs with filters for directory, job type, and
     * status. Useful for viewing job history, monitoring progress, and finding
     * specific jobs.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/beta/batch-processing', (pagination_1.PaginatedBatchItems), {
            query,
            ...options,
        });
    }
    /**
     * Cancel a running batch processing job.
     *
     * Stops processing and marks all pending items as cancelled. Items currently being
     * processed may complete depending on their state.
     */
    cancel(jobID, params, options) {
        const { organization_id, project_id, 'temporal-namespace': temporalNamespace, ...body } = params;
        return this._client.post((0, path_1.path) `/api/v1/beta/batch-processing/${jobID}/cancel`, {
            query: { organization_id, project_id },
            body,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(temporalNamespace != null ? { 'temporal-namespace': temporalNamespace } : undefined) },
                options?.headers,
            ]),
        });
    }
    /**
     * Get detailed status of a batch processing job.
     *
     * Returns current progress, file counts, and estimated completion time.
     */
    getStatus(jobID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/batch-processing/${jobID}`, { query, ...options });
    }
}
exports.Batch = Batch;
Batch.JobItems = job_items_1.JobItems;
//# sourceMappingURL=batch.js.map