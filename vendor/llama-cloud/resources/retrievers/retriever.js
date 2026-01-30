"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retriever = void 0;
const resource_1 = require("../../core/resource.js");
const path_1 = require("../../internal/utils/path.js");
class Retriever extends resource_1.APIResource {
    /**
     * Retrieve data using a Retriever.
     */
    search(retrieverID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post((0, path_1.path) `/api/v1/retrievers/${retrieverID}/retrieve`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.Retriever = Retriever;
//# sourceMappingURL=retriever.js.map