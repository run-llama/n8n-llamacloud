// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { path } from "../../internal/utils/path.mjs";
export class DataSources extends APIResource {
    /**
     * Update the configuration of a data source in a pipeline.
     */
    update(dataSourceID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.put(path `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}`, {
            body,
            ...options,
        });
    }
    /**
     * Get data sources for a pipeline.
     */
    getDataSources(pipelineID, options) {
        return this._client.get(path `/api/v1/pipelines/${pipelineID}/data-sources`, options);
    }
    /**
     * Get the status of a data source for a pipeline.
     */
    getStatus(dataSourceID, params, options) {
        const { pipeline_id } = params;
        return this._client.get(path `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/status`, options);
    }
    /**
     * Run ingestion for the pipeline data source by incrementally updating the
     * data-sink with upstream changes from data-source.
     */
    sync(dataSourceID, params, options) {
        const { pipeline_id, ...body } = params;
        return this._client.post(path `/api/v1/pipelines/${pipeline_id}/data-sources/${dataSourceID}/sync`, {
            body,
            ...options,
        });
    }
    /**
     * Add data sources to a pipeline.
     */
    updateDataSources(pipelineID, params, options) {
        const { body } = params;
        return this._client.put(path `/api/v1/pipelines/${pipelineID}/data-sources`, { body: body, ...options });
    }
}
//# sourceMappingURL=data-sources.mjs.map