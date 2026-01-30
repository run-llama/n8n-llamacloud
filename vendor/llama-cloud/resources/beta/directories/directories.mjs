// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as FilesAPI from "./files.mjs";
import { Files, } from "./files.mjs";
import { PaginatedClassifyJobs, } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Directories extends APIResource {
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
        return this._client.patch(path `/api/v1/beta/directories/${directoryID}`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * List Directories
     */
    list(query = {}, options) {
        return this._client.getAPIList('/api/v1/beta/directories', (PaginatedClassifyJobs), {
            query,
            ...options,
        });
    }
    /**
     * Permanently delete a directory.
     */
    delete(directoryID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete(path `/api/v1/beta/directories/${directoryID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Retrieve a directory by its identifier.
     */
    get(directoryID, query = {}, options) {
        return this._client.get(path `/api/v1/beta/directories/${directoryID}`, { query, ...options });
    }
}
Directories.Files = Files;
//# sourceMappingURL=directories.mjs.map