// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { multipartFormRequestOptions } from "../../internal/uploads.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Metadata extends APIResource {
    /**
     * Import metadata for a pipeline.
     */
    create(pipelineID, body, options) {
        return this._client.put(path `/api/v1/pipelines/${pipelineID}/metadata`, multipartFormRequestOptions({ body, ...options }, this._client));
    }
    /**
     * Delete metadata for all files in a pipeline.
     */
    deleteAll(pipelineID, options) {
        return this._client.delete(path `/api/v1/pipelines/${pipelineID}/metadata`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
        });
    }
}
//# sourceMappingURL=metadata.mjs.map