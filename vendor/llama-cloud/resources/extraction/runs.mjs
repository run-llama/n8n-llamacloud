// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { PaginatedExtractRuns } from "../../core/pagination.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Runs extends APIResource {
    /**
     * List Extract Runs
     */
    list(query, options) {
        return this._client.getAPIList('/api/v1/extraction/runs', (PaginatedExtractRuns), {
            query,
            ...options,
        });
    }
    /**
     * Delete Extraction Run
     */
    delete(runID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete(path `/api/v1/extraction/runs/${runID}`, {
            query: { organization_id, project_id },
            ...options,
        });
    }
    /**
     * Get Run
     */
    get(runID, query = {}, options) {
        return this._client.get(path `/api/v1/extraction/runs/${runID}`, { query, ...options });
    }
    /**
     * Get Run By Job Id
     */
    getByJob(jobID, query = {}, options) {
        return this._client.get(path `/api/v1/extraction/runs/by-job/${jobID}`, { query, ...options });
    }
}
//# sourceMappingURL=runs.mjs.map