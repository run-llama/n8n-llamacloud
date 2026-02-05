// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { RequestInit, RequestInfo, BodyInit } from './internal/builtin-types';
import type { HTTPMethod, PromiseOrValue, MergedRequestInit, FinalizedRequestInit } from './internal/types';
import { uuid4 } from './internal/utils/uuid';
import { validatePositiveInteger, isAbsoluteURL, safeJSON } from './internal/utils/values';
import { sleep } from './internal/utils/sleep';
export type { Logger, LogLevel } from './internal/utils/log';
import { castToError, isAbortError } from './internal/errors';
import type { APIResponseProps } from './internal/parse';
import { getPlatformHeaders, isRunningInBrowser } from './internal/detect-platform';
import * as Shims from './internal/shims';
import * as Opts from './internal/request-options';
import * as qs from './internal/qs';
import { VERSION } from './version';
import * as Errors from './core/error';
import * as Pagination from './core/pagination';
import {
  AbstractPage,
  type PaginatedBatchItemsParams,
  PaginatedBatchItemsResponse,
  type PaginatedCloudDocumentsParams,
  PaginatedCloudDocumentsResponse,
  type PaginatedCursorParams,
  type PaginatedCursorPostParams,
  PaginatedCursorPostResponse,
  PaginatedCursorResponse,
  type PaginatedExtractRunsParams,
  PaginatedExtractRunsResponse,
  type PaginatedJobsHistoryParams,
  PaginatedJobsHistoryResponse,
  type PaginatedPipelineFilesParams,
  PaginatedPipelineFilesResponse,
  type PaginatedQuotaConfigurationsParams,
  PaginatedQuotaConfigurationsResponse,
} from './core/pagination';
import * as Uploads from './core/uploads';
import * as API from './resources/index';
import { APIPromise } from './core/api-promise';
import {
  DataSink,
  DataSinkCreateParams,
  DataSinkListParams,
  DataSinkListResponse,
  DataSinkUpdateParams,
  DataSinks,
} from './resources/data-sinks';
import {
  DataSource,
  DataSourceCreateParams,
  DataSourceListParams,
  DataSourceListResponse,
  DataSourceReaderVersionMetadata,
  DataSourceUpdateParams,
  DataSources,
} from './resources/data-sources';
import {
  File,
  FileCreate,
  FileCreateParams,
  FileCreateResponse,
  FileDeleteParams,
  FileGetParams,
  FileListParams,
  FileListResponse,
  FileListResponsesPaginatedCursor,
  FileQueryParams,
  FileQueryResponse,
  Files,
  PresignedURL,
} from './resources/files';
import {
  BBox,
  CodeItem,
  FailPageMode,
  FooterItem,
  HeaderItem,
  HeadingItem,
  ImageItem,
  LinkItem,
  ListItem,
  LlamaParseSupportedFileExtensions,
  Parsing,
  ParsingCreateParams,
  ParsingCreateResponse,
  ParsingGetParams,
  ParsingGetResponse,
  ParsingJob,
  ParsingLanguages,
  ParsingListParams,
  ParsingListResponse,
  ParsingListResponsesPaginatedCursor,
  ParsingMode,
  StatusEnum,
  TableItem,
  TextItem,
} from './resources/parsing';
import {
  Project,
  ProjectGetParams,
  ProjectListParams,
  ProjectListResponse,
  Projects,
} from './resources/projects';
import { Beta } from './resources/beta/beta';
import { Classifier } from './resources/classifier/classifier';
import { Extraction, ExtractionRunParams } from './resources/extraction/extraction';
import {
  AdvancedModeTransformConfig,
  AutoTransformConfig,
  AzureOpenAIEmbedding,
  AzureOpenAIEmbeddingConfig,
  BedrockEmbedding,
  BedrockEmbeddingConfig,
  CohereEmbedding,
  CohereEmbeddingConfig,
  DataSinkCreate,
  GeminiEmbedding,
  GeminiEmbeddingConfig,
  HuggingFaceInferenceAPIEmbedding,
  HuggingFaceInferenceAPIEmbeddingConfig,
  LlamaParseParameters,
  LlmParameters,
  ManagedIngestionStatusResponse,
  MessageRole,
  MetadataFilters,
  OpenAIEmbedding,
  OpenAIEmbeddingConfig,
  PageFigureNodeWithScore,
  PageScreenshotNodeWithScore,
  Pipeline,
  PipelineCreate,
  PipelineCreateParams,
  PipelineGetStatusParams,
  PipelineListParams,
  PipelineListResponse,
  PipelineMetadataConfig,
  PipelineRetrieveParams,
  PipelineRetrieveResponse,
  PipelineType,
  PipelineUpdateParams,
  PipelineUpsertParams,
  Pipelines,
  PresetRetrievalParams,
  RetrievalMode,
  SparseModelConfig,
  VertexAIEmbeddingConfig,
  VertexTextEmbedding,
} from './resources/pipelines/pipelines';
import {
  CompositeRetrievalMode,
  CompositeRetrievalResult,
  ReRankConfig,
  Retriever,
  RetrieverCreate,
  RetrieverCreateParams,
  RetrieverGetParams,
  RetrieverListParams,
  RetrieverListResponse,
  RetrieverPipeline,
  RetrieverSearchParams,
  RetrieverUpdateParams,
  RetrieverUpsertParams,
  Retrievers,
} from './resources/retrievers/retrievers';
import { type Fetch } from './internal/builtin-types';
import { HeadersLike, NullableHeaders, buildHeaders } from './internal/headers';
import { FinalRequestOptions, RequestOptions } from './internal/request-options';
import { readEnv } from './internal/utils/env';
import {
  type LogLevel,
  type Logger,
  formatRequestDetails,
  loggerFor,
  parseLogLevel,
} from './internal/utils/log';
import { isEmptyObj } from './internal/utils/values';

