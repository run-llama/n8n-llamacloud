import { APIResource } from "../../../core/resource.mjs";
import * as ParsingAPI from "../../parsing.mjs";
import * as JobsAPI from "../../classifier/jobs.mjs";
import * as ExtractionJobsAPI from "../../extraction/jobs.mjs";
import * as JobItemsAPI from "./job-items.mjs";
import { JobItemGetProcessingResultsParams, JobItemGetProcessingResultsResponse, JobItemListParams, JobItemListResponse, JobItemListResponsesPaginatedBatchItems, JobItems } from "./job-items.mjs";
import { APIPromise } from "../../../core/api-promise.mjs";
import { PagePromise, PaginatedBatchItems, type PaginatedBatchItemsParams } from "../../../core/pagination.mjs";
import { RequestOptions } from "../../../internal/request-options.mjs";
export declare class Batch extends APIResource {
    jobItems: JobItemsAPI.JobItems;
    /**
     * Create a new batch processing job for a directory.
     *
     * Processes all files in the specified directory according to the job
     * configuration. The job runs asynchronously and you can monitor progress using
     * the job status endpoint.
     */
    create(params: BatchCreateParams, options?: RequestOptions): APIPromise<BatchCreateResponse>;
    /**
     * List all batch processing jobs for a project with optional filtering.
     *
     * Returns a paginated list of batch jobs with filters for directory, job type, and
     * status. Useful for viewing job history, monitoring progress, and finding
     * specific jobs.
     */
    list(query?: BatchListParams | null | undefined, options?: RequestOptions): PagePromise<BatchListResponsesPaginatedBatchItems, BatchListResponse>;
    /**
     * Cancel a running batch processing job.
     *
     * Stops processing and marks all pending items as cancelled. Items currently being
     * processed may complete depending on their state.
     */
    cancel(jobID: string, params: BatchCancelParams, options?: RequestOptions): APIPromise<BatchCancelResponse>;
    /**
     * Get detailed status of a batch processing job.
     *
     * Returns current progress, file counts, and estimated completion time.
     */
    getStatus(jobID: string, query?: BatchGetStatusParams | null | undefined, options?: RequestOptions): APIPromise<BatchGetStatusResponse>;
}
export type BatchListResponsesPaginatedBatchItems = PaginatedBatchItems<BatchListResponse>;
/**
 * Response schema for a batch processing job.
 */
export interface BatchCreateResponse {
    /**
     * Unique identifier for the batch job
     */
    id: string;
    /**
     * Type of processing operation
     */
    job_type: 'parse' | 'extract' | 'classify';
    /**
     * Project this job belongs to
     */
    project_id: string;
    /**
     * Current status of the job
     */
    status: 'pending' | 'running' | 'dispatched' | 'completed' | 'failed' | 'cancelled';
    /**
     * Total number of items in the job
     */
    total_items: number;
    /**
     * Timestamp when job completed
     */
    completed_at?: string | null;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Directory being processed
     */
    directory_id?: string | null;
    effective_at?: string;
    /**
     * Error message for the latest job attempt, if any.
     */
    error_message?: string | null;
    /**
     * Number of items that failed processing
     */
    failed_items?: number;
    /**
     * The job record ID associated with this status, if any.
     */
    job_record_id?: string | null;
    /**
     * Number of items processed so far
     */
    processed_items?: number;
    /**
     * Number of items skipped (already processed or size limit)
     */
    skipped_items?: number;
    /**
     * Timestamp when job processing started
     */
    started_at?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
    /**
     * Temporal workflow ID for this batch job
     */
    workflow_id?: string | null;
}
/**
 * Response schema for a batch processing job.
 */
export interface BatchListResponse {
    /**
     * Unique identifier for the batch job
     */
    id: string;
    /**
     * Type of processing operation
     */
    job_type: 'parse' | 'extract' | 'classify';
    /**
     * Project this job belongs to
     */
    project_id: string;
    /**
     * Current status of the job
     */
    status: 'pending' | 'running' | 'dispatched' | 'completed' | 'failed' | 'cancelled';
    /**
     * Total number of items in the job
     */
    total_items: number;
    /**
     * Timestamp when job completed
     */
    completed_at?: string | null;
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Directory being processed
     */
    directory_id?: string | null;
    effective_at?: string;
    /**
     * Error message for the latest job attempt, if any.
     */
    error_message?: string | null;
    /**
     * Number of items that failed processing
     */
    failed_items?: number;
    /**
     * The job record ID associated with this status, if any.
     */
    job_record_id?: string | null;
    /**
     * Number of items processed so far
     */
    processed_items?: number;
    /**
     * Number of items skipped (already processed or size limit)
     */
    skipped_items?: number;
    /**
     * Timestamp when job processing started
     */
    started_at?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
    /**
     * Temporal workflow ID for this batch job
     */
    workflow_id?: string | null;
}
/**
 * Response after cancelling a batch job.
 */
