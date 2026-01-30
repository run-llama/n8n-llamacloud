"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const resource_1 = require("../../core/resource.js");
const headers_1 = require("../../internal/headers.js");
const uploads_1 = require("../../internal/uploads.js");
const path_1 = require("../../internal/utils/path.js");
class Metadata extends resource_1.APIResource {
    /**
     * Import metadata for a pipeline.
     */
    create(pipelineID, body, options) {
        return this._client.put((0, path_1.path) `/api/v1/pipelines/${pipelineID}/metadata`, (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
    }
    /**
     * Delete metadata for all files in a pipeline.
     */
    deleteAll(pipelineID, options) {
        return this._client.delete((0, path_1.path) `/api/v1/pipelines/${pipelineID}/metadata`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
}
exports.Metadata = Metadata;
//# sourceMappingURL=metadata.js.map