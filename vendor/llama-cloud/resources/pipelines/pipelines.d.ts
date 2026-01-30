import { APIResource } from "../../core/resource.js";
import * as PipelinesAPI from "./pipelines.js";
import * as DataSinksAPI from "../data-sinks.js";
import * as ParsingAPI from "../parsing.js";
import * as Shared from "../shared.js";
import * as JobsAPI from "../extraction/jobs.js";
import * as DataSourcesAPI from "./data-sources.js";
import { DataSourceGetDataSourcesResponse, DataSourceGetStatusParams, DataSourceSyncParams, DataSourceUpdateDataSourcesParams, DataSourceUpdateDataSourcesResponse, DataSourceUpdateParams, DataSources, PipelineDataSource } from "./data-sources.js";
import * as DocumentsAPI from "./documents.js";
import { CloudDocument, CloudDocumentCreate, CloudDocumentsPaginatedCloudDocuments, DocumentCreateParams, DocumentCreateResponse, DocumentDeleteParams, DocumentGetChunksParams, DocumentGetChunksResponse, DocumentGetParams, DocumentGetStatusParams, DocumentListParams, DocumentSyncParams, DocumentSyncResponse, DocumentUpsertParams, DocumentUpsertResponse, Documents, TextNode } from "./documents.js";
import * as FilesAPI from "./files.js";
import { FileCreateParams, FileCreateResponse, FileDeleteParams, FileGetStatusCountsParams, FileGetStatusCountsResponse, FileGetStatusParams, FileListParams, FileUpdateParams, Files, PipelineFile, PipelineFilesPaginatedPipelineFiles } from "./files.js";
import * as ImagesAPI from "./images.js";
import { ImageGetPageFigureParams, ImageGetPageFigureResponse, ImageGetPageScreenshotParams, ImageGetPageScreenshotResponse, ImageListPageFiguresParams, ImageListPageFiguresResponse, ImageListPageScreenshotsParams, ImageListPageScreenshotsResponse, Images } from "./images.js";
import * as MetadataAPI from "./metadata.js";
import { Metadata, MetadataCreateParams, MetadataCreateResponse } from "./metadata.js";
import * as SyncAPI from "./sync.js";
import { Sync } from "./sync.js";
import { APIPromise } from "../../core/api-promise.js";
import { RequestOptions } from "../../internal/request-options.js";
export declare class Pipelines extends APIResource {
    sync: SyncAPI.Sync;
    dataSources: DataSourcesAPI.DataSources;
    images: ImagesAPI.Images;
    files: FilesAPI.Files;
    metadata: MetadataAPI.Metadata;
    documents: DocumentsAPI.Documents;
    /**
     * Create a new pipeline for a project.
     */
    create(params: PipelineCreateParams, options?: RequestOptions): APIPromise<Pipeline>;
    /**
     * Get retrieval results for a managed pipeline and a query
     */
    retrieve(pipelineID: string, params: PipelineRetrieveParams, options?: RequestOptions): APIPromise<PipelineRetrieveResponse>;
    /**
     * Update an existing pipeline for a project.
     */
    update(pipelineID: string, body: PipelineUpdateParams, options?: RequestOptions): APIPromise<Pipeline>;
    /**
     * Search for pipelines by various parameters.
     */
    list(query?: PipelineListParams | null | undefined, options?: RequestOptions): APIPromise<PipelineListResponse>;
    /**
     * Delete a pipeline by ID.
     */
    delete(pipelineID: string, options?: RequestOptions): APIPromise<void>;
    /**
     * Get a pipeline by ID for a given project.
     */
    get(pipelineID: string, options?: RequestOptions): APIPromise<Pipeline>;
    /**
     * Get the status of a pipeline by ID.
     */
    getStatus(pipelineID: string, query?: PipelineGetStatusParams | null | undefined, options?: RequestOptions): APIPromise<ManagedIngestionStatusResponse>;
    /**
     * Upsert a pipeline for a project. Updates if a pipeline with the same name and
     * project_id already exists. Otherwise, creates a new pipeline.
     */
    upsert(params: PipelineUpsertParams, options?: RequestOptions): APIPromise<Pipeline>;
}
export interface AdvancedModeTransformConfig {
    /**
     * Configuration for the chunking.
     */
    chunking_config?: AdvancedModeTransformConfig.NoneChunkingConfig | AdvancedModeTransformConfig.CharacterChunkingConfig | AdvancedModeTransformConfig.TokenChunkingConfig | AdvancedModeTransformConfig.SentenceChunkingConfig | AdvancedModeTransformConfig.SemanticChunkingConfig;
    mode?: 'advanced';
    /**
     * Configuration for the segmentation.
     */
    segmentation_config?: AdvancedModeTransformConfig.NoneSegmentationConfig | AdvancedModeTransformConfig.PageSegmentationConfig | AdvancedModeTransformConfig.ElementSegmentationConfig;
}
export declare namespace AdvancedModeTransformConfig {
    interface NoneChunkingConfig {
        mode?: 'none';
    }
    interface CharacterChunkingConfig {
        chunk_overlap?: number;
        chunk_size?: number;
        mode?: 'character';
    }
    interface TokenChunkingConfig {
        chunk_overlap?: number;
        chunk_size?: number;
        mode?: 'token';
        separator?: string;
    }
    interface SentenceChunkingConfig {
        chunk_overlap?: number;
        chunk_size?: number;
        mode?: 'sentence';
        paragraph_separator?: string;
        separator?: string;
    }
    interface SemanticChunkingConfig {
        breakpoint_percentile_threshold?: number;
        buffer_size?: number;
        mode?: 'semantic';
    }
    interface NoneSegmentationConfig {
        mode?: 'none';
    }
    interface PageSegmentationConfig {
        mode?: 'page';
        page_separator?: string;
    }
    interface ElementSegmentationConfig {
        mode?: 'element';
    }
}
export interface AutoTransformConfig {
    /**
     * Chunk overlap for the transformation.
     */
    chunk_overlap?: number;
    /**
     * Chunk size for the transformation.
     */
    chunk_size?: number;
    mode?: 'auto';
}
export interface AzureOpenAIEmbedding {
    /**
     * Additional kwargs for the OpenAI API.
     */
    additional_kwargs?: {
        [key: string]: unknown;
    };
    /**
     * The base URL for Azure deployment.
     */
    api_base?: string;
    /**
     * The OpenAI API key.
     */
    api_key?: string | null;
    /**
     * The version for Azure OpenAI API.
     */
    api_version?: string;
    /**
     * The Azure deployment to use.
     */
    azure_deployment?: string | null;
    /**
     * The Azure endpoint to use.
     */
    azure_endpoint?: string | null;
    class_name?: string;
    /**
     * The default headers for API requests.
     */
    default_headers?: {
        [key: string]: string;
    } | null;
    /**
     * The number of dimensions on the output embedding vectors. Works only with v3
     * embedding models.
     */
    dimensions?: number | null;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * Maximum number of retries.
     */
    max_retries?: number;
    /**
     * The name of the OpenAI embedding model.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * Reuse the OpenAI client between requests. When doing anything with large volumes
     * of async API calls, setting this to false can improve stability.
     */
    reuse_client?: boolean;
    /**
     * Timeout for each request.
     */
    timeout?: number;
}
export interface AzureOpenAIEmbeddingConfig {
    /**
     * Configuration for the Azure OpenAI embedding model.
     */
    component?: AzureOpenAIEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'AZURE_EMBEDDING';
}
export interface BedrockEmbedding {
    /**
     * Additional kwargs for the bedrock client.
     */
    additional_kwargs?: {
        [key: string]: unknown;
    };
    /**
     * AWS Access Key ID to use
     */
    aws_access_key_id?: string | null;
    /**
     * AWS Secret Access Key to use
     */
    aws_secret_access_key?: string | null;
    /**
     * AWS Session Token to use
     */
    aws_session_token?: string | null;
    class_name?: string;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * The maximum number of API retries.
     */
    max_retries?: number;
    /**
     * The modelId of the Bedrock model to use.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * The name of aws profile to use. If not given, then the default profile is used.
     */
    profile_name?: string | null;
    /**
     * AWS region name to use. Uses region configured in AWS CLI if not passed
     */
    region_name?: string | null;
    /**
     * The timeout for the Bedrock API request in seconds. It will be used for both
     * connect and read timeouts.
     */
    timeout?: number;
}
export interface BedrockEmbeddingConfig {
    /**
     * Configuration for the Bedrock embedding model.
     */
    component?: BedrockEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'BEDROCK_EMBEDDING';
}
export interface CohereEmbedding {
    /**
     * The Cohere API key.
     */
    api_key: string | null;
    class_name?: string;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * Embedding type. If not provided float embedding_type is used when needed.
     */
    embedding_type?: string;
    /**
     * Model Input type. If not provided, search_document and search_query are used
     * when needed.
     */
    input_type?: string | null;
    /**
     * The modelId of the Cohere model to use.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * Truncation type - START/ END/ NONE
     */
    truncate?: string;
}
export interface CohereEmbeddingConfig {
    /**
     * Configuration for the Cohere embedding model.
     */
    component?: CohereEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'COHERE_EMBEDDING';
}
/**
 * Schema for creating a data sink.
 */
