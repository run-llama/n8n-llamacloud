// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Retriever extends APIResource {
    /**
     * Retrieve data using a Retriever.
     */
    search(retrieverID, params, options) {
        const { organization_id, project_id, ...body } = params;
        return this._client.post(path `/api/v1/retrievers/${retrieverID}/retrieve`, {
            query: { organization_id, project_id },
            body,
            ...options,
        });
    }
}
//# sourceMappingURL=retriever.mjs.map