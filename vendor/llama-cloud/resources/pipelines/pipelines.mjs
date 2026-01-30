// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as DataSourcesAPI from "./data-sources.mjs";
import { DataSources, } from "./data-sources.mjs";
import * as DocumentsAPI from "./documents.mjs";
import { Documents, } from "./documents.mjs";
import * as FilesAPI from "./files.mjs";
import { Files, } from "./files.mjs";
import * as ImagesAPI from "./images.mjs";
import { Images, } from "./images.mjs";
import * as MetadataAPI from "./metadata.mjs";
import { Metadata } from "./metadata.mjs";
import * as SyncAPI from "./sync.mjs";
import { Sync } from "./sync.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Pipelines extends APIResource {
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
        return this._client.post(path `/api/v1/pipelines/${pipelineID}/retrieve`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update an existing pipeline for a project.
     */
    update(pipelineID, body, options) {
        return this._client.put(path `/api/v1/pipelines/${pipelineID}`, { body, ...options });
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
        return this._client.delete(path `/api/v1/pipelines/${pipelineID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a pipeline by ID for a given project.
     */
    get(pipelineID, options) {
        return this._client.get(path `/api/v1/pipelines/${pipelineID}`, options);
    }
    /**
     * Get the status of a pipeline by ID.
     */
    getStatus(pipelineID, query = {}, options) {
        return this._client.get(path `/api/v1/pipelines/${pipelineID}/status`, { query, ...options });
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
Pipelines.Sync = Sync;
Pipelines.DataSources = DataSources;
Pipelines.Images = Images;
Pipelines.Files = Files;
Pipelines.Metadata = Metadata;
Pipelines.Documents = Documents;
//# sourceMappingURL=pipelines.mjs.map