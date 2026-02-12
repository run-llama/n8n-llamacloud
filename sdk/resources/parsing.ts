// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as ParsingAPI from './parsing';
import { APIPromise } from '../core/api-promise';
import { PagePromise, PaginatedCursor, type PaginatedCursorParams } from '../core/pagination';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';
import { type Uploadable } from '../core/uploads';
import { multipartFormRequestOptions } from '../internal/uploads';
import { pollUntilComplete, PollingOptions } from '../core/polling';

export class Parsing extends APIResource {
  /**
   * Parse a file by file ID, URL, or direct file upload.
   */
  create(
    params: ParsingCreateParams & { upload_file?: Uploadable },
    options?: RequestOptions,
  ): APIPromise<ParsingCreateResponse> {
    const { organization_id, project_id, upload_file, ...body } = params;

    // If file is provided, use multipart upload endpoint
    if (upload_file) {
      // Prepare configuration as JSON string
      const configuration = JSON.stringify(body);

      return this._client.post(
        '/api/v2/parse/upload',
        multipartFormRequestOptions(
          {
            query: { organization_id, project_id },
            body: { configuration, file: upload_file },
            ...options,
          },
          this._client,
        ),
      );
    }

    // Otherwise use regular JSON endpoint
    return this._client.post('/api/v2/parse', { query: { organization_id, project_id }, body, ...options });
  }

