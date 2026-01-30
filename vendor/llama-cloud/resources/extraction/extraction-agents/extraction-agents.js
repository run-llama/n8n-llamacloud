"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionAgents = void 0;
const tslib_1 = require("../../../internal/tslib.js");
const resource_1 = require("../../../core/resource.js");
const SchemaAPI = tslib_1.__importStar(require("./schema.js"));
const schema_1 = require("./schema.js");
const path_1 = require("../../../internal/utils/path.js");
class ExtractionAgents extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.schema = new SchemaAPI.Schema(this._client);
    }
    /**
     * Create Extraction Agent
     */
    create(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/extraction/extraction-agents', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Update Extraction Agent
     */
    update(extractionAgentID, body, options) {
        return this._client.put((0, path_1.path) `/api/v1/extraction/extraction-agents/${extractionAgentID}`, {
            body,
            ...options,
        });
    }
    /**
     * List Extraction Agents
     */
    list(query = {}, options) {
        return this._client.get('/api/v1/extraction/extraction-agents', { query, ...options });
    }
    /**
     * Delete Extraction Agent
     */
    delete(extractionAgentID, options) {
        return this._client.delete((0, path_1.path) `/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
    }
    /**
     * Get Extraction Agent
     */
    get(extractionAgentID, options) {
        return this._client.get((0, path_1.path) `/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
    }
}
exports.ExtractionAgents = ExtractionAgents;
ExtractionAgents.Schema = schema_1.Schema;
//# sourceMappingURL=extraction-agents.js.map