export interface DataSinkCreate {
    /**
     * Component that implements the data sink
     */
    component: {
        [key: string]: unknown;
    } | Shared.CloudPineconeVectorStore | Shared.CloudPostgresVectorStore | Shared.CloudQdrantVectorStore | Shared.CloudAzureAISearchVectorStore | Shared.CloudMongoDBAtlasVectorSearch | Shared.CloudMilvusVectorStore | Shared.CloudAstraDBVectorStore;
    /**
     * The name of the data sink.
     */
    name: string;
    sink_type: 'PINECONE' | 'POSTGRES' | 'QDRANT' | 'AZUREAI_SEARCH' | 'MONGODB_ATLAS' | 'MILVUS' | 'ASTRA_DB';
}
export interface GeminiEmbedding {
    /**
     * API base to access the model. Defaults to None.
     */
    api_base?: string | null;
    /**
     * API key to access the model. Defaults to None.
     */
    api_key?: string | null;
    class_name?: string;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * The modelId of the Gemini model to use.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * The task for embedding model.
     */
    task_type?: string | null;
    /**
     * Title is only applicable for retrieval_document tasks, and is used to represent
     * a document title. For other tasks, title is invalid.
     */
    title?: string | null;
    /**
     * Transport to access the model. Defaults to None.
     */
    transport?: string | null;
}
export interface GeminiEmbeddingConfig {
    /**
     * Configuration for the Gemini embedding model.
     */
    component?: GeminiEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'GEMINI_EMBEDDING';
}
export interface HuggingFaceInferenceAPIEmbedding {
    /**
     * Hugging Face token. Will default to the locally saved token. Pass token=False if
     * you don’t want to send your token to the server.
     */
    token?: string | boolean | null;
    class_name?: string;
    /**
     * Additional cookies to send to the server.
     */
    cookies?: {
        [key: string]: string;
    } | null;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * Additional headers to send to the server. By default only the authorization and
     * user-agent headers are sent. Values in this dictionary will override the default
     * values.
     */
    headers?: {
        [key: string]: string;
    } | null;
    /**
     * Hugging Face model name. If None, the task will be used.
     */
    model_name?: string | null;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * Enum of possible pooling choices with pooling behaviors.
     */
    pooling?: 'cls' | 'mean' | 'last' | null;
    /**
     * Instruction to prepend during query embedding.
     */
    query_instruction?: string | null;
    /**
     * Optional task to pick Hugging Face's recommended model, used when model_name is
     * left as default of None.
     */
    task?: string | null;
    /**
     * Instruction to prepend during text embedding.
     */
    text_instruction?: string | null;
    /**
     * The maximum number of seconds to wait for a response from the server. Loading a
     * new model in Inference API can take up to several minutes. Defaults to None,
     * meaning it will loop until the server is available.
     */
    timeout?: number | null;
}
export interface HuggingFaceInferenceAPIEmbeddingConfig {
    /**
     * Configuration for the HuggingFace Inference API embedding model.
     */
    component?: HuggingFaceInferenceAPIEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'HUGGINGFACE_API_EMBEDDING';
}
/**
 * Settings that can be configured for how to use LlamaParse to parse files within
 * a LlamaCloud pipeline.
 */