export interface BatchCancelResponse {
    /**
     * ID of the cancelled job
     */
    job_id: string;
    /**
     * Confirmation message
     */
    message: string;
    /**
     * Number of items processed before cancellation
     */
    processed_items: number;
    /**
     * New status (should be 'cancelled')
     */
    status: 'pending' | 'running' | 'dispatched' | 'completed' | 'failed' | 'cancelled';
}
/**
 * Detailed status response for a batch processing job.
 */
export interface BatchGetStatusResponse {
    /**
     * Response schema for a batch processing job.
     */
    job: BatchGetStatusResponse.Job;
    /**
     * Percentage of items processed (0-100)
     */
    progress_percentage: number;
}
export declare namespace BatchGetStatusResponse {
    /**
     * Response schema for a batch processing job.
     */
    interface Job {
        /**
         * Unique identifier for the batch job
         */
        id: string;
        /**
         * Type of processing operation
         */
        job_type: 'parse' | 'extract' | 'classify';
        /**
         * Project this job belongs to
         */
        project_id: string;
        /**
         * Current status of the job
         */
        status: 'pending' | 'running' | 'dispatched' | 'completed' | 'failed' | 'cancelled';
        /**
         * Total number of items in the job
         */
        total_items: number;
        /**
         * Timestamp when job completed
         */
        completed_at?: string | null;
        /**
         * Creation datetime
         */
        created_at?: string | null;
        /**
         * Directory being processed
         */
        directory_id?: string | null;
        effective_at?: string;
        /**
         * Error message for the latest job attempt, if any.
         */
        error_message?: string | null;
        /**
         * Number of items that failed processing
         */
        failed_items?: number;
        /**
         * The job record ID associated with this status, if any.
         */
        job_record_id?: string | null;
        /**
         * Number of items processed so far
         */
        processed_items?: number;
        /**
         * Number of items skipped (already processed or size limit)
         */
        skipped_items?: number;
        /**
         * Timestamp when job processing started
         */
        started_at?: string | null;
        /**
         * Update datetime
         */
        updated_at?: string | null;
        /**
         * Temporal workflow ID for this batch job
         */
        workflow_id?: string | null;
    }
}
export interface BatchCreateParams {
    /**
     * Body param: Job configuration for batch processing. Can be
     * BatchParseJobRecordCreate or ClassifyJob.
     */
    job_config: BatchCreateParams.BatchParseJobRecordCreate | JobsAPI.ClassifyJob;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Maximum number of files to process before calling continue-as-new.
     * If None, continue-as-new is called after every batch. (only used in directory
     * mode)
     */
    continue_as_new_threshold?: number | null;
    /**
     * Body param: ID of the directory containing files to process
     */
    directory_id?: string | null;
    /**
     * Body param: List of specific item IDs to process. Either this or directory_id
     * must be provided.
     */
    item_ids?: Array<string> | null;
    /**
     * Body param: Number of files to fetch per batch from the directory (only used in
     * directory mode)
     */
    page_size?: number;
    /**
     * Header param
     */
    'temporal-namespace'?: string;
}
export declare namespace BatchCreateParams {
    /**
     * Batch-specific parse job record for batch processing.
     *
     * This model contains the metadata and configuration for a batch parse job, but
     * excludes file-specific information. It's used as input to the batch parent
     * workflow and combined with DirectoryFile data to create full
     * ParseJobRecordCreate instances for each file.
     *
     * Attributes: job_name: Must be PARSE_RAW_FILE partitions: Partitions for job
     * output location parameters: Generic parse configuration (BatchParseJobConfig)
     * session_id: Upstream request ID for tracking correlation_id: Correlation ID for
     * cross-service tracking parent_job_execution_id: Parent job execution ID if
     * nested user_id: User who created the job project_id: Project this job belongs to
     * webhook_url: Optional webhook URL for job completion notifications
     */
    interface BatchParseJobRecordCreate {
        /**
         * The correlation ID for this job. Used for tracking the job across services.
         */
        correlation_id?: string | null;
        job_name?: 'parse_raw_file_job';
        /**
         * Generic parse job configuration for batch processing.
         *
         * This model contains the parsing configuration that applies to all files in a
         * batch, but excludes file-specific fields like file_name, file_id, etc. Those
         * file-specific fields are populated from DirectoryFile data when creating
         * individual ParseJobRecordCreate instances for each file.
         *
         * The fields in this model should be generic settings that apply uniformly to all
         * files being processed in the batch.
         */
        parameters?: BatchParseJobRecordCreate.Parameters | null;
        /**
         * The ID of the parent job execution.
         */
        parent_job_execution_id?: string | null;
        /**
         * The partitions for this execution. Used for determining where to save job
         * output.
         */
        partitions?: {
            [key: string]: string;
        };
        /**
         * The ID of the project this job belongs to.
         */
        project_id?: string | null;
        /**
         * The upstream request ID that created this job. Used for tracking the job across
         * services.
         */
        session_id?: string | null;
        /**
         * The ID of the user that created this job
         */
        user_id?: string | null;
        /**
         * The URL that needs to be called at the end of the parsing job.
         */
        webhook_url?: string | null;
    }
    namespace BatchParseJobRecordCreate {
        /**
         * Generic parse job configuration for batch processing.
         *
         * This model contains the parsing configuration that applies to all files in a
         * batch, but excludes file-specific fields like file_name, file_id, etc. Those
         * file-specific fields are populated from DirectoryFile data when creating
         * individual ParseJobRecordCreate instances for each file.
         *
         * The fields in this model should be generic settings that apply uniformly to all
         * files being processed in the batch.
         */
        interface Parameters {
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
            /**
             * The custom metadata to attach to the documents.
             */
            custom_metadata?: {
                [key: string]: unknown;
            } | null;
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
            /**
             * The region for the input S3 bucket.
             */
            input_s3_region?: string | null;
            input_url?: string | null;
            internal_is_screenshot_job?: boolean | null;
            invalidate_cache?: boolean | null;
            is_formatting_instruction?: boolean | null;
            job_timeout_extra_time_per_page_in_seconds?: number | null;
            job_timeout_in_seconds?: number | null;
            keep_page_separator_when_merging_tables?: boolean | null;
            /**
             * The language.
             */
            lang?: string;
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
            /**
             * If specified, llamaParse will save the output to the specified path. All output
             * file will use this 'prefix' should be a valid s3:// url
             */
            output_s3_path_prefix?: string | null;
            /**
             * The region for the output S3 bucket.
             */
            output_s3_region?: string | null;
            output_tables_as_HTML?: boolean | null;
            /**
             * The output bucket.
             */
            outputBucket?: string | null;
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
            /**
             * The pipeline ID.
             */
            pipeline_id?: string | null;
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
            /**
             * The resource info about the file
             */
            resource_info?: {
                [key: string]: unknown;
            } | null;
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
            type?: 'parse';
            use_vendor_multimodal_model?: boolean | null;
            user_prompt?: string | null;
            vendor_multimodal_api_key?: string | null;
            vendor_multimodal_model_name?: string | null;
            version?: string | null;
            /**
             * The outbound webhook configurations
             */
            webhook_configurations?: Array<ExtractionJobsAPI.WebhookConfiguration> | null;
            webhook_url?: string | null;
        }
    }
}
export interface BatchListParams extends PaginatedBatchItemsParams {
    /**
     * Filter by directory ID
     */
    directory_id?: string | null;
    /**
     * Type of batch processing operation.
     */
    job_type?: 'parse' | 'extract' | 'classify' | null;
    organization_id?: string | null;
    project_id?: string | null;
    /**
     * Status of a batch processing job.
     */
    status?: 'pending' | 'running' | 'dispatched' | 'completed' | 'failed' | 'cancelled' | null;
}
export interface BatchCancelParams {
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Optional reason for cancelling the job
     */
    reason?: string | null;
    /**
     * Header param
     */
    'temporal-namespace'?: string;
}
export interface BatchGetStatusParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Batch {
    export { type BatchCreateResponse as BatchCreateResponse, type BatchListResponse as BatchListResponse, type BatchCancelResponse as BatchCancelResponse, type BatchGetStatusResponse as BatchGetStatusResponse, type BatchListResponsesPaginatedBatchItems as BatchListResponsesPaginatedBatchItems, type BatchCreateParams as BatchCreateParams, type BatchListParams as BatchListParams, type BatchCancelParams as BatchCancelParams, type BatchGetStatusParams as BatchGetStatusParams, };
    export { JobItems as JobItems, type JobItemListResponse as JobItemListResponse, type JobItemGetProcessingResultsResponse as JobItemGetProcessingResultsResponse, type JobItemListResponsesPaginatedBatchItems as JobItemListResponsesPaginatedBatchItems, type JobItemListParams as JobItemListParams, type JobItemGetProcessingResultsParams as JobItemGetProcessingResultsParams, };
}
//# sourceMappingURL=batch.d.mts.map