// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Sync extends APIResource {
    /**
     * Run ingestion for the pipeline by incrementally updating the data-sink with
     * upstream changes from data-sources & files.
     */
    create(pipelineID, options) {
        return this._client.post(path `/api/v1/pipelines/${pipelineID}/sync`, options);
    }
    /**
     * Cancel Pipeline Sync
     */
    cancel(pipelineID, options) {
        return this._client.post(path `/api/v1/pipelines/${pipelineID}/sync/cancel`, options);
    }
}
//# sourceMappingURL=sync.mjs.map