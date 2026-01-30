"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sync = void 0;
const resource_1 = require("../../core/resource.js");
const path_1 = require("../../internal/utils/path.js");
class Sync extends resource_1.APIResource {
    /**
     * Run ingestion for the pipeline by incrementally updating the data-sink with
     * upstream changes from data-sources & files.
     */
    create(pipelineID, options) {
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipelineID}/sync`, options);
    }
    /**
     * Cancel Pipeline Sync
     */
    cancel(pipelineID, options) {
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipelineID}/sync/cancel`, options);
    }
}
exports.Sync = Sync;
//# sourceMappingURL=sync.js.map