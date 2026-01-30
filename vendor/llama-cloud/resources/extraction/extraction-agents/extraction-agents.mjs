// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as SchemaAPI from "./schema.mjs";
import { Schema, } from "./schema.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class ExtractionAgents extends APIResource {
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
        return this._client.put(path `/api/v1/extraction/extraction-agents/${extractionAgentID}`, {
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
        return this._client.delete(path `/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
    }
    /**
     * Get Extraction Agent
     */
    get(extractionAgentID, options) {
        return this._client.get(path `/api/v1/extraction/extraction-agents/${extractionAgentID}`, options);
    }
}
ExtractionAgents.Schema = Schema;
//# sourceMappingURL=extraction-agents.mjs.map