export interface ClientOptions {
  /**
   * Defaults to process.env['LLAMA_CLOUD_API_KEY'].
   */
  apiKey?: string | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['LLAMA_CLOUD_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   *
   * @unit milliseconds
   */
  timeout?: number | undefined;
  /**
   * Additional `RequestInit` options to be passed to `fetch` calls.
   * Properties will be overridden by per-request `fetchOptions`.
   */
  fetchOptions?: MergedRequestInit | undefined;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * If not provided, we expect that `fetch` is defined globally.
   */
  fetch?: Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number | undefined;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `null` in request options.
   */
  defaultHeaders?: HeadersLike | undefined;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Record<string, string | undefined> | undefined;

  /**
   * Set the log level.
   *
   * Defaults to process.env['LLAMA_CLOUD_LOG'] or 'warn' if it isn't set.
   */
  logLevel?: LogLevel | undefined;

  /**
   * Set the logger.
   *
   * Defaults to globalThis.console.
   */
  logger?: Logger | undefined;
}

/**
 * API Client for interfacing with the Llama Cloud API.
 */
export class LlamaCloud {
  apiKey: string | undefined;

  baseURL: string;
  maxRetries: number;
  timeout: number;
  logger: Logger;
  logLevel: LogLevel | undefined;
  fetchOptions: MergedRequestInit | undefined;

  private fetch: Fetch;
  #encoder: Opts.RequestEncoder;
  protected idempotencyHeader?: string;
  private _options: ClientOptions;

