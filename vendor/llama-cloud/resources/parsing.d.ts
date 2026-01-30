import { APIResource } from "../core/resource.js";
import * as ParsingAPI from "./parsing.js";
import { APIPromise } from "../core/api-promise.js";
import { PagePromise, PaginatedClassifyJobs, type PaginatedClassifyJobsParams } from "../core/pagination.js";
import { RequestOptions } from "../internal/request-options.js";
import { type Uploadable } from "../core/uploads.js";
import { PollingOptions } from "../core/polling.js";
export declare class Parsing extends APIResource {
    /**
     * Parse a file by file ID, URL, or direct file upload.
     */
    create(params: ParsingCreateParams & {
        upload_file?: Uploadable;
    }, options?: RequestOptions): APIPromise<ParsingCreateResponse>;
    /**
     * List parse jobs for the current project with optional status filtering and
     * pagination.
     */
    list(query?: ParsingListParams | null | undefined, options?: RequestOptions): PagePromise<ParsingListResponsesPaginatedClassifyJobs, ParsingListResponse>;
    /**
     * Retrieve parse job with optional content or metadata.
     */
    get(jobID: string, query?: ParsingGetParams | null | undefined, options?: RequestOptions): APIPromise<ParsingGetResponse>;
    /**
     * Wait for a parse job to complete by polling until it reaches a terminal state.
     *
     * This method polls the job status at regular intervals until the job completes
     * successfully or fails. It uses configurable backoff strategies to optimize
     * polling behavior.
     *
     * @param jobID - The ID of the parse job to wait for
     * @param options - Polling configuration options
     * @returns The completed ParsingGetResponse
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // Create a parse job
     * const job = await client.parsing.create({
     *   tier: 'fast',
     *   version: 'latest',
     *   source_url: 'https://example.com/document.pdf'
     * });
     *
     * // Wait for it to complete
     * const result = await client.parsing.waitForCompletion(
     *   job.id,
     *   { verbose: true }
     * );
     * ```
     */
    waitForCompletion(jobID: string, query?: ParsingGetParams, options?: PollingOptions & RequestOptions): Promise<ParsingGetResponse>;
    /**
     * Parse a file and wait for it to complete, returning the result.
     *
     * This is a convenience method that combines create() and waitForCompletion()
     * into a single call for the most common end-to-end workflow.
     *
     * @param params - Parse job creation parameters (including optional file for direct upload)
     * @param options - Polling configuration and request options
     * @returns The parse result (ParsingGetResponse) with job status and optional result data
     * @throws {PollingTimeoutError} If the job doesn't complete within the timeout period
     * @throws {PollingError} If the job fails or is cancelled
     *
     * @example
     * ```typescript
     * import { LlamaCloud } from 'llama-cloud';
     *
     * const client = new LlamaCloud({ apiKey: '...' });
     *
     * // One-shot: parse, wait for completion, and get result
     * const result = await client.parsing.parse({
     *   tier: 'fast',
     *   version: 'latest',
     *   source_url: 'https://example.com/document.pdf',
     *   expand: ['text', 'markdown']
     * }, { verbose: true });
     *
     * // Result is ready to use immediately
     * console.log(result.text);
     * console.log(result.markdown);
     * ```
     *
     * @example
     * ```typescript
     * // Parse with file upload
     * import fs from 'fs';
     *
     * const result = await client.parsing.parse({
     *   tier: 'fast',
     *   version: 'latest',
     *   upload_file: fs.createReadStream('./document.pdf'),
     *   expand: ['text', 'markdown']
     * });
     * ```
     */
    parse(params: ParsingCreateParams & {
        upload_file?: Uploadable;
        expand?: Array<string>;
    }, options?: PollingOptions & RequestOptions): Promise<ParsingGetResponse>;
}
export type ParsingListResponsesPaginatedClassifyJobs = PaginatedClassifyJobs<ParsingListResponse>;
/**
 * Bounding box with coordinates and optional metadata.
 */
export interface BBox {
    /**
     * Height of the bounding box
     */
    h: number;
    /**
     * Width of the bounding box
     */
    w: number;
    /**
     * X coordinate of the bounding box
     */
    x: number;
    /**
     * Y coordinate of the bounding box
     */
    y: number;
    /**
     * Confidence score
     */
    confidence?: number | null;
    /**
     * End index in the text
     */
    endIndex?: number | null;
    /**
     * Label for the bounding box
     */
    label?: string | null;
    /**
     * Start index in the text
     */
    startIndex?: number | null;
}
/**
 * Enum for representing the different available page error handling modes.
 */