export interface LlamaParseParameters {
    adaptive_long_table?: boolean | null;
    aggressive_table_extraction?: boolean | null;
    annotate_links?: boolean | null;
    auto_mode?: boolean | null;
    auto_mode_configuration_json?: string | null;
    auto_mode_trigger_on_image_in_page?: boolean | null;
    auto_mode_trigger_on_regexp_in_page?: string | null;
    auto_mode_trigger_on_table_in_page?: boolean | null;
    auto_mode_trigger_on_text_in_page?: string | null;
    azure_openai_api_version?: string | null;
    azure_openai_deployment_name?: string | null;
    azure_openai_endpoint?: string | null;
    azure_openai_key?: string | null;
    bbox_bottom?: number | null;
    bbox_left?: number | null;
    bbox_right?: number | null;
    bbox_top?: number | null;
    bounding_box?: string | null;
    compact_markdown_table?: boolean | null;
    complemental_formatting_instruction?: string | null;
    content_guideline_instruction?: string | null;
    continuous_mode?: boolean | null;
    disable_image_extraction?: boolean | null;
    disable_ocr?: boolean | null;
    disable_reconstruction?: boolean | null;
    do_not_cache?: boolean | null;
    do_not_unroll_columns?: boolean | null;
    extract_charts?: boolean | null;
    extract_layout?: boolean | null;
    extract_printed_page_number?: boolean | null;
    fast_mode?: boolean | null;
    formatting_instruction?: string | null;
    gpt4o_api_key?: string | null;
    gpt4o_mode?: boolean | null;
    guess_xlsx_sheet_name?: boolean | null;
    hide_footers?: boolean | null;
    hide_headers?: boolean | null;
    high_res_ocr?: boolean | null;
    html_make_all_elements_visible?: boolean | null;
    html_remove_fixed_elements?: boolean | null;
    html_remove_navigation_elements?: boolean | null;
    http_proxy?: string | null;
    ignore_document_elements_for_layout_detection?: boolean | null;
    images_to_save?: Array<'screenshot' | 'embedded' | 'layout'> | null;
    inline_images_in_markdown?: boolean | null;
    input_s3_path?: string | null;
    input_s3_region?: string | null;
    input_url?: string | null;
    internal_is_screenshot_job?: boolean | null;
    invalidate_cache?: boolean | null;
    is_formatting_instruction?: boolean | null;
    job_timeout_extra_time_per_page_in_seconds?: number | null;
    job_timeout_in_seconds?: number | null;
    keep_page_separator_when_merging_tables?: boolean | null;
    languages?: Array<ParsingAPI.ParsingLanguages>;
    layout_aware?: boolean | null;
    line_level_bounding_box?: boolean | null;
    markdown_table_multiline_header_separator?: string | null;
    max_pages?: number | null;
    max_pages_enforced?: number | null;
    merge_tables_across_pages_in_markdown?: boolean | null;
    model?: string | null;
    outlined_table_extraction?: boolean | null;
    output_pdf_of_document?: boolean | null;
    output_s3_path_prefix?: string | null;
    output_s3_region?: string | null;
    output_tables_as_HTML?: boolean | null;
    page_error_tolerance?: number | null;
    page_footer_prefix?: string | null;
    page_footer_suffix?: string | null;
    page_header_prefix?: string | null;
    page_header_suffix?: string | null;
    page_prefix?: string | null;
    page_separator?: string | null;
    page_suffix?: string | null;
    /**
     * Enum for representing the mode of parsing to be used.
     */
    parse_mode?: ParsingAPI.ParsingMode | null;
    parsing_instruction?: string | null;
    precise_bounding_box?: boolean | null;
    premium_mode?: boolean | null;
    presentation_out_of_bounds_content?: boolean | null;
    presentation_skip_embedded_data?: boolean | null;
    preserve_layout_alignment_across_pages?: boolean | null;
    preserve_very_small_text?: boolean | null;
    preset?: string | null;
    /**
     * The priority for the request. This field may be ignored or overwritten depending
     * on the organization tier.
     */
    priority?: 'low' | 'medium' | 'high' | 'critical' | null;
    project_id?: string | null;
    remove_hidden_text?: boolean | null;
    /**
     * Enum for representing the different available page error handling modes.
     */
    replace_failed_page_mode?: ParsingAPI.FailPageMode | null;
    replace_failed_page_with_error_message_prefix?: string | null;
    replace_failed_page_with_error_message_suffix?: string | null;
    save_images?: boolean | null;
    skip_diagonal_text?: boolean | null;
    specialized_chart_parsing_agentic?: boolean | null;
    specialized_chart_parsing_efficient?: boolean | null;
    specialized_chart_parsing_plus?: boolean | null;
    specialized_image_parsing?: boolean | null;
    spreadsheet_extract_sub_tables?: boolean | null;
    spreadsheet_force_formula_computation?: boolean | null;
    strict_mode_buggy_font?: boolean | null;
    strict_mode_image_extraction?: boolean | null;
    strict_mode_image_ocr?: boolean | null;
    strict_mode_reconstruction?: boolean | null;
    structured_output?: boolean | null;
    structured_output_json_schema?: string | null;
    structured_output_json_schema_name?: string | null;
    system_prompt?: string | null;
    system_prompt_append?: string | null;
    take_screenshot?: boolean | null;
    target_pages?: string | null;
    tier?: string | null;
    use_vendor_multimodal_model?: boolean | null;
    user_prompt?: string | null;
    vendor_multimodal_api_key?: string | null;
    vendor_multimodal_model_name?: string | null;
    version?: string | null;
    /**
     * The outbound webhook configurations
     */
    webhook_configurations?: Array<JobsAPI.WebhookConfiguration> | null;
    webhook_url?: string | null;
}
export interface LlmParameters {
    class_name?: string;
    /**
     * The name of the model to use for LLM completions.
     */
    model_name?: 'GPT_4O' | 'GPT_4O_MINI' | 'GPT_4_1' | 'GPT_4_1_NANO' | 'GPT_4_1_MINI' | 'AZURE_OPENAI_GPT_4O' | 'AZURE_OPENAI_GPT_4O_MINI' | 'AZURE_OPENAI_GPT_4_1' | 'AZURE_OPENAI_GPT_4_1_MINI' | 'AZURE_OPENAI_GPT_4_1_NANO' | 'CLAUDE_4_5_SONNET' | 'BEDROCK_CLAUDE_3_5_SONNET_V1' | 'BEDROCK_CLAUDE_3_5_SONNET_V2' | 'VERTEX_AI_CLAUDE_3_5_SONNET_V2';
    /**
     * The system prompt to use for the completion.
     */
    system_prompt?: string | null;
    /**
     * The temperature value for the model.
     */
    temperature?: number | null;
    /**
     * Whether to use chain of thought reasoning.
     */
    use_chain_of_thought_reasoning?: boolean | null;
    /**
     * Whether to show citations in the response.
     */
    use_citation?: boolean | null;
}
export interface ManagedIngestionStatusResponse {
    /**
     * Status of the ingestion.
     */
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED';
    /**
     * Date of the deployment.
     */
    deployment_date?: string | null;
    /**
     * When the status is effective
     */
    effective_at?: string | null;
    /**
     * List of errors that occurred during ingestion.
     */
    error?: Array<ManagedIngestionStatusResponse.Error> | null;
    /**
     * ID of the latest job.
     */
    job_id?: string | null;
}
export declare namespace ManagedIngestionStatusResponse {
    interface Error {
        /**
         * ID of the job that failed.
         */
        job_id: string;
        /**
         * List of errors that occurred during ingestion.
         */
        message: string;
        /**
         * Name of the job that failed.
         */
        step: 'MANAGED_INGESTION' | 'DATA_SOURCE' | 'FILE_UPDATER' | 'PARSE' | 'TRANSFORM' | 'INGESTION' | 'METADATA_UPDATE';
    }
}
/**
 * Message role.
 */
