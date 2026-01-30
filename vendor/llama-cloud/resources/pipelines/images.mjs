// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Images extends APIResource {
    /**
     * Get a specific figure from a page of a file.
     */
    getPageFigure(figureName, params, options) {
        const { id, page_index, ...query } = params;
        return this._client.get(path `/api/v1/files/${id}/page-figures/${page_index}/${figureName}`, {
            query,
            ...options,
        });
    }
    /**
     * Get screenshot of a page from a file.
     */
    getPageScreenshot(pageIndex, params, options) {
        const { id, ...query } = params;
        return this._client.get(path `/api/v1/files/${id}/page_screenshots/${pageIndex}`, { query, ...options });
    }
    /**
     * List metadata for all figures from all pages of a file.
     */
    listPageFigures(id, query = {}, options) {
        return this._client.get(path `/api/v1/files/${id}/page-figures`, { query, ...options });
    }
    /**
     * List metadata for all screenshots of pages from a file.
     */
    listPageScreenshots(id, query = {}, options) {
        return this._client.get(path `/api/v1/files/${id}/page_screenshots`, { query, ...options });
    }
}
//# sourceMappingURL=images.mjs.map