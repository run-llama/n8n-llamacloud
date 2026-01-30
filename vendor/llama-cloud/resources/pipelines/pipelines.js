"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipelines = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const DataSourcesAPI = tslib_1.__importStar(require("./data-sources.js"));
const data_sources_1 = require("./data-sources.js");
const DocumentsAPI = tslib_1.__importStar(require("./documents.js"));
const documents_1 = require("./documents.js");
const FilesAPI = tslib_1.__importStar(require("./files.js"));
const files_1 = require("./files.js");
const ImagesAPI = tslib_1.__importStar(require("./images.js"));
const images_1 = require("./images.js");
const MetadataAPI = tslib_1.__importStar(require("./metadata.js"));
const metadata_1 = require("./metadata.js");
const SyncAPI = tslib_1.__importStar(require("./sync.js"));
const sync_1 = require("./sync.js");
const headers_1 = require("../../internal/headers.js");
const path_1 = require("../../internal/utils/path.js");
class Pipelines extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.sync = new SyncAPI.Sync(this._client);
        this.dataSources = new DataSourcesAPI.DataSources(this._client);
        this.images = new ImagesAPI.Images(this._client);
        this.files = new FilesAPI.Files(this._client);
        this.metadata = new MetadataAPI.Metadata(this._client);
        this.documents = new DocumentsAPI.Documents(this._client);
    }
    /**
     * Create a new pipeline for a project.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/pipelines', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Get retrieval results for a managed pipeline and a query
     */
    retrieve(pipelineID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post((0, path_1.path) `/api/v1/pipelines/${pipelineID}/retrieve`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update an existing pipeline for a project.
     */
    update(pipelineID, body, options) {
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipelineID}`, { body, ...options });
    }
    /**
     * Search for pipelines by various parameters.
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/pipelines', { query, ...options });
    }
    /**
     * Delete a pipeline by ID.
     */
    delete(pipelineID, options) {
        return this._client.delete((0, path_1.path) `/api/v1/pipelines/${pipelineID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a pipeline by ID for a given project.
     */
    get(pipelineID, options) {
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipelineID}`, options);
    }
    /**
     * Get the status of a pipeline by ID.
     */
    getStatus(pipelineID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/pipelines/${pipelineID}/status`, { query, ...options });
    }
    /**
     * Upsert a pipeline for a project. Updates if a pipeline with the same name and
     * project_id already exists. Otherwise, creates a new pipeline.
     */
    upsert(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.put('/api/v1/pipelines', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.Pipelines = Pipelines;
Pipelines.Sync = sync_1.Sync;
Pipelines.DataSources = data_sources_1.DataSources;
Pipelines.Images = images_1.Images;
Pipelines.Files = files_1.Files;
Pipelines.Metadata = metadata_1.Metadata;
Pipelines.Documents = documents_1.Documents;
//# sourceMappingURL=pipelines.js.map