export type MessageRole = 'system' | 'developer' | 'user' | 'assistant' | 'function' | 'tool' | 'chatbot' | 'model';
/**
 * Metadata filters for vector stores.
 */
export interface MetadataFilters {
    filters: Array<MetadataFilters.MetadataFilter | MetadataFilters>;
    /**
     * Vector store filter conditions to combine different filters.
     */
    condition?: 'and' | 'or' | 'not' | null;
}
export declare namespace MetadataFilters {
    /**
     * Comprehensive metadata filter for vector stores to support more operators.
     *
     * Value uses Strict types, as int, float and str are compatible types and were all
     * converted to string before.
     *
     * See: https://docs.pydantic.dev/latest/usage/types/#strict-types
     */
    interface MetadataFilter {
        key: string;
        value: number | string | Array<string> | Array<number> | Array<number> | null;
        /**
         * Vector store filter operator.
         */
        operator?: '==' | '>' | '<' | '!=' | '>=' | '<=' | 'in' | 'nin' | 'any' | 'all' | 'text_match' | 'text_match_insensitive' | 'contains' | 'is_empty';
    }
}
export interface OpenAIEmbedding {
    /**
     * Additional kwargs for the OpenAI API.
     */
    additional_kwargs?: {
        [key: string]: unknown;
    };
    /**
     * The base URL for OpenAI API.
     */
    api_base?: string | null;
    /**
     * The OpenAI API key.
     */
    api_key?: string | null;
    /**
     * The version for OpenAI API.
     */
    api_version?: string | null;
    class_name?: string;
    /**
     * The default headers for API requests.
     */
    default_headers?: {
        [key: string]: string;
    } | null;
    /**
     * The number of dimensions on the output embedding vectors. Works only with v3
     * embedding models.
     */
    dimensions?: number | null;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * Maximum number of retries.
     */
    max_retries?: number;
    /**
     * The name of the OpenAI embedding model.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
    /**
     * Reuse the OpenAI client between requests. When doing anything with large volumes
     * of async API calls, setting this to false can improve stability.
     */
    reuse_client?: boolean;
    /**
     * Timeout for each request.
     */
    timeout?: number;
}
export interface OpenAIEmbeddingConfig {
    /**
     * Configuration for the OpenAI embedding model.
     */
    component?: OpenAIEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'OPENAI_EMBEDDING';
}
/**
 * Page figure metadata with score
 */
export interface PageFigureNodeWithScore {
    node: PageFigureNodeWithScore.Node;
    /**
     * The score of the figure node
     */
    score: number;
    class_name?: string;
}
export declare namespace PageFigureNodeWithScore {
    interface Node {
        /**
         * The confidence of the figure
         */
        confidence: number;
        /**
         * The name of the figure
         */
        figure_name: string;
        /**
         * The size of the figure in bytes
         */
        figure_size: number;
        /**
         * The ID of the file that the figure was taken from
         */
        file_id: string;
        /**
         * The index of the page for which the figure is taken (0-indexed)
         */
        page_index: number;
        /**
         * Whether the figure is likely to be noise
         */
        is_likely_noise?: boolean;
        /**
         * Metadata for the figure
         */
        metadata?: {
            [key: string]: unknown;
        } | null;
    }
}
/**
 * Page screenshot metadata with score
 */
export interface PageScreenshotNodeWithScore {
    node: PageScreenshotNodeWithScore.Node;
    /**
     * The score of the screenshot node
     */
    score: number;
    class_name?: string;
}
export declare namespace PageScreenshotNodeWithScore {
    interface Node {
        /**
         * The ID of the file that the page screenshot was taken from
         */
        file_id: string;
        /**
         * The size of the image in bytes
         */
        image_size: number;
        /**
         * The index of the page for which the screenshot is taken (0-indexed)
         */
        page_index: number;
        /**
         * Metadata for the screenshot
         */
        metadata?: {
            [key: string]: unknown;
        } | null;
    }
}
/**
 * Schema for a pipeline.
 */