  /**
   * API Client for interfacing with the Llama Cloud API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['LLAMA_CLOUD_API_KEY'] ?? undefined]
   * @param {string} [opts.baseURL=process.env['LLAMA_CLOUD_BASE_URL'] ?? https://api.cloud.llamaindex.ai] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({
    baseURL = readEnv('LLAMA_CLOUD_BASE_URL'),
    apiKey = readEnv('LLAMA_CLOUD_API_KEY'),
    ...opts
  }: ClientOptions = {}) {
    if (apiKey === undefined && !isRunningInBrowser()) {
      throw new Errors.LlamaCloudError(
        "The LLAMA_CLOUD_API_KEY environment variable is missing or empty; either provide it, or instantiate the LlamaCloud client with an apiKey option, like new LlamaCloud({ apiKey: 'My API Key' }).",
      );
    }

    const options: ClientOptions = {
      apiKey,
      ...opts,
      baseURL: baseURL || `https://api.cloud.llamaindex.ai`,
    };

    if (apiKey === undefined && isRunningInBrowser()) {
      options.fetchOptions = { credentials: 'include', ...options.fetchOptions } as MergedRequestInit;
    }

    this.baseURL = options.baseURL!;
    this.timeout = options.timeout ?? LlamaCloud.DEFAULT_TIMEOUT /* 1 minute */;
    this.logger = options.logger ?? console;
    const defaultLogLevel = 'warn';
    // Set default logLevel early so that we can log a warning in parseLogLevel.
    this.logLevel = defaultLogLevel;
    this.logLevel =
      parseLogLevel(options.logLevel, 'ClientOptions.logLevel', this) ??
      parseLogLevel(readEnv('LLAMA_CLOUD_LOG'), "process.env['LLAMA_CLOUD_LOG']", this) ??
      defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? Shims.getDefaultFetch();
    this.#encoder = Opts.FallbackEncoder;

    this._options = options;

