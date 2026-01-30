import { APIResource } from "../../core/resource.mjs";
import * as PipelinesAPI from "./pipelines.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
export declare class Sync extends APIResource {
    /**
     * Run ingestion for the pipeline by incrementally updating the data-sink with
     * upstream changes from data-sources & files.
     */
    create(pipelineID: string, options?: RequestOptions): APIPromise<PipelinesAPI.Pipeline>;
    /**
     * Cancel Pipeline Sync
     */
    cancel(pipelineID: string, options?: RequestOptions): APIPromise<PipelinesAPI.Pipeline>;
}
//# sourceMappingURL=sync.d.mts.map