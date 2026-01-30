"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const resource_1 = require("../../../core/resource.js");
class Schema extends resource_1.APIResource {
    /**
     * Generates or refines an extraction agent's schema definition from a file,
     * natural language prompt, or existing schema.
     */
    generateSchema(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/extraction/extraction-agents/schema/generate', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Validates an extraction agent's schema definition. Returns the normalized and
     * validated schema if valid, otherwise raises an HTTP 400.
     */
    validateSchema(body, options) {
        return this._client.post('/api/v1/extraction/extraction-agents/schema/validation', { body, ...options });
    }
}
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map