    this.apiKey = apiKey;
  }

  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options: Partial<ClientOptions>): this {
    const client = new (this.constructor as any as new (props: ClientOptions) => typeof this)({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      ...options,
    });
    return client;
  }

  /**
   * Check whether the base URL is set to its default.
   */
  #baseURLOverridden(): boolean {
    return this.baseURL !== 'https://api.cloud.llamaindex.ai';
  }

  protected defaultQuery(): Record<string, string | undefined> | undefined {
    return this._options.defaultQuery;
  }

  protected validateHeaders({ values, nulls }: NullableHeaders) {
    return;
  }

  protected async authHeaders(opts: FinalRequestOptions): Promise<NullableHeaders | undefined> {
    if (this.apiKey) {
      return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
    }
    return undefined;
  }

  protected stringifyQuery(query: Record<string, unknown>): string {
    return qs.stringify(query, { arrayFormat: 'repeat' });
  }

  private getUserAgent(): string {
    return `${this.constructor.name}/JS ${VERSION}`;
  }

  protected defaultIdempotencyKey(): string {
    return `stainless-node-retry-${uuid4()}`;
  }

  protected makeStatusError(
    status: number,
    error: Object,
    message: string | undefined,
    headers: Headers,
  ): Errors.APIError {
    return Errors.APIError.generate(status, error, message, headers);
  }

  buildURL(
    path: string,
    query: Record<string, unknown> | null | undefined,
    defaultBaseURL?: string | undefined,
  ): string {
    const baseURL = (!this.#baseURLOverridden() && defaultBaseURL) || this.baseURL;
    const url =
      isAbsoluteURL(path) ?
        new URL(path)
      : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));

    const defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery)) {
      query = { ...defaultQuery, ...query };
    }

    if (typeof query === 'object' && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query as Record<string, unknown>);
    }

    return url.toString();
  }

  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  protected async prepareOptions(options: FinalRequestOptions): Promise<void> {}

  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions },
  ): Promise<void> {}

  get<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('get', path, opts);
  }

  post<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('post', path, opts);
  }

  patch<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('patch', path, opts);
  }

  put<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('put', path, opts);
  }

  delete<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('delete', path, opts);
  }

  private methodRequest<Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<RequestOptions>,
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => {
        return { method, path, ...opts };
      }),
    );
  }

  request<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null = null,
  ): APIPromise<Rsp> {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
  }

  private async makeRequest(
    optionsInput: PromiseOrValue<FinalRequestOptions>,
    retriesRemaining: number | null,
    retryOfRequestLogID: string | undefined,
  ): Promise<APIResponseProps> {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }

    await this.prepareOptions(options);

    const { req, url, timeout } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining,
    });

    await this.prepareRequest(req, { url, options });

    /** Not an API request ID, just for correlating local log entries. */
    const requestLogID = 'log_' + ((Math.random() * (1 << 24)) | 0).toString(16).padStart(6, '0');
    const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();

    loggerFor(this).debug(
      `[${requestLogID}] sending request`,
      formatRequestDetails({
        retryOfRequestLogID,
        method: options.method,
        url,
        options,
        headers: req.headers,
      }),
    );

    if (options.signal?.aborted) {
      throw new Errors.APIUserAbortError();
    }

    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
    const headersTime = Date.now();

    if (response instanceof globalThis.Error) {
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new Errors.APIUserAbortError();
      }
      // detect native connection timeout errors
      // deno throws "TypeError: error sending request for url (https://example/): client error (Connect): tcp connect error: Operation timed out (os error 60): Operation timed out (os error 60)"
      // undici throws "TypeError: fetch failed" with cause "ConnectTimeoutError: Connect Timeout Error (attempted address: example:443, timeout: 1ms)"
      // others do not provide enough information to distinguish timeouts from other connection errors
      const isTimeout =
        isAbortError(response) ||
        /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
      if (retriesRemaining) {
        loggerFor(this).info(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`,
        );
        loggerFor(this).debug(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url,
            durationMs: headersTime - startTime,
            message: response.message,
          }),
        );
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`,
      );
      loggerFor(this).debug(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`,
        formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message,
        }),
      );
      if (isTimeout) {
        throw new Errors.APIConnectionTimeoutError();
      }
      throw new Errors.APIConnectionError({ cause: response });
    }

    const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${
      response.ok ? 'succeeded' : 'failed'
    } with status ${response.status} in ${headersTime - startTime}ms`;

    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;

        // We don't need the body of this response.
        await Shims.CancelReadableStream(response.body);
        loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
        loggerFor(this).debug(
          `[${requestLogID}] response error (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime,
          }),
        );
        return this.retryRequest(
          options,
          retriesRemaining,
          retryOfRequestLogID ?? requestLogID,
          response.headers,
        );
      }

      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;

      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);

      const errText = await response.text().catch((err: any) => castToError(err).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? undefined : errText;

      loggerFor(this).debug(
        `[${requestLogID}] response error (${retryMessage})`,
        formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          message: errMessage,
          durationMs: Date.now() - startTime,
        }),
      );

      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }

    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(
      `[${requestLogID}] response start`,
      formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        durationMs: headersTime - startTime,
      }),
    );

    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }

  getAPIList<Item, PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>>(
    path: string,
    Page: new (...args: any[]) => PageClass,
    opts?: RequestOptions,
  ): Pagination.PagePromise<PageClass, Item> {
    return this.requestAPIList(Page, { method: 'get', path, ...opts });
  }

  requestAPIList<
    Item = unknown,
    PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>,
  >(
    Page: new (...args: ConstructorParameters<typeof Pagination.AbstractPage>) => PageClass,
    options: FinalRequestOptions,
  ): Pagination.PagePromise<PageClass, Item> {
    const request = this.makeRequest(options, null, undefined);
    return new Pagination.PagePromise<PageClass, Item>(this as any as LlamaCloud, request, Page);
  }

  async fetchWithTimeout(
    url: RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController,
  ): Promise<Response> {
    const { signal, method, ...options } = init || {};
    const abort = this._makeAbort(controller);
    if (signal) signal.addEventListener('abort', abort, { once: true });

    const timeout = setTimeout(abort, ms);

    const isReadableBody =
      ((globalThis as any).ReadableStream && options.body instanceof (globalThis as any).ReadableStream) ||
      (typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body);

    const fetchOptions: RequestInit = {
      signal: controller.signal as any,
      ...(isReadableBody ? { duplex: 'half' } : {}),
      method: 'GET',
      ...options,
    };
    if (method) {
      // Custom methods like 'patch' need to be uppercased
      // See https://github.com/nodejs/undici/issues/2294
      fetchOptions.method = method.toUpperCase();
    }

    try {
      // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
      return await this.fetch.call(undefined, url, fetchOptions);
    } finally {
      clearTimeout(timeout);
      if (signal) signal.removeEventListener('abort', abort);
    }
  }

  private async shouldRetry(response: Response): Promise<boolean> {
    // Note this is not a standard header.
    const shouldRetryHeader = response.headers.get('x-should-retry');

    // If the server explicitly says whether or not to retry, obey.
    if (shouldRetryHeader === 'true') return true;
    if (shouldRetryHeader === 'false') return false;

    // Retry on request timeouts.
    if (response.status === 408) return true;

    // Retry on lock timeouts.
    if (response.status === 409) return true;

    // Retry on rate limits.
    if (response.status === 429) return true;

    // Retry internal errors.
    if (response.status >= 500) return true;

    return false;
  }

  private async retryRequest(
    options: FinalRequestOptions,
    retriesRemaining: number,
    requestLogID: string,
    responseHeaders?: Headers | undefined,
  ): Promise<APIResponseProps> {
    let timeoutMillis: number | undefined;

    // Note the `retry-after-ms` header may not be standard, but is a good idea and we'd like proactive support for it.
    const retryAfterMillisHeader = responseHeaders?.get('retry-after-ms');
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }

    // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
    const retryAfterHeader = responseHeaders?.get('retry-after');
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1000;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }

    // If the API asks us to wait a certain amount of time (and it's a reasonable amount),
    // just do what it says, but otherwise calculate a default
    if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1000)) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);

    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }

  private calculateDefaultRetryTimeoutMillis(retriesRemaining: number, maxRetries: number): number {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8.0;

    const numRetries = maxRetries - retriesRemaining;

    // Apply exponential backoff, but not more than the max.
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);

    // Apply some jitter, take up to at most 25 percent of the retry time.
    const jitter = 1 - Math.random() * 0.25;

    return sleepSeconds * jitter * 1000;
  }

  async buildRequest(
    inputOptions: FinalRequestOptions,
    { retryCount = 0 }: { retryCount?: number } = {},
  ): Promise<{ req: FinalizedRequestInit; url: string; timeout: number }> {
    const options = { ...inputOptions };
    const { method, path, query, defaultBaseURL } = options;

    const url = this.buildURL(path!, query as Record<string, unknown>, defaultBaseURL);
    if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });

    const req: FinalizedRequestInit = {
      method,
      headers: reqHeaders,
      ...(options.signal && { signal: options.signal }),
      ...((globalThis as any).ReadableStream &&
        body instanceof (globalThis as any).ReadableStream && { duplex: 'half' }),
      ...(body && { body }),
      ...((this.fetchOptions as any) ?? {}),
      ...((options.fetchOptions as any) ?? {}),
    };

    return { req, url, timeout: options.timeout };
  }

  private async buildHeaders({
    options,
    method,
    bodyHeaders,
    retryCount,
  }: {
    options: FinalRequestOptions;
    method: HTTPMethod;
    bodyHeaders: HeadersLike;
    retryCount: number;
  }): Promise<Headers> {
    let idempotencyHeaders: HeadersLike = {};
    if (this.idempotencyHeader && method !== 'get') {
      if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }

    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: 'application/json',
        'User-Agent': this.getUserAgent(),
        'X-Stainless-Retry-Count': String(retryCount),
        ...(options.timeout ? { 'X-Stainless-Timeout': String(Math.trunc(options.timeout / 1000)) } : {}),
        ...getPlatformHeaders(),
      },
      await this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers,
    ]);

    this.validateHeaders(headers);

    return headers.values;
  }

  private _makeAbort(controller: AbortController) {
    // note: we can't just inline this method inside `fetchWithTimeout()` because then the closure
    //       would capture all request options, and cause a memory leak.
    return () => controller.abort();
  }

  private buildBody({ options: { body, headers: rawHeaders } }: { options: FinalRequestOptions }): {
    bodyHeaders: HeadersLike;
    body: BodyInit | undefined;
  } {
    if (!body) {
      return { bodyHeaders: undefined, body: undefined };
    }
    const headers = buildHeaders([rawHeaders]);
    if (
      // Pass raw type verbatim
      ArrayBuffer.isView(body) ||
      body instanceof ArrayBuffer ||
      body instanceof DataView ||
      (typeof body === 'string' &&
        // Preserve legacy string encoding behavior for now
        headers.values.has('content-type')) ||
      // `Blob` is superset of `File`
      ((globalThis as any).Blob && body instanceof (globalThis as any).Blob) ||
      // `FormData` -> `multipart/form-data`
      body instanceof FormData ||
      // `URLSearchParams` -> `application/x-www-form-urlencoded`
      body instanceof URLSearchParams ||
      // Send chunked stream (each chunk has own `length`)
      ((globalThis as any).ReadableStream && body instanceof (globalThis as any).ReadableStream)
    ) {
      return { bodyHeaders: undefined, body: body as BodyInit };
    } else if (
      typeof body === 'object' &&
      (Symbol.asyncIterator in body ||
        (Symbol.iterator in body && 'next' in body && typeof body.next === 'function'))
    ) {
      return { bodyHeaders: undefined, body: Shims.ReadableStreamFrom(body as AsyncIterable<Uint8Array>) };
    } else {
      return this.#encoder({ body, headers });
    }
  }

  static LlamaCloud = this;
  static DEFAULT_TIMEOUT = 60000; // 1 minute

  static LlamaCloudError = Errors.LlamaCloudError;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;

  files: API.Files = new API.Files(this);
  parsing: API.Parsing = new API.Parsing(this);
  extraction: API.Extraction = new API.Extraction(this);
  classifier: API.Classifier = new API.Classifier(this);
  projects: API.Projects = new API.Projects(this);
  dataSinks: API.DataSinks = new API.DataSinks(this);
  dataSources: API.DataSources = new API.DataSources(this);
  pipelines: API.Pipelines = new API.Pipelines(this);
  retrievers: API.Retrievers = new API.Retrievers(this);
  beta: API.Beta = new API.Beta(this);
}

LlamaCloud.Files = Files;
LlamaCloud.Parsing = Parsing;
LlamaCloud.Extraction = Extraction;
LlamaCloud.Classifier = Classifier;
LlamaCloud.Projects = Projects;
LlamaCloud.DataSinks = DataSinks;
LlamaCloud.DataSources = DataSources;
LlamaCloud.Pipelines = Pipelines;
LlamaCloud.Retrievers = Retrievers;
LlamaCloud.Beta = Beta;

export declare namespace LlamaCloud {
  export type RequestOptions = Opts.RequestOptions;

  export import PaginatedJobsHistory = Pagination.PaginatedJobsHistory;
  export {
    type PaginatedJobsHistoryParams as PaginatedJobsHistoryParams,
    type PaginatedJobsHistoryResponse as PaginatedJobsHistoryResponse,
  };

  export import PaginatedPipelineFiles = Pagination.PaginatedPipelineFiles;
  export {
    type PaginatedPipelineFilesParams as PaginatedPipelineFilesParams,
    type PaginatedPipelineFilesResponse as PaginatedPipelineFilesResponse,
  };

  export import PaginatedBatchItems = Pagination.PaginatedBatchItems;
  export {
    type PaginatedBatchItemsParams as PaginatedBatchItemsParams,
    type PaginatedBatchItemsResponse as PaginatedBatchItemsResponse,
  };

  export import PaginatedExtractRuns = Pagination.PaginatedExtractRuns;
  export {
    type PaginatedExtractRunsParams as PaginatedExtractRunsParams,
    type PaginatedExtractRunsResponse as PaginatedExtractRunsResponse,
  };

  export import PaginatedCloudDocuments = Pagination.PaginatedCloudDocuments;
  export {
    type PaginatedCloudDocumentsParams as PaginatedCloudDocumentsParams,
    type PaginatedCloudDocumentsResponse as PaginatedCloudDocumentsResponse,
  };

  export import PaginatedQuotaConfigurations = Pagination.PaginatedQuotaConfigurations;
  export {
    type PaginatedQuotaConfigurationsParams as PaginatedQuotaConfigurationsParams,
    type PaginatedQuotaConfigurationsResponse as PaginatedQuotaConfigurationsResponse,
  };

  export import PaginatedCursor = Pagination.PaginatedCursor;
  export {
    type PaginatedCursorParams as PaginatedCursorParams,
    type PaginatedCursorResponse as PaginatedCursorResponse,
  };

  export import PaginatedCursorPost = Pagination.PaginatedCursorPost;
  export {
    type PaginatedCursorPostParams as PaginatedCursorPostParams,
    type PaginatedCursorPostResponse as PaginatedCursorPostResponse,
  };

  export {
    Files as Files,
    type File as File,
    type FileCreate as FileCreate,
    type PresignedURL as PresignedURL,
    type FileCreateResponse as FileCreateResponse,
    type FileListResponse as FileListResponse,
    type FileQueryResponse as FileQueryResponse,
    type FileListResponsesPaginatedCursor as FileListResponsesPaginatedCursor,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
    type FileDeleteParams as FileDeleteParams,
    type FileGetParams as FileGetParams,
    type FileQueryParams as FileQueryParams,
  };

  export {
    Parsing as Parsing,
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

  export { Extraction as Extraction, type ExtractionRunParams as ExtractionRunParams };

  export { Classifier as Classifier };

  export {
    Projects as Projects,
    type Project as Project,
    type ProjectListResponse as ProjectListResponse,
    type ProjectListParams as ProjectListParams,
    type ProjectGetParams as ProjectGetParams,
  };

  export {
    DataSinks as DataSinks,
    type DataSink as DataSink,
    type DataSinkListResponse as DataSinkListResponse,
    type DataSinkCreateParams as DataSinkCreateParams,
    type DataSinkUpdateParams as DataSinkUpdateParams,
    type DataSinkListParams as DataSinkListParams,
  };

  export {
    DataSources as DataSources,
    type DataSource as DataSource,
    type DataSourceReaderVersionMetadata as DataSourceReaderVersionMetadata,
    type DataSourceListResponse as DataSourceListResponse,
    type DataSourceCreateParams as DataSourceCreateParams,
    type DataSourceUpdateParams as DataSourceUpdateParams,
    type DataSourceListParams as DataSourceListParams,
  };

  export {
    Pipelines as Pipelines,
    type AdvancedModeTransformConfig as AdvancedModeTransformConfig,
    type AutoTransformConfig as AutoTransformConfig,
    type AzureOpenAIEmbedding as AzureOpenAIEmbedding,
    type AzureOpenAIEmbeddingConfig as AzureOpenAIEmbeddingConfig,
    type BedrockEmbedding as BedrockEmbedding,
    type BedrockEmbeddingConfig as BedrockEmbeddingConfig,
    type CohereEmbedding as CohereEmbedding,
    type CohereEmbeddingConfig as CohereEmbeddingConfig,
    type DataSinkCreate as DataSinkCreate,
    type GeminiEmbedding as GeminiEmbedding,
    type GeminiEmbeddingConfig as GeminiEmbeddingConfig,
    type HuggingFaceInferenceAPIEmbedding as HuggingFaceInferenceAPIEmbedding,
    type HuggingFaceInferenceAPIEmbeddingConfig as HuggingFaceInferenceAPIEmbeddingConfig,
    type LlamaParseParameters as LlamaParseParameters,
    type LlmParameters as LlmParameters,
    type ManagedIngestionStatusResponse as ManagedIngestionStatusResponse,
    type MessageRole as MessageRole,
    type MetadataFilters as MetadataFilters,
    type OpenAIEmbedding as OpenAIEmbedding,
    type OpenAIEmbeddingConfig as OpenAIEmbeddingConfig,
    type PageFigureNodeWithScore as PageFigureNodeWithScore,
    type PageScreenshotNodeWithScore as PageScreenshotNodeWithScore,
    type Pipeline as Pipeline,
    type PipelineCreate as PipelineCreate,
    type PipelineMetadataConfig as PipelineMetadataConfig,
    type PipelineType as PipelineType,
    type PresetRetrievalParams as PresetRetrievalParams,
    type RetrievalMode as RetrievalMode,
    type SparseModelConfig as SparseModelConfig,
    type VertexAIEmbeddingConfig as VertexAIEmbeddingConfig,
    type VertexTextEmbedding as VertexTextEmbedding,
    type PipelineRetrieveResponse as PipelineRetrieveResponse,
    type PipelineListResponse as PipelineListResponse,
    type PipelineCreateParams as PipelineCreateParams,
    type PipelineRetrieveParams as PipelineRetrieveParams,
    type PipelineUpdateParams as PipelineUpdateParams,
    type PipelineListParams as PipelineListParams,
    type PipelineGetStatusParams as PipelineGetStatusParams,
    type PipelineUpsertParams as PipelineUpsertParams,
  };

  export {
    Retrievers as Retrievers,
    type CompositeRetrievalMode as CompositeRetrievalMode,
    type CompositeRetrievalResult as CompositeRetrievalResult,
    type ReRankConfig as ReRankConfig,
    type Retriever as Retriever,
    type RetrieverCreate as RetrieverCreate,
    type RetrieverPipeline as RetrieverPipeline,
    type RetrieverListResponse as RetrieverListResponse,
    type RetrieverCreateParams as RetrieverCreateParams,
    type RetrieverUpdateParams as RetrieverUpdateParams,
    type RetrieverListParams as RetrieverListParams,
    type RetrieverGetParams as RetrieverGetParams,
    type RetrieverSearchParams as RetrieverSearchParams,
    type RetrieverUpsertParams as RetrieverUpsertParams,
  };

  export { Beta as Beta };

  export type CloudAstraDBVectorStore = API.CloudAstraDBVectorStore;
  export type CloudAzStorageBlobDataSource = API.CloudAzStorageBlobDataSource;
  export type CloudAzureAISearchVectorStore = API.CloudAzureAISearchVectorStore;
  export type CloudBoxDataSource = API.CloudBoxDataSource;
  export type CloudConfluenceDataSource = API.CloudConfluenceDataSource;
  export type CloudGoogleDriveDataSource = API.CloudGoogleDriveDataSource;
  export type CloudJiraDataSource = API.CloudJiraDataSource;
  export type CloudJiraDataSourceV2 = API.CloudJiraDataSourceV2;
  export type CloudMilvusVectorStore = API.CloudMilvusVectorStore;
  export type CloudMongoDBAtlasVectorSearch = API.CloudMongoDBAtlasVectorSearch;
  export type CloudNotionPageDataSource = API.CloudNotionPageDataSource;
  export type CloudOneDriveDataSource = API.CloudOneDriveDataSource;
  export type CloudPineconeVectorStore = API.CloudPineconeVectorStore;
  export type CloudPostgresVectorStore = API.CloudPostgresVectorStore;
  export type CloudQdrantVectorStore = API.CloudQdrantVectorStore;
  export type CloudS3DataSource = API.CloudS3DataSource;
  export type CloudSharepointDataSource = API.CloudSharepointDataSource;
  export type CloudSlackDataSource = API.CloudSlackDataSource;
  export type FailureHandlingConfig = API.FailureHandlingConfig;
  export type PgVectorHnswSettings = API.PgVectorHnswSettings;
}
