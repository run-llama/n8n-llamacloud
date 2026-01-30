"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Images = void 0;
const resource_1 = require("../../core/resource.js");
const path_1 = require("../../internal/utils/path.js");
class Images extends resource_1.APIResource {
    /**
     * Get a specific figure from a page of a file.
     */
    getPageFigure(figureName, params, options) {
        const { id, page_index, ...query } = params;
        return this._client.get((0, path_1.path) `/api/v1/files/${id}/page-figures/${page_index}/${figureName}`, {
            query,
            ...options,
        });
    }
    /**
     * Get screenshot of a page from a file.
     */
    getPageScreenshot(pageIndex, params, options) {
        const { id, ...query } = params;
        return this._client.get((0, path_1.path) `/api/v1/files/${id}/page_screenshots/${pageIndex}`, { query, ...options });
    }
    /**
     * List metadata for all figures from all pages of a file.
     */
    listPageFigures(id, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/files/${id}/page-figures`, { query, ...options });
    }
    /**
     * List metadata for all screenshots of pages from a file.
     */
    listPageScreenshots(id, query = {}, options) {
        return this._client.get((0, path_1.path) `/api/v1/files/${id}/page_screenshots`, { query, ...options });
    }
}
exports.Images = Images;
//# sourceMappingURL=images.js.map