  /**
   * List parse jobs for the current project with optional status filtering and
   * pagination.
   */
  list(
    query: ParsingListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<ParsingListResponsesPaginatedCursor, ParsingListResponse> {
    return this._client.getAPIList('/api/v2/parse', PaginatedCursor<ParsingListResponse>, {
      query,
      ...options,
    });
  }

  /**
   * Retrieve parse job with optional content or metadata.
   */
  get(
    jobID: string,
    query: ParsingGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ParsingGetResponse> {
    return this._client.get(path`/api/v2/parse/${jobID}`, { query, ...options });
  }

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
   *   tier: 'cost_effective',
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
  async waitForCompletion(
    jobID: string,
    query?: ParsingGetParams,
    options?: PollingOptions & RequestOptions,
  ): Promise<ParsingGetResponse> {
    const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};

    const getStatus = async (): Promise<ParsingGetResponse> => {
      return await this.get(jobID, query, requestOptions);
    };

    const isComplete = (result: ParsingGetResponse): boolean => {
      return result.job.status === 'COMPLETED';
    };

    const isError = (result: ParsingGetResponse): boolean => {
      return result.job.status === 'FAILED' || result.job.status === 'CANCELLED';
    };

    const getErrorMessage = (result: ParsingGetResponse): string => {
      const errorParts = [`Job ${jobID} failed with status: ${result.job.status}`];
      if (result.job.error_message) {
        errorParts.push(`Error: ${result.job.error_message}`);
      }
      return errorParts.join(' | ');
    };

    return await pollUntilComplete(getStatus, isComplete, isError, getErrorMessage, {
      pollingInterval,
      maxInterval,
      timeout: timeout || 2000.0,
      backoff,
      verbose,
    });
  }

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
   *   tier: 'cost_effective',
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
   *   tier: 'cost_effective',
   *   version: 'latest',
   *   upload_file: fs.createReadStream('./document.pdf'),
   *   expand: ['text', 'markdown']
   * });
   * ```
   */
  async parse(
    params: ParsingCreateParams & { upload_file?: Uploadable; expand?: Array<string> },
    options?: PollingOptions & RequestOptions,
  ): Promise<ParsingGetResponse> {
    const { expand, ...createParams } = params;
    const { pollingInterval, maxInterval, timeout, backoff, verbose, ...requestOptions } = options || {};

    if (!expand || (expand && expand.length == 0)) {
      throw new Error('you should pass a non-empty array as a parameter for `expand`');
    }

    // Create the parsing job
    const job = await this.create(createParams, requestOptions);

    // Build query params for get, only including defined values
    const getQuery: ParsingGetParams = {};
    if (params.organization_id !== undefined) {
      getQuery.organization_id = params.organization_id;
    }
    if (params.project_id !== undefined) {
      getQuery.project_id = params.project_id;
    }
    if (expand) {
      getQuery.expand = expand;
    }

    // Wait for completion and return the result with requested expansions
    return await this.waitForCompletion(job.id, getQuery, {
      pollingInterval,
      maxInterval,
      timeout: timeout || 2000.0,
      backoff,
      verbose,
      ...requestOptions,
    });
  }
}

export type ParsingListResponsesPaginatedCursor = PaginatedCursor<ParsingListResponse>;

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
  end_index?: number | null;

  /**
   * Label for the bounding box
   */
  label?: string | null;

  /**
   * Start index in the text
   */
  start_index?: number | null;
}

export interface CodeItem {
  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * Code content
   */
  value: string;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * Programming language identifier
   */
  language?: string | null;

  /**
   * Code block item type
   */
  type?: 'code';
}

/**
 * Enum for representing the different available page error handling modes.
 */
export type FailPageMode = 'raw_text' | 'blank_page' | 'error_message';

export interface FooterItem {
  /**
   * List of items within the footer
   */
  items: Array<TextItem | HeadingItem | ListItem | CodeItem | TableItem | ImageItem | LinkItem>;

  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * Page footer container
   */
  type?: 'footer';
}

export interface HeaderItem {
  /**
   * List of items within the header
   */
  items: Array<TextItem | HeadingItem | ListItem | CodeItem | TableItem | ImageItem | LinkItem>;

  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * Page header container
   */
  type?: 'header';
}

export interface HeadingItem {
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
  bbox?: Array<BBox> | null;

  /**
   * Heading item type
   */
  type?: 'heading';
}

export interface ImageItem {
  /**
   * Image caption
   */
  caption: string;

  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * URL to the image
   */
  url: string;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * Image item type
   */
  type?: 'image';
}

export interface LinkItem {
  /**
   * Markdown representation preserving formatting
   */
  md: string;

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
  bbox?: Array<BBox> | null;

  /**
   * Link item type
   */
  type?: 'link';
}

export interface ListItem {
  /**
   * List of nested text or list items
   */
  items: Array<TextItem | ListItem>;

  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * Whether the list is ordered or unordered
   */
  ordered: boolean;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * List item type
   */
  type?: 'list';
}

/**
 * Enum for supported file extensions.
 */
export type LlamaParseSupportedFileExtensions =
  | '.pdf'
  | '.abw'
  | '.awt'
  | '.cgm'
  | '.cwk'
  | '.doc'
  | '.docm'
  | '.docx'
  | '.dot'
  | '.dotm'
  | '.dotx'
  | '.fodg'
  | '.fodp'
  | '.fopd'
  | '.fodt'
  | '.fb2'
  | '.hwp'
  | '.lwp'
  | '.mcw'
  | '.mw'
  | '.mwd'
  | '.odf'
  | '.odt'
  | '.otg'
  | '.ott'
  | '.pages'
  | '.pbd'
  | '.psw'
  | '.rtf'
  | '.sda'
  | '.sdd'
  | '.sdp'
  | '.sdw'
  | '.sgl'
  | '.std'
  | '.stw'
  | '.sxd'
  | '.sxg'
  | '.sxm'
  | '.sxw'
  | '.uof'
  | '.uop'
  | '.uot'
  | '.vor'
  | '.wpd'
  | '.wps'
  | '.wpt'
  | '.wri'
  | '.wn'
  | '.xml'
  | '.zabw'
  | '.key'
  | '.odp'
  | '.odg'
  | '.otp'
  | '.pot'
  | '.potm'
  | '.potx'
  | '.ppt'
  | '.pptm'
  | '.pptx'
  | '.sti'
  | '.sxi'
  | '.vsd'
  | '.vsdm'
  | '.vsdx'
  | '.vdx'
  | '.bmp'
  | '.gif'
  | '.jpg'
  | '.jpeg'
  | '.png'
  | '.svg'
  | '.tif'
  | '.tiff'
  | '.webp'
  | '.htm'
  | '.html'
  | '.xhtm'
  | '.csv'
  | '.dbf'
  | '.dif'
  | '.et'
  | '.eth'
  | '.fods'
  | '.numbers'
  | '.ods'
  | '.ots'
  | '.prn'
  | '.qpw'
  | '.slk'
  | '.stc'
  | '.sxc'
  | '.sylk'
  | '.tsv'
  | '.uos1'
  | '.uos2'
  | '.uos'
  | '.wb1'
  | '.wb2'
  | '.wb3'
  | '.wk1'
  | '.wk2'
  | '.wk3'
  | '.wk4'
  | '.wks'
  | '.wq1'
  | '.wq2'
  | '.xlr'
  | '.xls'
  | '.xlsb'
  | '.xlsm'
  | '.xlsx'
  | '.xlw'
  | '.azw'
  | '.azw3'
  | '.azw4'
  | '.cb7'
  | '.cbc'
  | '.cbr'
  | '.cbz'
  | '.chm'
  | '.djvu'
  | '.epub'
  | '.fbz'
  | '.htmlz'
  | '.lit'
  | '.lrf'
  | '.md'
  | '.mobi'
  | '.pdb'
  | '.pml'
  | '.prc'
  | '.rb'
  | '.snb'
  | '.tcr'
  | '.txtz'
  | '.m4a'
  | '.mp3'
  | '.mp4'
  | '.mpeg'
  | '.mpga'
  | '.wav'
  | '.webm';

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
export type ParsingLanguages =
  | 'af'
  | 'az'
  | 'bs'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'et'
  | 'fr'
  | 'ga'
  | 'hr'
  | 'hu'
  | 'id'
  | 'is'
  | 'it'
  | 'ku'
  | 'la'
  | 'lt'
  | 'lv'
  | 'mi'
  | 'ms'
  | 'mt'
  | 'nl'
  | 'no'
  | 'oc'
  | 'pi'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'rs_latin'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sv'
  | 'sw'
  | 'tl'
  | 'tr'
  | 'uz'
  | 'vi'
  | 'ar'
  | 'fa'
  | 'ug'
  | 'ur'
  | 'bn'
  | 'as'
  | 'mni'
  | 'ru'
  | 'rs_cyrillic'
  | 'be'
  | 'bg'
  | 'uk'
  | 'mn'
  | 'abq'
  | 'ady'
  | 'kbd'
  | 'ava'
  | 'dar'
  | 'inh'
  | 'che'
  | 'lbe'
  | 'lez'
  | 'tab'
  | 'tjk'
  | 'hi'
  | 'mr'
  | 'ne'
  | 'bh'
  | 'mai'
  | 'ang'
  | 'bho'
  | 'mah'
  | 'sck'
  | 'new'
  | 'gom'
  | 'sa'
  | 'bgc'
  | 'th'
  | 'ch_sim'
  | 'ch_tra'
  | 'ja'
  | 'ko'
  | 'ta'
  | 'te'
  | 'kn';

/**
 * Enum for representing the mode of parsing to be used.
 */
export type ParsingMode =
  | 'parse_page_without_llm'
  | 'parse_page_with_llm'
  | 'parse_page_with_lvm'
  | 'parse_page_with_agent'
  | 'parse_page_with_layout_agent'
  | 'parse_document_with_llm'
  | 'parse_document_with_lvm'
  | 'parse_document_with_agent';

/**
 * Enum for representing the status of a job
 */
export type StatusEnum = 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL_SUCCESS' | 'CANCELLED';

export interface TableItem {
  /**
   * CSV representation of the table
   */
  csv: string;

  /**
   * HTML representation of the table
   */
  html: string;

  /**
   * Markdown representation preserving formatting
   */
  md: string;

  /**
   * Table data as array of arrays (string, number, or null)
   */
  rows: Array<Array<string | number | null>>;

  /**
   * List of bounding boxes
   */
  bbox?: Array<BBox> | null;

  /**
   * List of page numbers with tables that were merged into this table (e.g., [1, 2,
   * 3, 4])
   */
  merged_from_pages?: Array<number> | null;

  /**
   * Populated when merged into another table. Page number where the full merged
   * table begins (used on empty tables).
   */
  merged_into_page?: number | null;

  /**
   * Table item type
   */
  type?: 'table';
}

export interface TextItem {
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
  bbox?: Array<BBox> | null;

  /**
   * Text item type
   */
  type?: 'text';
}

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
   * User friendly name
   */
  name?: string | null;

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
   * User friendly name
   */
  name?: string | null;

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
   * Full raw markdown content (if requested)
   */
  markdown_full?: string | null;

  /**
   * Result containing metadata (page level and general) for the parsed document.
   */
  metadata?: ParsingGetResponse.Metadata | null;

  /**
   * Metadata including size, existence, and presigned URLs for result files
   */
  result_content_metadata?: { [key: string]: ParsingGetResponse.ResultContentMetadata } | null;

  /**
   * Plain text result (if requested)
   */
  text?: ParsingGetResponse.Text | null;

  /**
   * Full raw text content (if requested)
   */
  text_full?: string | null;
}

export namespace ParsingGetResponse {
  /**
   * Parse job status and metadata
   */
  export interface Job {
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
     * User friendly name
     */
    name?: string | null;

    /**
     * Update datetime
     */
    updated_at?: string | null;
  }

  /**
   * Metadata for all extracted images.
   */
  export interface ImagesContentMetadata {
    /**
     * List of image metadata with presigned URLs
     */
    images: Array<ImagesContentMetadata.Image>;

    /**
     * Total number of extracted images
     */
    total_count: number;
  }

  export namespace ImagesContentMetadata {
    /**
     * Metadata for a single extracted image.
     */
    export interface Image {
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
  export interface Items {
    /**
     * List of structured pages or failed page entries
     */
    pages: Array<Items.StructuredResultPage | Items.FailedStructuredPage>;
  }

  export namespace Items {
    export interface StructuredResultPage {
      /**
       * List of structured items on the page
       */
      items: Array<
        | ParsingAPI.TextItem
        | ParsingAPI.HeadingItem
        | ParsingAPI.ListItem
        | ParsingAPI.CodeItem
        | ParsingAPI.TableItem
        | ParsingAPI.ImageItem
        | ParsingAPI.LinkItem
        | ParsingAPI.HeaderItem
        | ParsingAPI.FooterItem
      >;

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
      success: true;
    }

    export interface FailedStructuredPage {
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
      success: false;
    }
  }

  /**
   * Markdown result (if requested)
   */
  export interface Markdown {
    /**
     * List of markdown pages or failed page entries
     */
    pages: Array<Markdown.MarkdownResultPage | Markdown.FailedMarkdownPage>;
  }

  export namespace Markdown {
    export interface MarkdownResultPage {
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
      success: true;

      /**
       * Footer of the page in markdown
       */
      footer?: string | null;

      /**
       * Header of the page in markdown
       */
      header?: string | null;
    }

    export interface FailedMarkdownPage {
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
      success: false;
    }
  }

  /**
   * Result containing metadata (page level and general) for the parsed document.
   */
  export interface Metadata {
    /**
     * List of page metadata entries
     */
    pages: Array<Metadata.Page>;
  }

  export namespace Metadata {
    /**
     * Page-level metadata including confidence scores and presentation-specific data.
     */
    export interface Page {
      /**
       * Page number of the document
       */
      page_number: number;

      /**
       * Confidence score for the page parsing (0-1)
       */
      confidence?: number | null;

      /**
       * Whether cost-optimized parsing was used for the page
       */
      cost_optimized?: boolean | null;

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

      /**
       * Whether auto mode was triggered for the page
       */
      triggered_auto_mode?: boolean | null;
    }
  }

  /**
   * Metadata about a specific result type stored in S3.
   */
  export interface ResultContentMetadata {
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
  export interface Text {
    /**
     * List of text pages
     */
    pages: Array<Text.Page>;
  }

  export namespace Text {
    export interface Page {
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
  version:
    | '2026-01-08'
    | '2025-12-31'
    | '2025-12-18'
    | '2025-12-11'
    | '2026-01-16'
    | '2026-01-21'
    | '2026-01-22'
    | '2026-01-24'
    | '2026-01-29'
    | 'latest'
    | (string & {});

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

export namespace ParsingCreateParams {
  /**
   * Options for agentic tier parsing (with AI agents).
   */
  export interface AgenticOptions {
    /**
     * Custom prompt for AI-powered parsing
     */
    custom_prompt?: string | null;
  }

  /**
   * Document crop box boundaries
   */
  export interface CropBox {
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
  export interface InputOptions {
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

  export namespace InputOptions {
    /**
     * HTML-specific parsing options
     */
    export interface HTML {
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
    export interface Presentation {
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
    export interface Spreadsheet {
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
  export interface OutputOptions {
    /**
     * Extract printed page numbers from the document
     */
    extract_printed_page_number?: boolean | null;

    /**
     * Image categories to save: 'screenshot' (full page), 'embedded' (images in
     * document), 'layout' (cropped images from layout detection). Empty list means no
     * images are saved.
     */
    images_to_save?: Array<'screenshot' | 'embedded' | 'layout'>;

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

  export namespace OutputOptions {
    /**
     * Markdown output formatting options
     */
    export interface Markdown {
      /**
       * Add annotations to links in markdown output
       */
      annotate_links?: boolean | null;

      /**
       * Instead of transcribing images, inline them in the markdown output
       */
      inline_images?: boolean | null;

      /**
       * Table formatting options for markdown
       */
      tables?: Markdown.Tables;
    }

    export namespace Markdown {
      /**
       * Table formatting options for markdown
       */
      export interface Tables {
        /**
         * Use compact formatting for markdown tables
         */
        compact_markdown_tables?: boolean | null;

        /**
         * Separator for multiline content in markdown tables
         */
        markdown_table_multiline_separator?: string | null;

        /**
         * Merge tables that continue across or within pages. Affects markdown and items
         */
        merge_continued_tables?: boolean | null;

        /**
         * Output tables in markdown format
         */
        output_tables_as_markdown?: boolean | null;
      }
    }

    /**
     * Spatial text output options
     */
    export interface SpatialText {
      /**
       * Keep column structure intact without unrolling
       */
      do_not_unroll_columns?: boolean | null;

      /**
       * Preserve text alignment across page boundaries
       */
      preserve_layout_alignment_across_pages?: boolean | null;

      /**
       * Include very small text in spatial output
       */
      preserve_very_small_text?: boolean | null;
    }

    /**
     * Table export as spreadsheet options
     */
    export interface TablesAsSpreadsheet {
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
  export interface PageRanges {
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
  export interface ProcessingControl {
    /**
     * Conditions that determine job failure
     */
    job_failure_conditions?: ProcessingControl.JobFailureConditions;

    /**
     * Timeout configuration for parsing jobs
     */
    timeouts?: ProcessingControl.Timeouts;
  }

  export namespace ProcessingControl {
    /**
     * Conditions that determine job failure
     */
    export interface JobFailureConditions {
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
    export interface Timeouts {
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
  export interface ProcessingOptions {
    /**
     * Whether to use aggressive table extraction
     */
    aggressive_table_extraction?: boolean | null;

    /**
     * Configuration for auto mode parsing with triggers and parsing options
     */
    auto_mode_configuration?: Array<ProcessingOptions.AutoModeConfiguration> | null;

    /**
     * Cost optimizer parameters for parsing configuration.
     */
    cost_optimizer?: ProcessingOptions.CostOptimizer | null;

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

    /**
     * Enable specialized chart parsing with the specified mode
     */
    specialized_chart_parsing?: 'agentic_plus' | 'agentic' | 'efficient' | null;
  }

  export namespace ProcessingOptions {
    /**
     * A single entry in the auto mode configuration array.
     */
    export interface AutoModeConfiguration {
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

    export namespace AutoModeConfiguration {
      /**
       * Configuration for parsing in auto mode (V2 format).
       *
       * This uses V2 API naming conventions. The backend service will convert these to
       * the V1 format expected by the llamaparse worker.
       */
      export interface ParsingConf {
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
         * Enable specialized chart parsing with the specified mode
         */
        specialized_chart_parsing?: 'agentic_plus' | 'agentic' | 'efficient' | null;

        /**
         * The parsing tier to use
         */
        tier?: 'fast' | 'cost_effective' | 'agentic' | 'agentic_plus' | null;

        /**
         * Version of the tier configuration
         */
        version?:
          | '2026-01-08'
          | '2025-12-31'
          | '2025-12-18'
          | '2025-12-11'
          | '2026-01-16'
          | '2026-01-21'
          | '2026-01-22'
          | '2026-01-24'
          | '2026-01-29'
          | 'latest'
          | (string & {})
          | null;
      }

      export namespace ParsingConf {
        /**
         * Crop box options for auto mode parsing configuration.
         */
        export interface CropBox {
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
        export interface Ignore {
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
        export interface Presentation {
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
        export interface SpatialText {
          /**
           * Keep column structure intact without unrolling
           */
          do_not_unroll_columns?: boolean | null;

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
     * Cost optimizer parameters for parsing configuration.
     */
    export interface CostOptimizer {
      /**
       * Use cost-optimized parsing for the document. May negatively impact parsing speed
       * and quality.
       */
      enable?: boolean | null;
    }

    /**
     * Options for ignoring specific text types
     */
    export interface Ignore {
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
    export interface OcrParameters {
      /**
       * List of languages to use for OCR processing
       */
      languages?: Array<ParsingAPI.ParsingLanguages> | null;
    }
  }

  export interface WebhookConfiguration {
    /**
     * List of events that trigger webhook notifications
     */
    webhook_events?: Array<string> | null;

    /**
     * Custom headers to include in webhook requests
     */
    webhook_headers?: { [key: string]: unknown } | null;

    /**
     * Webhook URL for receiving parsing notifications
     */
    webhook_url?: string | null;
  }
}

export interface ParsingListParams extends PaginatedCursorParams {
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
  export {
    type BBox as BBox,
    type CodeItem as CodeItem,
    type FailPageMode as FailPageMode,
    type FooterItem as FooterItem,
    type HeaderItem as HeaderItem,
    type HeadingItem as HeadingItem,
    type ImageItem as ImageItem,
    type LinkItem as LinkItem,
    type ListItem as ListItem,
    type LlamaParseSupportedFileExtensions as LlamaParseSupportedFileExtensions,
    type ParsingJob as ParsingJob,
    type ParsingLanguages as ParsingLanguages,
    type ParsingMode as ParsingMode,
    type StatusEnum as StatusEnum,
    type TableItem as TableItem,
    type TextItem as TextItem,
    type ParsingCreateResponse as ParsingCreateResponse,
    type ParsingListResponse as ParsingListResponse,
    type ParsingGetResponse as ParsingGetResponse,
    type ParsingListResponsesPaginatedCursor as ParsingListResponsesPaginatedCursor,
    type ParsingCreateParams as ParsingCreateParams,
    type ParsingListParams as ParsingListParams,
    type ParsingGetParams as ParsingGetParams,
  };
}
