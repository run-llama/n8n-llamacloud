"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseConfigurations = void 0;
const resource_1 = require("../../core/resource.js");
const headers_1 = require("../../internal/headers.js");
const path_1 = require("../../internal/utils/path.js");
class ParseConfigurations extends resource_1.APIResource {
    /**
     * Update a parse configuration.
     *
     * Args: config_id: The ID of the parse configuration to update config_update:
     * Update data project: Validated project from dependency user: Current user db:
     * Database session
     *
     * Returns: The updated parse configuration
     */
    update(configID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.put((0, path_1.path) `/api/v1/beta/parse-configurations/${configID}`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
    /**
     * Delete a parse configuration.
     *
     * Args: config_id: The ID of the parse configuration to delete project: Validated
     * project from dependency user: Current user db: Database session
     */
    delete(configID, params = {}, options) {
        const { organization_id, project_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/api/v1/beta/parse-configurations/${configID}`, {
            query: { organization_id, project_id },
            ...options,
            headers: (0, headers_1.buildHeaders)([{ Accept: '*/*' }, options?.headers]),
        });
    }
    /**
     * Get a parse configuration by ID.
     *
     * Args: config_id: The ID of the parse configuration project: Validated project
     * from dependency user: Current user db: Database session
     *
     * Returns: The parse configuration
     */
    get(configID, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/beta/parse-configurations/${configID}`, { query, ...options });
    }
    /**
     * List parse configurations for the current project.
     *
     * Args: project: Validated project from dependency user: Current user db: Database
     * session page_size: Number of items per page page_token: Token for pagination
     * name: Filter by configuration name creator: Filter by creator version: Filter by
     * version
     *
     * Returns: Paginated response with parse configurations
     */
    getParseConfigurations(query = {}, options) {
        return this._client.get('/api/v1/beta/parse-configurations', { query, ...options });
    }
    /**
     * Create a new parse configuration.
     *
     * Args: config_create: Parse configuration creation data project: Validated
     * project from dependency user: Current user db: Database session
     *
     * Returns: The created parse configuration
     */
    parseConfigurations(params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post('/api/v1/beta/parse-configurations', {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
exports.ParseConfigurations = ParseConfigurations;
//# sourceMappingURL=parse-configurations.js.map