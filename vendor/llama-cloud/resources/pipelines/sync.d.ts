import { APIResource } from "../../core/resource.js";
import * as PipelinesAPI from "./pipelines.js";
import { APIPromise } from "../../core/api-promise.js";
import { RequestOptions } from "../../internal/request-options.js";
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
//# sourceMappingURL=sync.d.ts.map