export type FailPageMode = 'raw_text' | 'blank_page' | 'error_message';
export interface ListItem {
    /**
     * List of nested text or list items
     */
    items: Array<ListItem.TextItem | ListItem>;
    /**
     * Whether the list is ordered or unordered
     */
    ordered: boolean;
    /**
     * List of bounding boxes
     */
    bBox?: Array<BBox> | null;
    /**
     * List item type
     */
    type?: 'list';
}
export declare namespace ListItem {
    interface TextItem {
        /**
         * Markdown representation preserving formatting
         */
        md: string;
        /**
         * Text content
         */
        value: string;
        /**
         * List of bounding boxes
         */
        bBox?: Array<ParsingAPI.BBox> | null;
        /**
         * Text item type
         */
        type?: 'text';
    }
}
/**
 * Enum for supported file extensions.
 */
export type LlamaParseSupportedFileExtensions = '.pdf' | '.doc' | '.docx' | '.docm' | '.dot' | '.dotx' | '.dotm' | '.rtf' | '.wps' | '.wpd' | '.sxw' | '.stw' | '.sxg' | '.pages' | '.mw' | '.mcw' | '.uot' | '.uof' | '.uos' | '.uop' | '.ppt' | '.pptx' | '.pot' | '.pptm' | '.potx' | '.potm' | '.key' | '.odp' | '.odg' | '.otp' | '.fopd' | '.sxi' | '.sti' | '.epub' | '.vsd' | '.vsdx' | '.vdx' | '.vsdm' | '.jpg' | '.jpeg' | '.png' | '.gif' | '.bmp' | '.svg' | '.tiff' | '.webp' | '.html' | '.htm' | '.xls' | '.xlsx' | '.xlsm' | '.xlsb' | '.xlw' | '.csv' | '.dif' | '.sylk' | '.slk' | '.prn' | '.numbers' | '.et' | '.ods' | '.fods' | '.uos1' | '.uos2' | '.dbf' | '.wk1' | '.wk2' | '.wk3' | '.wk4' | '.wks' | '.wq1' | '.wq2' | '.wb1' | '.wb2' | '.wb3' | '.qpw' | '.xlr' | '.eth' | '.tsv';
/**
 * Response schema for a parsing job.
 */
export interface ParsingJob {
    id: string;
    /**
     * Enum for representing the status of a job
     */
    status: StatusEnum;
    error_code?: string | null;
    error_message?: string | null;
}
/**
 * Enum for representing the languages supported by the parser.
 */
export type ParsingLanguages = 'af' | 'az' | 'bs' | 'cs' | 'cy' | 'da' | 'de' | 'en' | 'es' | 'et' | 'fr' | 'ga' | 'hr' | 'hu' | 'id' | 'is' | 'it' | 'ku' | 'la' | 'lt' | 'lv' | 'mi' | 'ms' | 'mt' | 'nl' | 'no' | 'oc' | 'pi' | 'pl' | 'pt' | 'ro' | 'rs_latin' | 'sk' | 'sl' | 'sq' | 'sv' | 'sw' | 'tl' | 'tr' | 'uz' | 'vi' | 'ar' | 'fa' | 'ug' | 'ur' | 'bn' | 'as' | 'mni' | 'ru' | 'rs_cyrillic' | 'be' | 'bg' | 'uk' | 'mn' | 'abq' | 'ady' | 'kbd' | 'ava' | 'dar' | 'inh' | 'che' | 'lbe' | 'lez' | 'tab' | 'tjk' | 'hi' | 'mr' | 'ne' | 'bh' | 'mai' | 'ang' | 'bho' | 'mah' | 'sck' | 'new' | 'gom' | 'sa' | 'bgc' | 'th' | 'ch_sim' | 'ch_tra' | 'ja' | 'ko' | 'ta' | 'te' | 'kn';
/**
 * Enum for representing the mode of parsing to be used.
 */
export type ParsingMode = 'parse_page_without_llm' | 'parse_page_with_llm' | 'parse_page_with_lvm' | 'parse_page_with_agent' | 'parse_page_with_layout_agent' | 'parse_document_with_llm' | 'parse_document_with_lvm' | 'parse_document_with_agent';
/**
 * Enum for representing the status of a job
 */
export type StatusEnum = 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED';
/**
 * Response schema for a parse job.
 */
