import { APIResource } from "../../core/resource.mjs";
import * as PipelinesAPI from "../pipelines/pipelines.mjs";
import * as RetrieverAPI from "./retriever.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
export declare class Retrievers extends APIResource {
    retriever: RetrieverAPI.Retriever;
    /**
     * Create a new Retriever.
     */
    create(params: RetrieverCreateParams, options?: RequestOptions): APIPromise<Retriever>;
    /**
     * Update an existing Retriever.
     */
    update(retrieverID: string, body: RetrieverUpdateParams, options?: RequestOptions): APIPromise<Retriever>;
    /**
     * List Retrievers for a project.
     */
    list(query?: RetrieverListParams | null | undefined, options?: RequestOptions): APIPromise<RetrieverListResponse>;
    /**
     * Delete a Retriever by ID.
     */
    delete(retrieverID: string, options?: RequestOptions): APIPromise<void>;
    /**
     * Get a Retriever by ID.
     */
    get(retrieverID: string, query?: RetrieverGetParams | null | undefined, options?: RequestOptions): APIPromise<Retriever>;
    /**
     * Retrieve data using specified pipelines without creating a persistent retriever.
     */
    search(params: RetrieverSearchParams, options?: RequestOptions): APIPromise<CompositeRetrievalResult>;
    /**
     * Upsert a new Retriever.
     */
    upsert(params: RetrieverUpsertParams, options?: RequestOptions): APIPromise<Retriever>;
}
/**
 * Enum for the mode of composite retrieval.
 */
export type CompositeRetrievalMode = 'routing' | 'full';
export interface CompositeRetrievalResult {
    /**
     * @deprecated The image nodes retrieved by the pipeline for the given query.
     * Deprecated - will soon be replaced with 'page_screenshot_nodes'.
     */
    image_nodes?: Array<PipelinesAPI.PageScreenshotNodeWithScore>;
    /**
     * The retrieved nodes from the composite retrieval.
     */
    nodes?: Array<CompositeRetrievalResult.Node>;
    /**
     * The page figure nodes retrieved by the pipeline for the given query.
     */
    page_figure_nodes?: Array<PipelinesAPI.PageFigureNodeWithScore>;
}
export declare namespace CompositeRetrievalResult {
    interface Node {
        node: Node.Node;
        class_name?: string;
        score?: number | null;
    }
    namespace Node {
        interface Node {
            /**
             * The ID of the retrieved node.
             */
            id: string;
            /**
             * The end character index of the retrieved node in the document
             */
            end_char_idx: number | null;
            /**
             * The ID of the pipeline this node was retrieved from.
             */
            pipeline_id: string;
            /**
             * The ID of the retriever this node was retrieved from.
             */
            retriever_id: string;
            /**
             * The name of the retrieval pipeline this node was retrieved from.
             */
            retriever_pipeline_name: string;
            /**
             * The start character index of the retrieved node in the document
             */
            start_char_idx: number | null;
            /**
             * The text of the retrieved node.
             */
            text: string;
            /**
             * Metadata associated with the retrieved node.
             */
            metadata?: {
                [key: string]: unknown;
            };
        }
    }
}
export interface ReRankConfig {
    /**
     * The number of nodes to retrieve after reranking over retrieved nodes from all
     * retrieval tools.
     */
    top_n?: number;
    /**
     * The type of reranker to use.
     */
    type?: 'system_default' | 'llm' | 'cohere' | 'bedrock' | 'score' | 'disabled';
}
/**
 * An entity that retrieves context nodes from several sub RetrieverTools.
 */
export interface Retriever {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * A name for the retriever tool. Will default to the pipeline name if not
     * provided.
     */
    name: string;
    /**
     * The ID of the project this retriever resides in.
     */
    project_id: string;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * The pipelines this retriever uses.
     */
    pipelines?: Array<RetrieverPipeline>;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export interface RetrieverCreate {
    /**
     * A name for the retriever tool. Will default to the pipeline name if not
     * provided.
     */
    name: string;
    /**
     * The pipelines this retriever uses.
     */
    pipelines?: Array<RetrieverPipeline>;
}
export interface RetrieverPipeline {
    /**
     * A description of the retriever tool.
     */
    description: string | null;
    /**
     * A name for the retriever tool. Will default to the pipeline name if not
     * provided.
     */
    name: string | null;
    /**
     * The ID of the pipeline this tool uses.
     */
    pipeline_id: string;
    /**
     * Parameters for retrieval configuration.
     */
    preset_retrieval_parameters?: PipelinesAPI.PresetRetrievalParams;
}
export type RetrieverListResponse = Array<Retriever>;
export interface RetrieverCreateParams {
    /**
     * Body param: A name for the retriever tool. Will default to the pipeline name if
     * not provided.
     */
    name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The pipelines this retriever uses.
     */
    pipelines?: Array<RetrieverPipeline>;
}
export interface RetrieverUpdateParams {
    /**
     * The pipelines this retriever uses.
     */
    pipelines: Array<RetrieverPipeline> | null;
    /**
     * A name for the retriever.
     */
    name?: string | null;
}
export interface RetrieverListParams {
    name?: string | null;
    organization_id?: string | null;
    project_id?: string | null;
}
export interface RetrieverGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface RetrieverSearchParams {
    /**
     * Body param: The query to retrieve against.
     */
    query: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The mode of composite retrieval.
     */
    mode?: CompositeRetrievalMode;
    /**
     * Body param: The pipelines to use for retrieval.
     */
    pipelines?: Array<RetrieverPipeline>;
    /**
     * Body param: The rerank configuration for composite retrieval.
     */
    rerank_config?: ReRankConfig;
    /**
     * @deprecated Body param: (use rerank_config.top_n instead) The number of nodes to
     * retrieve after reranking over retrieved nodes from all retrieval tools.
     */
    rerank_top_n?: number | null;
}
export interface RetrieverUpsertParams {
    /**
     * Body param: A name for the retriever tool. Will default to the pipeline name if
     * not provided.
     */
    name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The pipelines this retriever uses.
     */
    pipelines?: Array<RetrieverPipeline>;
}
export declare namespace Retrievers {
    export { type CompositeRetrievalMode as CompositeRetrievalMode, type CompositeRetrievalResult as CompositeRetrievalResult, type ReRankConfig as ReRankConfig, type Retriever as Retriever, type RetrieverCreate as RetrieverCreate, type RetrieverPipeline as RetrieverPipeline, type RetrieverListResponse as RetrieverListResponse, type RetrieverCreateParams as RetrieverCreateParams, type RetrieverUpdateParams as RetrieverUpdateParams, type RetrieverListParams as RetrieverListParams, type RetrieverGetParams as RetrieverGetParams, type RetrieverSearchParams as RetrieverSearchParams, type RetrieverUpsertParams as RetrieverUpsertParams, };
}
//# sourceMappingURL=retrievers.d.mts.map