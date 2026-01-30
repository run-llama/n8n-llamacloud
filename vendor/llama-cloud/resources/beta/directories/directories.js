"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directories = void 0;
const tslib_1 = require("../../../internal/tslib.js");
const resource_1 = require("../../../core/resource.js");
const FilesAPI = tslib_1.__importStar(require("./files.js"));
const files_1 = require("./files.js");
const pagination_1 = require("../../../core/pagination.js");
const headers_1 = require("../../../internal/headers.js");
const path_1 = require("../../../internal/utils/path.js");
class Directories extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.files = new FilesAPI.Files(this._client);
    }
    /**
     * Create a new directory within the specified project.
     *
     * If data_source_id is provided, validates that the data source exists and belongs
     * to the same project.
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/directories', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update directory metadata.
     */
    update(directoryID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.patch((0, path_1.path) `/api/v1/beta/directories/${directoryID}`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List Directories
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/beta/directories', (pagination_1.PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Permanently delete a directory.
     */
    delete(directoryID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/api/v1/beta/directories/${directoryID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Retrieve a directory by its identifier.
     */
    get(directoryID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/directories/${directoryID}`, { query, ...options });
    }
}
exports.Directories = Directories;
Directories.Files = files_1.Files;
//# sourceMappingURL=directories.js.map