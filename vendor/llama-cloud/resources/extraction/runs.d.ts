import { APIResource } from "../../core/resource.js";
import * as FilesAPI from "../files.js";
import { APIPromise } from "../../core/api-promise.js";
import { PagePromise, PaginatedExtractRuns, type PaginatedExtractRunsParams } from "../../core/pagination.js";
import { RequestOptions } from "../../internal/request-options.js";
export declare class Runs extends APIResource {
    /**
     * List Extract Runs
     */
    list(query: RunListParams, options?: RequestOptions): PagePromise<ExtractRunsPaginatedExtractRuns, ExtractRun>;
    /**
     * Delete Extraction Run
     */
    delete(runID: string, params?: RunDeleteParams | null | undefined, options?: RequestOptions): APIPromise<unknown>;
    /**
     * Get Run
     */
    get(runID: string, query?: RunGetParams | null | undefined, options?: RequestOptions): APIPromise<ExtractRun>;
    /**
     * Get Run By Job Id
     */
    getByJob(jobID: string, query?: RunGetByJobParams | null | undefined, options?: RequestOptions): APIPromise<ExtractRun>;
}
export type ExtractRunsPaginatedExtractRuns = PaginatedExtractRuns<ExtractRun>;
/**
 * Configuration parameters for the extraction agent.
 */
export interface ExtractConfig {
    /**
     * The mode to use for chunking the document.
     */
    chunk_mode?: 'PAGE' | 'SECTION';
    /**
     * @deprecated Whether to fetch citation bounding boxes for the extraction. Only
     * available in PREMIUM mode. Deprecated: this is now synonymous with cite_sources.
     */
    citation_bbox?: boolean;
    /**
     * Whether to cite sources for the extraction.
     */
    cite_sources?: boolean;
    /**
     * Whether to fetch confidence scores for the extraction.
     */
    confidence_scores?: boolean;
    /**
     * The extract model to use for data extraction. If not provided, uses the default
     * for the extraction mode.
     */
    extract_model?: 'openai-gpt-4-1' | 'openai-gpt-4-1-mini' | 'openai-gpt-4-1-nano' | 'openai-gpt-5' | 'openai-gpt-5-mini' | 'gemini-2.0-flash' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro' | 'openai-gpt-4o' | 'openai-gpt-4o-mini' | (string & {}) | null;
    /**
     * The extraction mode specified (FAST, BALANCED, MULTIMODAL, PREMIUM).
     */
    extraction_mode?: 'FAST' | 'BALANCED' | 'PREMIUM' | 'MULTIMODAL';
    /**
     * The extraction target specified.
     */
    extraction_target?: 'PER_DOC' | 'PER_PAGE' | 'PER_TABLE_ROW';
    /**
     * Whether to use high resolution mode for the extraction.
     */
    high_resolution_mode?: boolean;
    /**
     * Whether to invalidate the cache for the extraction.
     */
    invalidate_cache?: boolean;
    /**
     * DEPRECATED: Whether to use fast mode for multimodal extraction.
     */
    multimodal_fast_mode?: boolean;
    /**
     * Number of pages to pass as context on long document extraction.
     */
    num_pages_context?: number | null;
    /**
     * Comma-separated list of page numbers or ranges to extract from (1-based, e.g.,
     * '1,3,5-7,9' or '1-3,8-10').
     */
    page_range?: string | null;
    /**
     * Public model names.
     */
    parse_model?: 'openai-gpt-4o' | 'openai-gpt-4o-mini' | 'openai-gpt-4-1' | 'openai-gpt-4-1-mini' | 'openai-gpt-4-1-nano' | 'openai-gpt-5' | 'openai-gpt-5-mini' | 'openai-gpt-5-nano' | 'openai-text-embedding-3-large' | 'openai-text-embedding-3-small' | 'openai-whisper-1' | 'anthropic-sonnet-3.5' | 'anthropic-sonnet-3.5-v2' | 'anthropic-sonnet-3.7' | 'anthropic-sonnet-4.0' | 'anthropic-sonnet-4.5' | 'anthropic-haiku-3.5' | 'anthropic-haiku-4.5' | 'gemini-2.5-flash' | 'gemini-3.0-pro' | 'gemini-2.5-pro' | 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' | 'gemini-2.5-flash-lite' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | null;
    /**
     * The priority for the request. This field may be ignored or overwritten depending
     * on the organization tier.
     */
    priority?: 'low' | 'medium' | 'high' | 'critical' | null;
    /**
     * The system prompt to use for the extraction.
     */
    system_prompt?: string | null;
    /**
     * Whether to use reasoning for the extraction.
     */
    use_reasoning?: boolean;
}
/**
 * Schema for an extraction run.
 */
export interface ExtractRun {
    /**
     * The id of the extraction run
     */
    id: string;
    /**
     * The config used for extraction
     */
    config: ExtractConfig;
    /**
     * The schema used for extraction
     */
    data_schema: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    };
    /**
     * The id of the extraction agent
     */
    extraction_agent_id: string;
    /**
     * Whether this extraction run was triggered from the UI
     */
    from_ui: boolean;
    /**
     * The id of the project that the extraction run belongs to
     */
    project_id: string;
    /**
     * The status of the extraction run
     */
    status: 'CREATED' | 'PENDING' | 'SUCCESS' | 'ERROR';
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * The data extracted from the file
     */
    data?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | Array<{
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    }> | null;
    /**
     * The error that occurred during extraction
     */
    error?: string | null;
    /**
     * The metadata extracted from the file
     */
    extraction_metadata?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * @deprecated Schema for a file.
     */
    file?: FilesAPI.File | null;
    /**
     * The id of the file that the extract was extracted from
     */
    file_id?: string | null;
    /**
     * The id of the job that the extraction run belongs to
     */
    job_id?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export type RunDeleteResponse = unknown;
export interface RunListParams extends PaginatedExtractRunsParams {
    extraction_agent_id: string;
}
export interface RunDeleteParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface RunGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface RunGetByJobParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Runs {
    export { type ExtractConfig as ExtractConfig, type ExtractRun as ExtractRun, type RunDeleteResponse as RunDeleteResponse, type ExtractRunsPaginatedExtractRuns as ExtractRunsPaginatedExtractRuns, type RunListParams as RunListParams, type RunDeleteParams as RunDeleteParams, type RunGetParams as RunGetParams, type RunGetByJobParams as RunGetByJobParams, };
}
//# sourceMappingURL=runs.d.ts.map