export interface ParsingCreateResponse {
    /**
     * Unique identifier for the parse job
     */
    id: string;
    /**
     * Project this job belongs to
     */
    project_id: string;
    /**
     * Current status of the job (e.g., pending, running, completed, failed, cancelled)
     */
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Error message if job failed
     */
    error_message?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * Response schema for a parse job.
 */
export interface ParsingListResponse {
    /**
     * Unique identifier for the parse job
     */
    id: string;
    /**
     * Project this job belongs to
     */
    project_id: string;
    /**
     * Current status of the job (e.g., pending, running, completed, failed, cancelled)
     */
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Error message if job failed
     */
    error_message?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
/**
 * Parse result response with job status and optional content or metadata.
 *
 * The job field is always included. Other fields are included based on expand
 * parameters.
 */
export interface ParsingGetResponse {
    /**
     * Parse job status and metadata
     */
    job: ParsingGetResponse.Job;
    /**
     * Metadata for all extracted images.
     */
    images_content_metadata?: ParsingGetResponse.ImagesContentMetadata | null;
    /**
     * Structured JSON result (if requested)
     */
    items?: ParsingGetResponse.Items | null;
    /**
     * Markdown result (if requested)
     */
    markdown?: ParsingGetResponse.Markdown | null;
    /**
     * Result containing page-level metadata for the parsed document.
     */
    metadata?: ParsingGetResponse.Metadata | null;
    /**
     * Metadata including size, existence, and presigned URLs for result files
     */
    result_content_metadata?: {
        [key: string]: ParsingGetResponse.ResultContentMetadata;
    } | null;
    /**
     * Plain text result (if requested)
     */
    text?: ParsingGetResponse.Text | null;
}
export declare namespace ParsingGetResponse {
    /**
     * Parse job status and metadata
     */
    interface Job {
        /**
         * Unique identifier for the parse job
         */
        id: string;
        /**
         * Project this job belongs to
         */
        project_id: string;
        /**
         * Current status of the job (e.g., pending, running, completed, failed, cancelled)
         */
        status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
        /**
         * Creation datetime
         */
        created_at?: string | null;
        /**
         * Error message if job failed
         */
        error_message?: string | null;
        /**
         * Update datetime
         */
        updated_at?: string | null;
    }
    /**
     * Metadata for all extracted images.
     */
    interface ImagesContentMetadata {
        /**
         * List of image metadata with presigned URLs
         */
        images: Array<ImagesContentMetadata.Image>;
        /**
         * Total number of extracted images
         */
        total_count: number;
    }
    namespace ImagesContentMetadata {
        /**
         * Metadata for a single extracted image.
         */
        interface Image {
            /**
             * Image filename (e.g., 'image_0.png')
             */
            filename: string;
            /**
             * Index of the image in the extraction order
             */
            index: number;
            /**
             * MIME type of the image
             */
            content_type?: string | null;
            /**
             * Presigned URL to download the image
             */
            presigned_url?: string | null;
            /**
             * Size of the image file in bytes
             */
            size_bytes?: number | null;
        }
    }
    /**
     * Structured JSON result (if requested)
     */
    interface Items {
        /**
         * List of structured pages or failed page entries
         */
        pages: Array<Items.StructuredResultPage | Items.FailedStructuredPage>;
    }
    namespace Items {
        interface StructuredResultPage {
            /**
             * List of structured items on the page
             */
            items: Array<StructuredResultPage.TextItem | StructuredResultPage.HeadingItem | ParsingAPI.ListItem | StructuredResultPage.CodeItem | StructuredResultPage.TableItem | StructuredResultPage.ImageItem | StructuredResultPage.LinkItem>;
            /**
             * Height of the page in points
             */
            page_height: number;
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Width of the page in points
             */
            page_width: number;
            /**
             * Success indicator
             */
            success?: true;
        }
        namespace StructuredResultPage {
            interface TextItem {
                /**
                 * Markdown representation preserving formatting
                 */
                md: string;
                /**
                 * Text content
                 */
                value: string;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Text item type
                 */
                type?: 'text';
            }
            interface HeadingItem {
                /**
                 * Heading level (1-6)
                 */
                level: number;
                /**
                 * Markdown representation preserving formatting
                 */
                md: string;
                /**
                 * Heading text content
                 */
                value: string;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Heading item type
                 */
                type?: 'heading';
            }
            interface CodeItem {
                /**
                 * Markdown representation with code fences
                 */
                md: string;
                /**
                 * Code content
                 */
                value: string;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Programming language identifier
                 */
                language?: string | null;
                /**
                 * Code block item type
                 */
                type?: 'code';
            }
            interface TableItem {
                /**
                 * CSV representation of the table
                 */
                csv: string;
                /**
                 * HTML representation of the table
                 */
                html: string;
                /**
                 * Markdown representation of the table
                 */
                md: string;
                /**
                 * Table data as array of arrays (string, number, or null)
                 */
                rows: Array<Array<string | number | null>>;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Table item type
                 */
                type?: 'table';
            }
            interface ImageItem {
                /**
                 * Image caption
                 */
                caption: string;
                /**
                 * Markdown representation of the image
                 */
                md: string;
                /**
                 * URL to the image
                 */
                url: string;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Image item type
                 */
                type?: 'image';
            }
            interface LinkItem {
                /**
                 * Display text of the link
                 */
                text: string;
                /**
                 * URL of the link
                 */
                url: string;
                /**
                 * List of bounding boxes
                 */
                bBox?: Array<ParsingAPI.BBox> | null;
                /**
                 * Link item type
                 */
                type?: 'link';
            }
        }
        interface FailedStructuredPage {
            /**
             * Error message describing the failure
             */
            error: string;
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Failure indicator
             */
            success?: boolean;
        }
    }
    /**
     * Markdown result (if requested)
     */
    interface Markdown {
        /**
         * List of markdown pages or failed page entries
         */
        pages: Array<Markdown.MarkdownResultPage | Markdown.FailedMarkdownPage>;
    }
    namespace Markdown {
        interface MarkdownResultPage {
            /**
             * Markdown content of the page
             */
            markdown: string;
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Success indicator
             */
            success?: true;
        }
        interface FailedMarkdownPage {
            /**
             * Error message describing the failure
             */
            error: string;
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Failure indicator
             */
            success?: boolean;
        }
    }
    /**
     * Result containing page-level metadata for the parsed document.
     */
    interface Metadata {
        /**
         * List of page metadata entries
         */
        pages: Array<Metadata.Page>;
    }
    namespace Metadata {
        /**
         * Page-level metadata including confidence scores and presentation-specific data.
         */
        interface Page {
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Confidence score for the page parsing (0-1)
             */
            confidence?: number | null;
            /**
             * Original orientation angle of the page in degrees
             */
            original_orientation_angle?: number | null;
            /**
             * Printed page number as it appears in the document
             */
            printed_page_number?: string | null;
            /**
             * Section name from presentation slides
             */
            slide_section_name?: string | null;
            /**
             * Speaker notes from presentation slides
             */
            speaker_notes?: string | null;
        }
    }
    /**
     * Metadata about a specific result type stored in S3.
     */
    interface ResultContentMetadata {
        /**
         * Size of the result file in S3 (bytes)
         */
        size_bytes: number;
        /**
         * Whether the result file exists in S3
         */
        exists?: boolean;
        /**
         * Presigned URL to download the result file
         */
        presigned_url?: string | null;
    }
    /**
     * Plain text result (if requested)
     */
    interface Text {
        /**
         * List of text pages
         */
        pages: Array<Text.Page>;
    }
    namespace Text {
        interface Page {
            /**
             * Page number of the document
             */
            page_number: number;
            /**
             * Plain text content of the page
             */
            text: string;
        }
    }
}
export interface ParsingCreateParams {
    /**
     * Body param: The parsing tier to use
     */
    tier: 'fast' | 'cost_effective' | 'agentic' | 'agentic_plus';
    /**
     * Body param: Version of the tier configuration
     */
    version: '2026-01-08' | '2025-12-31' | '2025-12-18' | '2025-12-11' | 'latest' | (string & {});
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Options for agentic tier parsing (with AI agents).
     */
    agentic_options?: ParsingCreateParams.AgenticOptions | null;
    /**
     * Body param: Name of the client making the parsing request
     */
    client_name?: string | null;
    /**
     * Body param: Document crop box boundaries
     */
    crop_box?: ParsingCreateParams.CropBox;
    /**
     * Body param: Whether to disable caching for this parsing job
     */
    disable_cache?: boolean | null;
    /**
     * Body param: Options for fast tier parsing (without AI).
     */
    fast_options?: unknown | null;
    /**
     * Body param: ID of an existing file in the project to parse
     */
    file_id?: string | null;
    /**
     * Body param: HTTP proxy URL for network requests (only used with source_url)
     */
    http_proxy?: string | null;
    /**
     * Body param: Input format-specific parsing options
     */
    input_options?: ParsingCreateParams.InputOptions;
    /**
     * Body param: Output format and styling options
     */
    output_options?: ParsingCreateParams.OutputOptions;
    /**
     * Body param: Page range selection options
     */
    page_ranges?: ParsingCreateParams.PageRanges;
    /**
     * Body param: Job processing control and failure handling
     */
    processing_control?: ParsingCreateParams.ProcessingControl;
    /**
     * Body param: Processing options shared across all tiers
     */
    processing_options?: ParsingCreateParams.ProcessingOptions;
    /**
     * Body param: Source URL to fetch document from
     */
    source_url?: string | null;
    /**
     * Body param: List of webhook configurations for notifications
     */
    webhook_configurations?: Array<ParsingCreateParams.WebhookConfiguration>;
}
export declare namespace ParsingCreateParams {
    /**
     * Options for agentic tier parsing (with AI agents).
     */
    interface AgenticOptions {
        /**
         * Custom prompt for AI-powered parsing
         */
        custom_prompt?: string | null;
    }
    /**
     * Document crop box boundaries
     */
    interface CropBox {
        /**
         * Bottom boundary of crop box as ratio (0-1)
         */
        bottom?: number | null;
        /**
         * Left boundary of crop box as ratio (0-1)
         */
        left?: number | null;
        /**
         * Right boundary of crop box as ratio (0-1)
         */
        right?: number | null;
        /**
         * Top boundary of crop box as ratio (0-1)
         */
        top?: number | null;
    }
    /**
     * Input format-specific parsing options
     */
    interface InputOptions {
        /**
         * HTML-specific parsing options
         */
        html?: InputOptions.HTML;
        /**
         * PDF-specific parsing options
         */
        pdf?: unknown;
        /**
         * Presentation-specific parsing options
         */
        presentation?: InputOptions.Presentation;
        /**
         * Spreadsheet-specific parsing options
         */
        spreadsheet?: InputOptions.Spreadsheet;
    }
    namespace InputOptions {
        /**
         * HTML-specific parsing options
         */
        interface HTML {
            /**
             * Make all HTML elements visible during parsing
             */
            make_all_elements_visible?: boolean | null;
            /**
             * Remove fixed position elements from HTML
             */
            remove_fixed_elements?: boolean | null;
            /**
             * Remove navigation elements from HTML
             */
            remove_navigation_elements?: boolean | null;
        }
        /**
         * Presentation-specific parsing options
         */
        interface Presentation {
            /**
             * Extract out of bounds content in presentation slides
             */
            out_of_bounds_content?: boolean | null;
            /**
             * Skip extraction of embedded data for charts in presentation slides
             */
            skip_embedded_data?: boolean | null;
        }
        /**
         * Spreadsheet-specific parsing options
         */
        interface Spreadsheet {
            /**
             * Detect and extract sub-tables within spreadsheet cells
             */
            detect_sub_tables_in_sheets?: boolean | null;
            /**
             * Force re-computation of spreadsheet cells containing formulas
             */
            force_formula_computation_in_sheets?: boolean | null;
        }
    }
    /**
     * Output format and styling options
     */
    interface OutputOptions {
        /**
         * PDF export options
         */
        export_pdf?: OutputOptions.ExportPdf;
        /**
         * Extract printed page numbers from the document
         */
        extract_printed_page_number?: boolean | null;
        /**
         * Image categories to save: 'screenshot' (full page), 'embedded' (images in
         * document), 'layout' (cropped images from layout detection). If not set or empty,
         * no images are saved.
         */
        images_to_save?: Array<'screenshot' | 'embedded' | 'layout'> | null;
        /**
         * Markdown output formatting options
         */
        markdown?: OutputOptions.Markdown;
        /**
         * Spatial text output options
         */
        spatial_text?: OutputOptions.SpatialText;
        /**
         * Table export as spreadsheet options
         */
        tables_as_spreadsheet?: OutputOptions.TablesAsSpreadsheet;
    }
    namespace OutputOptions {
        /**
         * PDF export options
         */
        interface ExportPdf {
            /**
             * Whether this option is enabled
             */
            enable?: boolean | null;
        }
        /**
         * Markdown output formatting options
         */
        interface Markdown {
            /**
             * Add annotations to links in markdown output
             */
            annotate_links?: boolean | null;
            /**
             * Page formatting options for markdown
             */
            pages?: Markdown.Pages;
            /**
             * Table formatting options for markdown
             */
            tables?: Markdown.Tables;
        }
        namespace Markdown {
            /**
             * Page formatting options for markdown
             */
            interface Pages {
                /**
                 * Merge tables that span across pages in markdown output
                 */
                merge_tables_across_pages_in_markdown?: boolean | null;
            }
            /**
             * Table formatting options for markdown
             */
            interface Tables {
                /**
                 * Use compact formatting for markdown tables
                 */
                compact_markdown_tables?: boolean | null;
                /**
                 * Separator for multiline content in markdown tables
                 */
                markdown_table_multiline_separator?: string | null;
                /**
                 * Output tables in markdown format
                 */
                output_tables_as_markdown?: boolean | null;
            }
        }
        /**
         * Spatial text output options
         */
        interface SpatialText {
            /**
             * Keep column structure intact without unrolling
             */
            do_not_unroll_columns?: boolean | null;
            /**
             * Page formatting options for spatial text
             */
            pages?: SpatialText.Pages | null;
            /**
             * Preserve text alignment across page boundaries
             */
            preserve_layout_alignment_across_pages?: boolean | null;
            /**
             * Include very small text in spatial output
             */
            preserve_very_small_text?: boolean | null;
        }
        namespace SpatialText {
            /**
             * Page formatting options for spatial text
             */
            interface Pages {
                /**
                 * Merge tables that span across pages in markdown output
                 */
                merge_tables_across_pages_in_markdown?: boolean | null;
            }
        }
        /**
         * Table export as spreadsheet options
         */
        interface TablesAsSpreadsheet {
            /**
             * Whether this option is enabled
             */
            enable?: boolean | null;
            /**
             * Automatically guess sheet names when exporting tables
             */
            guess_sheet_name?: boolean;
        }
    }
    /**
     * Page range selection options
     */
    interface PageRanges {
        /**
         * Maximum number of pages to process
         */
        max_pages?: number | null;
        /**
         * Specific pages to process (e.g., '1,3,5-8') using 1-based indexing
         */
        target_pages?: string | null;
    }
    /**
     * Job processing control and failure handling
     */
    interface ProcessingControl {
        /**
         * Conditions that determine job failure
         */
        job_failure_conditions?: ProcessingControl.JobFailureConditions;
        /**
         * Timeout configuration for parsing jobs
         */
        timeouts?: ProcessingControl.Timeouts;
    }
    namespace ProcessingControl {
        /**
         * Conditions that determine job failure
         */
        interface JobFailureConditions {
            /**
             * Maximum ratio of pages allowed to fail (0-1)
             */
            allowed_page_failure_ratio?: number | null;
            /**
             * Fail job if buggy fonts are detected
             */
            fail_on_buggy_font?: boolean | null;
            /**
             * Fail job if image extraction encounters errors
             */
            fail_on_image_extraction_error?: boolean | null;
            /**
             * Fail job if image OCR encounters errors
             */
            fail_on_image_ocr_error?: boolean | null;
            /**
             * Fail job if markdown reconstruction encounters errors
             */
            fail_on_markdown_reconstruction_error?: boolean | null;
        }
        /**
         * Timeout configuration for parsing jobs
         */
        interface Timeouts {
            /**
             * Base timeout in seconds (max 30 minutes)
             */
            base_in_seconds?: number | null;
            /**
             * Additional timeout per page in seconds (max 5 minutes)
             */
            extra_time_per_page_in_seconds?: number | null;
        }
    }
    /**
     * Processing options shared across all tiers
     */
    interface ProcessingOptions {
        /**
         * Whether to use aggressive table extraction
         */
        aggressive_table_extraction?: boolean | null;
        /**
         * Configuration for auto mode parsing with triggers and parsing options
         */
        auto_mode_configuration?: Array<ProcessingOptions.AutoModeConfiguration> | null;
        /**
         * Whether to disable heuristics like outlined table extraction and adaptive long
         * table handling
         */
        disable_heuristics?: boolean | null;
        /**
         * Options for ignoring specific text types
         */
        ignore?: ProcessingOptions.Ignore;
        /**
         * OCR configuration parameters
         */
        ocr_parameters?: ProcessingOptions.OcrParameters;
    }
    namespace ProcessingOptions {
        /**
         * A single entry in the auto mode configuration array.
         */
        interface AutoModeConfiguration {
            /**
             * Configuration for parsing in auto mode (V2 format).
             *
             * This uses V2 API naming conventions. The backend service will convert these to
             * the V1 format expected by the llamaparse worker.
             */
            parsing_conf: AutoModeConfiguration.ParsingConf;
            /**
             * Single glob pattern to match against filename
             */
            filename_match_glob?: string | null;
            /**
             * List of glob patterns to match against filename
             */
            filename_match_glob_list?: Array<string> | null;
            /**
             * Regex pattern to match against filename
             */
            filename_regexp?: string | null;
            /**
             * Regex mode flags (e.g., 'i' for case-insensitive)
             */
            filename_regexp_mode?: string | null;
            /**
             * Trigger if page contains a full-page image (scanned page detection)
             */
            full_page_image_in_page?: boolean | null;
            /**
             * Threshold for full page image detection (0.0-1.0, default 0.8)
             */
            full_page_image_in_page_threshold?: number | string | null;
            /**
             * Trigger if page contains non-screenshot images
             */
            image_in_page?: boolean | null;
            /**
             * Trigger if page contains this layout element type
             */
            layout_element_in_page?: string | null;
            /**
             * Confidence threshold for layout element detection
             */
            layout_element_in_page_confidence_threshold?: number | string | null;
            /**
             * Trigger if page has more than N charts
             */
            page_contains_at_least_n_charts?: number | string | null;
            /**
             * Trigger if page has more than N images
             */
            page_contains_at_least_n_images?: number | string | null;
            /**
             * Trigger if page has more than N layout elements
             */
            page_contains_at_least_n_layout_elements?: number | string | null;
            /**
             * Trigger if page has more than N lines
             */
            page_contains_at_least_n_lines?: number | string | null;
            /**
             * Trigger if page has more than N links
             */
            page_contains_at_least_n_links?: number | string | null;
            /**
             * Trigger if page has more than N numeric words
             */
            page_contains_at_least_n_numbers?: number | string | null;
            /**
             * Trigger if page has more than N% numeric words
             */
            page_contains_at_least_n_percent_numbers?: number | string | null;
            /**
             * Trigger if page has more than N tables
             */
            page_contains_at_least_n_tables?: number | string | null;
            /**
             * Trigger if page has more than N words
             */
            page_contains_at_least_n_words?: number | string | null;
            /**
             * Trigger if page has fewer than N charts
             */
            page_contains_at_most_n_charts?: number | string | null;
            /**
             * Trigger if page has fewer than N images
             */
            page_contains_at_most_n_images?: number | string | null;
            /**
             * Trigger if page has fewer than N layout elements
             */
            page_contains_at_most_n_layout_elements?: number | string | null;
            /**
             * Trigger if page has fewer than N lines
             */
            page_contains_at_most_n_lines?: number | string | null;
            /**
             * Trigger if page has fewer than N links
             */
            page_contains_at_most_n_links?: number | string | null;
            /**
             * Trigger if page has fewer than N numeric words
             */
            page_contains_at_most_n_numbers?: number | string | null;
            /**
             * Trigger if page has fewer than N% numeric words
             */
            page_contains_at_most_n_percent_numbers?: number | string | null;
            /**
             * Trigger if page has fewer than N tables
             */
            page_contains_at_most_n_tables?: number | string | null;
            /**
             * Trigger if page has fewer than N words
             */
            page_contains_at_most_n_words?: number | string | null;
            /**
             * Trigger if page has more than N characters
             */
            page_longer_than_n_chars?: number | string | null;
            /**
             * Trigger on pages with markdown extraction errors
             */
            page_md_error?: boolean | null;
            /**
             * Trigger if page has fewer than N characters
             */
            page_shorter_than_n_chars?: number | string | null;
            /**
             * Regex pattern to match in page content
             */
            regexp_in_page?: string | null;
            /**
             * Regex mode flags for regexp_in_page
             */
            regexp_in_page_mode?: string | null;
            /**
             * Trigger if page contains a table
             */
            table_in_page?: boolean | null;
            /**
             * Trigger if page text/markdown contains this string
             */
            text_in_page?: string | null;
            /**
             * How to combine multiple trigger conditions: 'and' (all must match, default) or
             * 'or' (any can match)
             */
            trigger_mode?: string | null;
        }
        namespace AutoModeConfiguration {
            /**
             * Configuration for parsing in auto mode (V2 format).
             *
             * This uses V2 API naming conventions. The backend service will convert these to
             * the V1 format expected by the llamaparse worker.
             */
            interface ParsingConf {
                /**
                 * Whether to use adaptive long table handling
                 */
                adaptive_long_table?: boolean | null;
                /**
                 * Whether to use aggressive table extraction
                 */
                aggressive_table_extraction?: boolean | null;
                /**
                 * Crop box options for auto mode parsing configuration.
                 */
                crop_box?: ParsingConf.CropBox | null;
                /**
                 * Custom prompt for AI-powered parsing
                 */
                custom_prompt?: string | null;
                /**
                 * Whether to extract layout information
                 */
                extract_layout?: boolean | null;
                /**
                 * Whether to use high resolution OCR
                 */
                high_res_ocr?: boolean | null;
                /**
                 * Ignore options for auto mode parsing configuration.
                 */
                ignore?: ParsingConf.Ignore | null;
                /**
                 * Primary language of the document
                 */
                language?: string | null;
                /**
                 * Whether to use outlined table extraction
                 */
                outlined_table_extraction?: boolean | null;
                /**
                 * Presentation-specific options for auto mode parsing configuration.
                 */
                presentation?: ParsingConf.Presentation | null;
                /**
                 * Spatial text options for auto mode parsing configuration.
                 */
                spatial_text?: ParsingConf.SpatialText | null;
                /**
                 * The parsing tier to use
                 */
                tier?: 'fast' | 'cost_effective' | 'agentic' | 'agentic_plus' | null;
                /**
                 * Version of the tier configuration
                 */
                version?: '2026-01-08' | '2025-12-31' | '2025-12-18' | '2025-12-11' | 'latest' | (string & {}) | null;
            }
            namespace ParsingConf {
                /**
                 * Crop box options for auto mode parsing configuration.
                 */
                interface CropBox {
                    /**
                     * Bottom boundary of crop box as ratio (0-1)
                     */
                    bottom?: number | null;
                    /**
                     * Left boundary of crop box as ratio (0-1)
                     */
                    left?: number | null;
                    /**
                     * Right boundary of crop box as ratio (0-1)
                     */
                    right?: number | null;
                    /**
                     * Top boundary of crop box as ratio (0-1)
                     */
                    top?: number | null;
                }
                /**
                 * Ignore options for auto mode parsing configuration.
                 */
                interface Ignore {
                    /**
                     * Whether to ignore diagonal text in the document
                     */
                    ignore_diagonal_text?: boolean | null;
                    /**
                     * Whether to ignore hidden text in the document
                     */
                    ignore_hidden_text?: boolean | null;
                }
                /**
                 * Presentation-specific options for auto mode parsing configuration.
                 */
                interface Presentation {
                    /**
                     * Extract out of bounds content in presentation slides
                     */
                    out_of_bounds_content?: boolean | null;
                    /**
                     * Skip extraction of embedded data for charts in presentation slides
                     */
                    skip_embedded_data?: boolean | null;
                }
                /**
                 * Spatial text options for auto mode parsing configuration.
                 */
                interface SpatialText {
                    /**
                     * Keep column structure intact without unrolling
                     */
                    do_not_unroll_columns?: boolean | null;
                    /**
                     * Merge tables that span across pages in markdown output
                     */
                    merge_tables_across_pages_in_markdown?: boolean | null;
                    /**
                     * Preserve text alignment across page boundaries
                     */
                    preserve_layout_alignment_across_pages?: boolean | null;
                    /**
                     * Include very small text in spatial output
                     */
                    preserve_very_small_text?: boolean | null;
                }
            }
        }
        /**
         * Options for ignoring specific text types
         */
        interface Ignore {
            /**
             * Whether to ignore diagonal text in the document
             */
            ignore_diagonal_text?: boolean | null;
            /**
             * Whether to ignore hidden text in the document
             */
            ignore_hidden_text?: boolean | null;
            /**
             * Whether to ignore text that appears within images
             */
            ignore_text_in_image?: boolean | null;
        }
        /**
         * OCR configuration parameters
         */
        interface OcrParameters {
            /**
             * List of languages to use for OCR processing
             */
            languages?: Array<ParsingAPI.ParsingLanguages> | null;
        }
    }
    interface WebhookConfiguration {
        /**
         * List of events that trigger webhook notifications
         */
        webhook_events?: Array<string> | null;
        /**
         * Custom headers to include in webhook requests
         */
        webhook_headers?: {
            [key: string]: unknown;
        } | null;
        /**
         * Webhook URL for receiving parsing notifications
         */
        webhook_url?: string | null;
    }
}
export interface ParsingListParams extends PaginatedClassifyJobsParams {
    organization_id?: string | null;
    project_id?: string | null;
    /**
     * Filter by job status (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED)
     */
    status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | null;
}
export interface ParsingGetParams {
    /**
     * Fields to include: text, markdown, items, metadata, text_content_metadata,
     * markdown_content_metadata, items_content_metadata, metadata_content_metadata,
     * xlsx_content_metadata, output_pdf_content_metadata, images_content_metadata.
     * Metadata fields include presigned URLs.
     */
    expand?: Array<string>;
    /**
     * Filter to specific image filenames (optional). Example: image_0.png,image_1.jpg
     */
    image_filenames?: string | null;
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace Parsing {
    export { type BBox as BBox, type FailPageMode as FailPageMode, type ListItem as ListItem, type LlamaParseSupportedFileExtensions as LlamaParseSupportedFileExtensions, type ParsingJob as ParsingJob, type ParsingLanguages as ParsingLanguages, type ParsingMode as ParsingMode, type StatusEnum as StatusEnum, type ParsingCreateResponse as ParsingCreateResponse, type ParsingListResponse as ParsingListResponse, type ParsingGetResponse as ParsingGetResponse, type ParsingListResponsesPaginatedClassifyJobs as ParsingListResponsesPaginatedClassifyJobs, type ParsingCreateParams as ParsingCreateParams, type ParsingListParams as ParsingListParams, type ParsingGetParams as ParsingGetParams, };
}
//# sourceMappingURL=parsing.d.ts.map