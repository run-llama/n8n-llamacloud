// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ParsingAPI from '../../parsing';
import * as JobsAPI from '../../classifier/jobs';
import * as ExtractionJobsAPI from '../../extraction/jobs';
import { APIPromise } from '../../../core/api-promise';
import { PagePromise, PaginatedBatchItems, type PaginatedBatchItemsParams } from '../../../core/pagination';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class JobItems extends APIResource {
  /**
   * List items in a batch job with optional status filtering.
   *
   * Useful for finding failed items, viewing completed items, or debugging issues.
   * Results are paginated for performance with configurable limit and offset
   * parameters.
   */
  list(
    jobID: string,
    query: JobItemListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<JobItemListResponsesPaginatedBatchItems, JobItemListResponse> {
    return this._client.getAPIList(
      path`/api/v1/beta/batch-processing/${jobID}/items`,
      PaginatedBatchItems<JobItemListResponse>,
      { query, ...options },
    );
  }

  /**
   * Get all processing results for a specific item (lineage query).
   *
   * Shows complete processing history including what operations have been performed,
   * with what parameters, and where outputs are stored. Useful for understanding
   * what processing has already been done to avoid redundant work. Optionally filter
   * by job type to see only specific processing operations.
   */
  getProcessingResults(
    itemID: string,
    query: JobItemGetProcessingResultsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<JobItemGetProcessingResultsResponse> {
    return this._client.get(path`/api/v1/beta/batch-processing/items/${itemID}/processing-results`, {
      query,
      ...options,
    });
  }
}

export type JobItemListResponsesPaginatedBatchItems = PaginatedBatchItems<JobItemListResponse>;

/**
 * Detailed information about an item in a batch job.
 */
export interface JobItemListResponse {
  /**
   * ID of the item
   */
  item_id: string;

  /**
   * Name of the item
   */
  item_name: string;

  /**
   * Processing status of this item
   */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped' | 'cancelled';

  /**
   * When processing completed for this item
   */
  completed_at?: string | null;

  effective_at?: string;

  /**
   * Error message for the latest job attempt, if any.
   */
  error_message?: string | null;

  /**
   * Job ID for the underlying processing job (links to parse/extract job results)
   */
  job_id?: string | null;

  /**
   * The job record ID associated with this status, if any.
   */
  job_record_id?: string | null;

  /**
   * Reason item was skipped (e.g., 'already_processed', 'size_limit_exceeded')
   */
  skip_reason?: string | null;

  /**
   * When processing started for this item
   */
  started_at?: string | null;
}

/**
 * Response containing all processing results for an item.
 */
export interface JobItemGetProcessingResultsResponse {
  /**
   * ID of the source item
   */
  item_id: string;

  /**
   * Name of the source item
   */
  item_name: string;

  /**
   * List of all processing operations performed on this item
   */
  processing_results?: Array<JobItemGetProcessingResultsResponse.ProcessingResult>;
}

export namespace JobItemGetProcessingResultsResponse {
  /**
   * A processing result with lineage information.
   */
  export interface ProcessingResult {
    /**
     * Source item that was processed
     */
    item_id: string;

    /**
     * Job configuration used for processing
     */
    job_config: ProcessingResult.BatchParseJobRecordCreate | JobsAPI.ClassifyJob;

    /**
     * Type of processing performed
     */
    job_type: 'parse' | 'extract' | 'classify';

    /**
     * S3 location of processing output
     */
    output_s3_path: string;

    /**
     * Hash of parameters for deduplication
     */
    parameters_hash: string;

    /**
     * When this processing occurred
     */
    processed_at: string;

    /**
     * Unique identifier for this result
     */
    result_id: string;

    /**
     * Metadata about processing output.
     *
     * Currently empty - will be populated with job-type-specific metadata fields in
     * the future.
     */
    output_metadata?: unknown | null;
  }

  export namespace ProcessingResult {
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
    export interface BatchParseJobRecordCreate {
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
      partitions?: { [key: string]: string };

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

    export namespace BatchParseJobRecordCreate {
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
      export interface Parameters {
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
        custom_metadata?: { [key: string]: unknown } | null;

        disable_image_extraction?: boolean | null;

        disable_ocr?: boolean | null;

        disable_reconstruction?: boolean | null;

        do_not_cache?: boolean | null;

        do_not_unroll_columns?: boolean | null;

        enable_cost_optimizer?: boolean | null;

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
        resource_info?: { [key: string]: unknown } | null;

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
}

export interface JobItemListParams extends PaginatedBatchItemsParams {
  organization_id?: string | null;

  project_id?: string | null;

  /**
   * Status of an individual file in a batch job.
   */
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped' | 'cancelled' | null;
}

export interface JobItemGetProcessingResultsParams {
  /**
   * Type of batch processing operation.
   */
  job_type?: 'parse' | 'extract' | 'classify' | null;

  organization_id?: string | null;

  project_id?: string | null;
}

export declare namespace JobItems {
  export {
    type JobItemListResponse as JobItemListResponse,
    type JobItemGetProcessingResultsResponse as JobItemGetProcessingResultsResponse,
    type JobItemListResponsesPaginatedBatchItems as JobItemListResponsesPaginatedBatchItems,
    type JobItemListParams as JobItemListParams,
    type JobItemGetProcessingResultsParams as JobItemGetProcessingResultsParams,
  };
}
