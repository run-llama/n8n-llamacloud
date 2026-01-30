"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSources = void 0;
const resource_1 = require("../../core/resource.js");
const path_1 = require("../../internal/utils/path.js");
class DataSources extends resource_1.APIResource {
    /**
     * Update the configuration of a data source in a pipeline.
     */
    update(dataSourceID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}`, {
            body,
            ...options,
        });
    }
    /**
     * Get data sources for a pipeline.
     */
    getDataSources(pipelineID, options) {
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipelineID}/data-sources`, options);
    }
    /**
     * Get the status of a data source for a pipeline.
     */
    getStatus(dataSourceID, params, options) {
        const { pipeline_id } = params;
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/status`, options);
    }
    /**
     * Run ingestion for the pipeline data source by incrementally updating the
     * data-sink with upstream changes from data-source.
     */
    sync(dataSourceID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/sync`, {
            body,
            ...options,
        });
    }
    /**
     * Add data sources to a pipeline.
     */
    updateDataSources(pipelineID, params, options) {
        const { body } = params;
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipelineID}/data-sources`, { body: body, ...options });
    }
}
exports.DataSources = DataSources;
//# sourceMappingURL=data-sources.js.map