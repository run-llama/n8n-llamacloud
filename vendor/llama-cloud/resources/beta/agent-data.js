"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentData = void 0;
const resource_1 = require("../../core/resource.js");
const path_1 = require("../../internal/utils/path.js");
class AgentData extends resource_1.APIResource {
    /**
     * Update agent data by ID (overwrites).
     */
    update(itemID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.put((0, path_1.path) `/api/v1/beta/agent-data/${itemID}`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Delete agent data by ID.
     */
    delete(itemID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/api/v1/beta/agent-data/${itemID}`, {
            query: { organization_id, project_id },
            ...options,
        });
    }
    /**
     * Create new agent data.
     */
    agentData(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/agent-data', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Aggregate agent data with grouping and optional counting/first item retrieval.
     */
    aggregate(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/agent-data/:aggregate', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Bulk delete agent data by query (deployment_name, collection, optional filters).
     */
    deleteByQuery(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/agent-data/:delete', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Get agent data by ID.
     */
    get(itemID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/agent-data/${itemID}`, { query, ...options });
    }
    /**
     * Search agent data with filtering, sorting, and pagination.
     */
    search(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/agent-data/:search', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.AgentData = AgentData;
//# sourceMappingURL=agent-data.js.map