export interface Pipeline {
    /**
     * Unique identifier
     */
    id: string;
    embedding_config: Pipeline.ManagedOpenAIEmbeddingConfig | AzureOpenAIEmbeddingConfig | CohereEmbeddingConfig | GeminiEmbeddingConfig | HuggingFaceInferenceAPIEmbeddingConfig | OpenAIEmbeddingConfig | VertexAIEmbeddingConfig | BedrockEmbeddingConfig;
    name: string;
    project_id: string;
    /**
     * Hashes for the configuration of a pipeline.
     */
    config_hash?: Pipeline.ConfigHash | null;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Schema for a data sink.
     */
    data_sink?: DataSinksAPI.DataSink | null;
    /**
     * Schema for an embedding model config.
     */
    embedding_model_config?: Pipeline.EmbeddingModelConfig | null;
    /**
     * The ID of the EmbeddingModelConfig this pipeline is using.
     */
    embedding_model_config_id?: string | null;
    /**
     * Settings that can be configured for how to use LlamaParse to parse files within
     * a LlamaCloud pipeline.
     */
    llama_parse_parameters?: LlamaParseParameters | null;
    /**
     * The ID of the ManagedPipeline this playground pipeline is linked to.
     */
    managed_pipeline_id?: string | null;
    /**
     * Metadata configuration for the pipeline.
     */
    metadata_config?: PipelineMetadataConfig | null;
    /**
     * Type of pipeline. Either PLAYGROUND or MANAGED.
     */
    pipeline_type?: PipelineType;
    /**
     * Preset retrieval parameters for the pipeline.
     */
    preset_retrieval_parameters?: PresetRetrievalParams;
    /**
     * Configuration for sparse embedding models used in hybrid search.
     *
     * This allows users to choose between Splade and BM25 models for sparse retrieval
     * in managed data sinks.
     */
    sparse_model_config?: SparseModelConfig | null;
    /**
     * Status of the pipeline.
     */
    status?: 'CREATED' | 'DELETING' | null;
    /**
     * Configuration for the transformation.
     */
    transform_config?: AutoTransformConfig | AdvancedModeTransformConfig;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export declare namespace Pipeline {
    interface ManagedOpenAIEmbeddingConfig {
        /**
         * Configuration for the Managed OpenAI embedding model.
         */
        component?: ManagedOpenAIEmbeddingConfig.Component;
        /**
         * Type of the embedding model.
         */
        type?: 'MANAGED_OPENAI_EMBEDDING';
    }
    namespace ManagedOpenAIEmbeddingConfig {
        /**
         * Configuration for the Managed OpenAI embedding model.
         */
        interface Component {
            class_name?: string;
            /**
             * The batch size for embedding calls.
             */
            embed_batch_size?: number;
            /**
             * The name of the OpenAI embedding model.
             */
            model_name?: 'openai-text-embedding-3-small';
            /**
             * The number of workers to use for async embedding calls.
             */
            num_workers?: number | null;
        }
    }
    /**
     * Hashes for the configuration of a pipeline.
     */
    interface ConfigHash {
        /**
         * Hash of the embedding config.
         */
        embedding_config_hash?: string | null;
        /**
         * Hash of the llama parse parameters.
         */
        parsing_config_hash?: string | null;
        /**
         * Hash of the transform config.
         */
        transform_config_hash?: string | null;
    }
    /**
     * Schema for an embedding model config.
     */
    interface EmbeddingModelConfig {
        /**
         * Unique identifier
         */
        id: string;
        /**
         * The embedding configuration for the embedding model config.
         */
        embedding_config: PipelinesAPI.AzureOpenAIEmbeddingConfig | PipelinesAPI.CohereEmbeddingConfig | PipelinesAPI.GeminiEmbeddingConfig | PipelinesAPI.HuggingFaceInferenceAPIEmbeddingConfig | PipelinesAPI.OpenAIEmbeddingConfig | PipelinesAPI.VertexAIEmbeddingConfig | PipelinesAPI.BedrockEmbeddingConfig;
        /**
         * The name of the embedding model config.
         */
        name: string;
        project_id: string;
        /**
         * Creation datetime
         */
        created_at?: string | null;
        /**
         * Update datetime
         */
        updated_at?: string | null;
    }
}
/**
 * Schema for creating a pipeline.
 */
export interface PipelineCreate {
    name: string;
    /**
     * Schema for creating a data sink.
     */
    data_sink?: DataSinkCreate | null;
    /**
     * Data sink ID. When provided instead of data_sink, the data sink will be looked
     * up by ID.
     */
    data_sink_id?: string | null;
    embedding_config?: AzureOpenAIEmbeddingConfig | CohereEmbeddingConfig | GeminiEmbeddingConfig | HuggingFaceInferenceAPIEmbeddingConfig | OpenAIEmbeddingConfig | VertexAIEmbeddingConfig | BedrockEmbeddingConfig | null;
    /**
     * Embedding model config ID. When provided instead of embedding_config, the
     * embedding model config will be looked up by ID.
     */
    embedding_model_config_id?: string | null;
    /**
     * Settings that can be configured for how to use LlamaParse to parse files within
     * a LlamaCloud pipeline.
     */
    llama_parse_parameters?: LlamaParseParameters;
    /**
     * The ID of the ManagedPipeline this playground pipeline is linked to.
     */
    managed_pipeline_id?: string | null;
    /**
     * Metadata configuration for the pipeline.
     */
    metadata_config?: PipelineMetadataConfig | null;
    /**
     * Type of pipeline. Either PLAYGROUND or MANAGED.
     */
    pipeline_type?: PipelineType;
    /**
     * Preset retrieval parameters for the pipeline.
     */
    preset_retrieval_parameters?: PresetRetrievalParams;
    /**
     * Configuration for sparse embedding models used in hybrid search.
     *
     * This allows users to choose between Splade and BM25 models for sparse retrieval
     * in managed data sinks.
     */
    sparse_model_config?: SparseModelConfig | null;
    /**
     * Status of the pipeline deployment.
     */
    status?: string | null;
    /**
     * Configuration for the transformation.
     */
    transform_config?: AutoTransformConfig | AdvancedModeTransformConfig | null;
}
export interface PipelineMetadataConfig {
    /**
     * List of metadata keys to exclude from embeddings
     */
    excluded_embed_metadata_keys?: Array<string>;
    /**
     * List of metadata keys to exclude from LLM during retrieval
     */
    excluded_llm_metadata_keys?: Array<string>;
}
/**
 * Enum for representing the type of a pipeline
 */
export type PipelineType = 'PLAYGROUND' | 'MANAGED';
/**
 * Schema for the search params for an retrieval execution that can be preset for a
 * pipeline.
 */
export interface PresetRetrievalParams {
    /**
     * Alpha value for hybrid retrieval to determine the weights between dense and
     * sparse retrieval. 0 is sparse retrieval and 1 is dense retrieval.
     */
    alpha?: number | null;
    class_name?: string;
    /**
     * Minimum similarity score wrt query for retrieval
     */
    dense_similarity_cutoff?: number | null;
    /**
     * Number of nodes for dense retrieval.
     */
    dense_similarity_top_k?: number | null;
    /**
     * Enable reranking for retrieval
     */
    enable_reranking?: boolean | null;
    /**
     * Number of files to retrieve (only for retrieval mode files_via_metadata and
     * files_via_content).
     */
    files_top_k?: number | null;
    /**
     * Number of reranked nodes for returning.
     */
    rerank_top_n?: number | null;
    /**
     * The retrieval mode for the query.
     */
    retrieval_mode?: RetrievalMode;
    /**
     * @deprecated Whether to retrieve image nodes.
     */
    retrieve_image_nodes?: boolean;
    /**
     * Whether to retrieve page figure nodes.
     */
    retrieve_page_figure_nodes?: boolean;
    /**
     * Whether to retrieve page screenshot nodes.
     */
    retrieve_page_screenshot_nodes?: boolean;
    /**
     * Metadata filters for vector stores.
     */
    search_filters?: MetadataFilters | null;
    /**
     * JSON Schema that will be used to infer search_filters. Omit or leave as null to
     * skip inference.
     */
    search_filters_inference_schema?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Number of nodes for sparse retrieval.
     */
    sparse_similarity_top_k?: number | null;
}
export type RetrievalMode = 'chunks' | 'files_via_metadata' | 'files_via_content' | 'auto_routed';
/**
 * Configuration for sparse embedding models used in hybrid search.
 *
 * This allows users to choose between Splade and BM25 models for sparse retrieval
 * in managed data sinks.
 */
export interface SparseModelConfig {
    class_name?: string;
    /**
     * The sparse model type to use. 'bm25' uses Qdrant's FastEmbed BM25 model (default
     * for new pipelines), 'splade' uses HuggingFace Splade model, 'auto' selects based
     * on deployment mode (BYOC uses term frequency, Cloud uses Splade).
     */
    model_type?: 'splade' | 'bm25' | 'auto';
}
export interface VertexAIEmbeddingConfig {
    /**
     * Configuration for the VertexAI embedding model.
     */
    component?: VertexTextEmbedding;
    /**
     * Type of the embedding model.
     */
    type?: 'VERTEXAI_EMBEDDING';
}
export interface VertexTextEmbedding {
    /**
     * The client email for the VertexAI credentials.
     */
    client_email: string | null;
    /**
     * The default location to use when making API calls.
     */
    location: string;
    /**
     * The private key for the VertexAI credentials.
     */
    private_key: string | null;
    /**
     * The private key ID for the VertexAI credentials.
     */
    private_key_id: string | null;
    /**
     * The default GCP project to use when making Vertex API calls.
     */
    project: string;
    /**
     * The token URI for the VertexAI credentials.
     */
    token_uri: string | null;
    /**
     * Additional kwargs for the Vertex.
     */
    additional_kwargs?: {
        [key: string]: unknown;
    };
    class_name?: string;
    /**
     * The batch size for embedding calls.
     */
    embed_batch_size?: number;
    /**
     * The embedding mode to use.
     */
    embed_mode?: 'default' | 'classification' | 'clustering' | 'similarity' | 'retrieval';
    /**
     * The modelId of the VertexAI model to use.
     */
    model_name?: string;
    /**
     * The number of workers to use for async embedding calls.
     */
    num_workers?: number | null;
}
/**
 * Schema for the result of an retrieval execution.
 */
export interface PipelineRetrieveResponse {
    /**
     * The ID of the pipeline that the query was retrieved against.
     */
    pipeline_id: string;
    /**
     * The nodes retrieved by the pipeline for the given query.
     */
    retrieval_nodes: Array<PipelineRetrieveResponse.RetrievalNode>;
    class_name?: string;
    /**
     * @deprecated The image nodes retrieved by the pipeline for the given query.
     * Deprecated - will soon be replaced with 'page_screenshot_nodes'.
     */
    image_nodes?: Array<PageScreenshotNodeWithScore>;
    /**
     * Metadata filters for vector stores.
     */
    inferred_search_filters?: MetadataFilters | null;
    /**
     * Metadata associated with the retrieval execution
     */
    metadata?: {
        [key: string]: string;
    };
    /**
     * The page figure nodes retrieved by the pipeline for the given query.
     */
    page_figure_nodes?: Array<PageFigureNodeWithScore>;
    /**
     * The end-to-end latency for retrieval and reranking.
     */
    retrieval_latency?: {
        [key: string]: number;
    };
}
export declare namespace PipelineRetrieveResponse {
    /**
     * Same as NodeWithScore but type for node is a TextNode instead of BaseNode.
     * FastAPI doesn't accept abstract classes like BaseNode.
     */
    interface RetrievalNode {
        /**
         * Provided for backward compatibility.
         *
         * Note: we keep the field with the typo "seperator" to maintain backward
         * compatibility for serialized objects.
         */
        node: DocumentsAPI.TextNode;
        class_name?: string;
        score?: number | null;
    }
}
export type PipelineListResponse = Array<Pipeline>;
export interface PipelineCreateParams {
    /**
     * Body param
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
     * Body param: Schema for creating a data sink.
     */
    data_sink?: DataSinkCreate | null;
    /**
     * Body param: Data sink ID. When provided instead of data_sink, the data sink will
     * be looked up by ID.
     */
    data_sink_id?: string | null;
    /**
     * Body param
     */
    embedding_config?: AzureOpenAIEmbeddingConfig | CohereEmbeddingConfig | GeminiEmbeddingConfig | HuggingFaceInferenceAPIEmbeddingConfig | OpenAIEmbeddingConfig | VertexAIEmbeddingConfig | BedrockEmbeddingConfig | null;
    /**
     * Body param: Embedding model config ID. When provided instead of
     * embedding_config, the embedding model config will be looked up by ID.
     */
    embedding_model_config_id?: string | null;
    /**
     * Body param: Settings that can be configured for how to use LlamaParse to parse
     * files within a LlamaCloud pipeline.
     */
    llama_parse_parameters?: LlamaParseParameters;
    /**
     * Body param: The ID of the ManagedPipeline this playground pipeline is linked to.
     */
    managed_pipeline_id?: string | null;
    /**
     * Body param: Metadata configuration for the pipeline.
     */
    metadata_config?: PipelineMetadataConfig | null;
    /**
     * Body param: Type of pipeline. Either PLAYGROUND or MANAGED.
     */
    pipeline_type?: PipelineType;
    /**
     * Body param: Preset retrieval parameters for the pipeline.
     */
    preset_retrieval_parameters?: PresetRetrievalParams;
    /**
     * Body param: Configuration for sparse embedding models used in hybrid search.
     *
     * This allows users to choose between Splade and BM25 models for sparse retrieval
     * in managed data sinks.
     */
    sparse_model_config?: SparseModelConfig | null;
    /**
     * Body param: Status of the pipeline deployment.
     */
    status?: string | null;
    /**
     * Body param: Configuration for the transformation.
     */
    transform_config?: AutoTransformConfig | AdvancedModeTransformConfig | null;
}
export interface PipelineRetrieveParams {
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
     * Body param: Alpha value for hybrid retrieval to determine the weights between
     * dense and sparse retrieval. 0 is sparse retrieval and 1 is dense retrieval.
     */
    alpha?: number | null;
    /**
     * Body param
     */
    class_name?: string;
    /**
     * Body param: Minimum similarity score wrt query for retrieval
     */
    dense_similarity_cutoff?: number | null;
    /**
     * Body param: Number of nodes for dense retrieval.
     */
    dense_similarity_top_k?: number | null;
    /**
     * Body param: Enable reranking for retrieval
     */
    enable_reranking?: boolean | null;
    /**
     * Body param: Number of files to retrieve (only for retrieval mode
     * files_via_metadata and files_via_content).
     */
    files_top_k?: number | null;
    /**
     * Body param: Number of reranked nodes for returning.
     */
    rerank_top_n?: number | null;
    /**
     * Body param: The retrieval mode for the query.
     */
    retrieval_mode?: RetrievalMode;
    /**
     * @deprecated Body param: Whether to retrieve image nodes.
     */
    retrieve_image_nodes?: boolean;
    /**
     * Body param: Whether to retrieve page figure nodes.
     */
    retrieve_page_figure_nodes?: boolean;
    /**
     * Body param: Whether to retrieve page screenshot nodes.
     */
    retrieve_page_screenshot_nodes?: boolean;
    /**
     * Body param: Metadata filters for vector stores.
     */
    search_filters?: MetadataFilters | null;
    /**
     * Body param: JSON Schema that will be used to infer search_filters. Omit or leave
     * as null to skip inference.
     */
    search_filters_inference_schema?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Body param: Number of nodes for sparse retrieval.
     */
    sparse_similarity_top_k?: number | null;
}
export interface PipelineUpdateParams {
    /**
     * Schema for creating a data sink.
     */
    data_sink?: DataSinkCreate | null;
    /**
     * Data sink ID. When provided instead of data_sink, the data sink will be looked
     * up by ID.
     */
    data_sink_id?: string | null;
    embedding_config?: AzureOpenAIEmbeddingConfig | CohereEmbeddingConfig | GeminiEmbeddingConfig | HuggingFaceInferenceAPIEmbeddingConfig | OpenAIEmbeddingConfig | VertexAIEmbeddingConfig | BedrockEmbeddingConfig | null;
    /**
     * Embedding model config ID. When provided instead of embedding_config, the
     * embedding model config will be looked up by ID.
     */
    embedding_model_config_id?: string | null;
    /**
     * Settings that can be configured for how to use LlamaParse to parse files within
     * a LlamaCloud pipeline.
     */
    llama_parse_parameters?: LlamaParseParameters | null;
    /**
     * The ID of the ManagedPipeline this playground pipeline is linked to.
     */
    managed_pipeline_id?: string | null;
    /**
     * Metadata configuration for the pipeline.
     */
    metadata_config?: PipelineMetadataConfig | null;
    name?: string | null;
    /**
     * Schema for the search params for an retrieval execution that can be preset for a
     * pipeline.
     */
    preset_retrieval_parameters?: PresetRetrievalParams | null;
    /**
     * Configuration for sparse embedding models used in hybrid search.
     *
     * This allows users to choose between Splade and BM25 models for sparse retrieval
     * in managed data sinks.
     */
    sparse_model_config?: SparseModelConfig | null;
    /**
     * Status of the pipeline deployment.
     */
    status?: string | null;
    /**
     * Configuration for the transformation.
     */
    transform_config?: AutoTransformConfig | AdvancedModeTransformConfig | null;
}
export interface PipelineListParams {
    organization_id?: string | null;
    pipeline_name?: string | null;
    /**
     * Enum for representing the type of a pipeline
     */
    pipeline_type?: PipelineType | null;
    project_id?: string | null;
    project_name?: string | null;
}
export interface PipelineGetStatusParams {
    full_details?: boolean | null;
}
export interface PipelineUpsertParams {
    /**
     * Body param
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
     * Body param: Schema for creating a data sink.
     */
    data_sink?: DataSinkCreate | null;
    /**
     * Body param: Data sink ID. When provided instead of data_sink, the data sink will
     * be looked up by ID.
     */
    data_sink_id?: string | null;
    /**
     * Body param
     */
    embedding_config?: AzureOpenAIEmbeddingConfig | CohereEmbeddingConfig | GeminiEmbeddingConfig | HuggingFaceInferenceAPIEmbeddingConfig | OpenAIEmbeddingConfig | VertexAIEmbeddingConfig | BedrockEmbeddingConfig | null;
    /**
     * Body param: Embedding model config ID. When provided instead of
     * embedding_config, the embedding model config will be looked up by ID.
     */
    embedding_model_config_id?: string | null;
    /**
     * Body param: Settings that can be configured for how to use LlamaParse to parse
     * files within a LlamaCloud pipeline.
     */
    llama_parse_parameters?: LlamaParseParameters;
    /**
     * Body param: The ID of the ManagedPipeline this playground pipeline is linked to.
     */
    managed_pipeline_id?: string | null;
    /**
     * Body param: Metadata configuration for the pipeline.
     */
    metadata_config?: PipelineMetadataConfig | null;
    /**
     * Body param: Type of pipeline. Either PLAYGROUND or MANAGED.
     */
    pipeline_type?: PipelineType;
    /**
     * Body param: Preset retrieval parameters for the pipeline.
     */
    preset_retrieval_parameters?: PresetRetrievalParams;
    /**
     * Body param: Configuration for sparse embedding models used in hybrid search.
     *
     * This allows users to choose between Splade and BM25 models for sparse retrieval
     * in managed data sinks.
     */
    sparse_model_config?: SparseModelConfig | null;
    /**
     * Body param: Status of the pipeline deployment.
     */
    status?: string | null;
    /**
     * Body param: Configuration for the transformation.
     */
    transform_config?: AutoTransformConfig | AdvancedModeTransformConfig | null;
}
export declare namespace Pipelines {
    export { type AdvancedModeTransformConfig as AdvancedModeTransformConfig, type AutoTransformConfig as AutoTransformConfig, type AzureOpenAIEmbedding as AzureOpenAIEmbedding, type AzureOpenAIEmbeddingConfig as AzureOpenAIEmbeddingConfig, type BedrockEmbedding as BedrockEmbedding, type BedrockEmbeddingConfig as BedrockEmbeddingConfig, type CohereEmbedding as CohereEmbedding, type CohereEmbeddingConfig as CohereEmbeddingConfig, type DataSinkCreate as DataSinkCreate, type GeminiEmbedding as GeminiEmbedding, type GeminiEmbeddingConfig as GeminiEmbeddingConfig, type HuggingFaceInferenceAPIEmbedding as HuggingFaceInferenceAPIEmbedding, type HuggingFaceInferenceAPIEmbeddingConfig as HuggingFaceInferenceAPIEmbeddingConfig, type LlamaParseParameters as LlamaParseParameters, type LlmParameters as LlmParameters, type ManagedIngestionStatusResponse as ManagedIngestionStatusResponse, type MessageRole as MessageRole, type MetadataFilters as MetadataFilters, type OpenAIEmbedding as OpenAIEmbedding, type OpenAIEmbeddingConfig as OpenAIEmbeddingConfig, type PageFigureNodeWithScore as PageFigureNodeWithScore, type PageScreenshotNodeWithScore as PageScreenshotNodeWithScore, type Pipeline as Pipeline, type PipelineCreate as PipelineCreate, type PipelineMetadataConfig as PipelineMetadataConfig, type PipelineType as PipelineType, type PresetRetrievalParams as PresetRetrievalParams, type RetrievalMode as RetrievalMode, type SparseModelConfig as SparseModelConfig, type VertexAIEmbeddingConfig as VertexAIEmbeddingConfig, type VertexTextEmbedding as VertexTextEmbedding, type PipelineRetrieveResponse as PipelineRetrieveResponse, type PipelineListResponse as PipelineListResponse, type PipelineCreateParams as PipelineCreateParams, type PipelineRetrieveParams as PipelineRetrieveParams, type PipelineUpdateParams as PipelineUpdateParams, type PipelineListParams as PipelineListParams, type PipelineGetStatusParams as PipelineGetStatusParams, type PipelineUpsertParams as PipelineUpsertParams, };
    export { Sync as Sync };
    export { DataSources as DataSources, type PipelineDataSource as PipelineDataSource, type DataSourceGetDataSourcesResponse as DataSourceGetDataSourcesResponse, type DataSourceUpdateDataSourcesResponse as DataSourceUpdateDataSourcesResponse, type DataSourceUpdateParams as DataSourceUpdateParams, type DataSourceGetStatusParams as DataSourceGetStatusParams, type DataSourceSyncParams as DataSourceSyncParams, type DataSourceUpdateDataSourcesParams as DataSourceUpdateDataSourcesParams, };
    export { Images as Images, type ImageGetPageFigureResponse as ImageGetPageFigureResponse, type ImageGetPageScreenshotResponse as ImageGetPageScreenshotResponse, type ImageListPageFiguresResponse as ImageListPageFiguresResponse, type ImageListPageScreenshotsResponse as ImageListPageScreenshotsResponse, type ImageGetPageFigureParams as ImageGetPageFigureParams, type ImageGetPageScreenshotParams as ImageGetPageScreenshotParams, type ImageListPageFiguresParams as ImageListPageFiguresParams, type ImageListPageScreenshotsParams as ImageListPageScreenshotsParams, };
    export { Files as Files, type PipelineFile as PipelineFile, type FileCreateResponse as FileCreateResponse, type FileGetStatusCountsResponse as FileGetStatusCountsResponse, type PipelineFilesPaginatedPipelineFiles as PipelineFilesPaginatedPipelineFiles, type FileCreateParams as FileCreateParams, type FileUpdateParams as FileUpdateParams, type FileListParams as FileListParams, type FileDeleteParams as FileDeleteParams, type FileGetStatusParams as FileGetStatusParams, type FileGetStatusCountsParams as FileGetStatusCountsParams, };
    export { Metadata as Metadata, type MetadataCreateResponse as MetadataCreateResponse, type MetadataCreateParams as MetadataCreateParams, };
    export { Documents as Documents, type CloudDocument as CloudDocument, type CloudDocumentCreate as CloudDocumentCreate, type TextNode as TextNode, type DocumentCreateResponse as DocumentCreateResponse, type DocumentGetChunksResponse as DocumentGetChunksResponse, type DocumentSyncResponse as DocumentSyncResponse, type DocumentUpsertResponse as DocumentUpsertResponse, type CloudDocumentsPaginatedCloudDocuments as CloudDocumentsPaginatedCloudDocuments, type DocumentCreateParams as DocumentCreateParams, type DocumentListParams as DocumentListParams, type DocumentDeleteParams as DocumentDeleteParams, type DocumentGetParams as DocumentGetParams, type DocumentGetChunksParams as DocumentGetChunksParams, type DocumentGetStatusParams as DocumentGetStatusParams, type DocumentSyncParams as DocumentSyncParams, type DocumentUpsertParams as DocumentUpsertParams, };
}
//# sourceMappingURL=pipelines.d.ts.map