import { APIResource } from "../../core/resource.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { type Uploadable } from "../../core/uploads.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
export declare class Metadata extends APIResource {
    /**
     * Import metadata for a pipeline.
     */
    create(pipelineID: string, body: MetadataCreateParams, options?: RequestOptions): APIPromise<MetadataCreateResponse>;
    /**
     * Delete metadata for all files in a pipeline.
     */
    deleteAll(pipelineID: string, options?: RequestOptions): APIPromise<void>;
}
export type MetadataCreateResponse = {
    [key: string]: string;
};
export interface MetadataCreateParams {
    upload_file: Uploadable;
}
export declare namespace Metadata {
    export { type MetadataCreateResponse as MetadataCreateResponse, type MetadataCreateParams as MetadataCreateParams, };
}
//# sourceMappingURL=metadata.d.mts.map