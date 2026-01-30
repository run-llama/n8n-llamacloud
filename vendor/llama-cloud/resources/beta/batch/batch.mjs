// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as JobItemsAPI from "./job-items.mjs";
import { JobItems, } from "./job-items.mjs";
import { PaginatedBatchItems } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Batch extends APIResource {
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
            headers: buildHeaders([
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
        return this._client.getAPIList('/api/v1/beta/batch-processing', (PaginatedBatchItems), {
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
        return this._client.post(path `/api/v1/beta/batch-processing/${jobID}/cancel`, {
            query: { organization_id, project_id },
            body,
            ...options,
            headers: buildHeaders([
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
        return this._client.get(path `/api/v1/beta/batch-processing/${jobID}`, { query, ...options });
    }
}
Batch.JobItems = JobItems;
//# sourceMappingURL=batch.mjs.map