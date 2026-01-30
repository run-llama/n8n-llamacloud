// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var _LlamaCloud_instances, _a, _LlamaCloud_encoder, _LlamaCloud_baseURLOverridden;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "./internal/tslib.mjs";
import { uuid4 } from "./internal/utils/uuid.mjs";
import { validatePositiveInteger, isAbsoluteURL, safeJSON } from "./internal/utils/values.mjs";
import { sleep } from "./internal/utils/sleep.mjs";
import { castToError, isAbortError } from "./internal/errors.mjs";
import { getPlatformHeaders } from "./internal/detect-platform.mjs";
import * as Shims from "./internal/shims.mjs";
import * as Opts from "./internal/request-options.mjs";
import * as qs from "./internal/qs/index.mjs";
import { VERSION } from "./version.mjs";
import * as Errors from "./core/error.mjs";
import * as Pagination from "./core/pagination.mjs";
import * as Uploads from "./core/uploads.mjs";
import * as API from "./resources/index.mjs";
import { APIPromise } from "./core/api-promise.mjs";
import { DataSinks, } from "./resources/data-sinks.mjs";
import { DataSources, } from "./resources/data-sources.mjs";
import { Files, } from "./resources/files.mjs";
import { Parsing, } from "./resources/parsing.mjs";
import { Projects, } from "./resources/projects.mjs";
import { Beta } from "./resources/beta/beta.mjs";
import { Classifier } from "./resources/classifier/classifier.mjs";
import { Extraction } from "./resources/extraction/extraction.mjs";
import { Pipelines, } from "./resources/pipelines/pipelines.mjs";
import { Retrievers, } from "./resources/retrievers/retrievers.mjs";
import { buildHeaders } from "./internal/headers.mjs";
import { readEnv } from "./internal/utils/env.mjs";
import { formatRequestDetails, loggerFor, parseLogLevel, } from "./internal/utils/log.mjs";
import { isEmptyObj } from "./internal/utils/values.mjs";
/**
 * API Client for interfacing with the Llama Cloud API.
 */
export class LlamaCloud {
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
    constructor({ baseURL = readEnv('LLAMA_CLOUD_BASE_URL'), apiKey = readEnv('LLAMA_CLOUD_API_KEY'), ...opts } = {}) {
        _LlamaCloud_instances.add(this);
        _LlamaCloud_encoder.set(this, void 0);
        this.projects = new API.Projects(this);
        this.dataSinks = new API.DataSinks(this);
        this.dataSources = new API.DataSources(this);
        this.files = new API.Files(this);
        this.pipelines = new API.Pipelines(this);
        this.retrievers = new API.Retrievers(this);
        this.parsing = new API.Parsing(this);
        this.classifier = new API.Classifier(this);
        this.extraction = new API.Extraction(this);
        this.beta = new API.Beta(this);
        if (apiKey === undefined) {
            throw new Errors.LlamaCloudError("The LLAMA_CLOUD_API_KEY environment variable is missing or empty; either provide it, or instantiate the LlamaCloud client with an apiKey option, like new LlamaCloud({ apiKey: 'My API Key' }).");
        }
        const options = {
            apiKey,
            ...opts,
            baseURL: baseURL || `https://api.cloud.llamaindex.ai`,
        };
        this.baseURL = options.baseURL;
        this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT /* 1 minute */;
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
        __classPrivateFieldSet(this, _LlamaCloud_encoder, Opts.FallbackEncoder, "f");
        this._options = options;
        this.apiKey = apiKey;
    }
    /**
     * Create a new client instance re-using the same options given to the current client with optional overriding.
     */
    withOptions(options) {
        const client = new this.constructor({
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
    defaultQuery() {
        return this._options.defaultQuery;
    }
    validateHeaders({ values, nulls }) {
        return;
    }
    async authHeaders(opts) {
        return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
    }
    stringifyQuery(query) {
        return qs.stringify(query, { arrayFormat: 'repeat' });
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${VERSION}`;
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${uuid4()}`;
    }
    makeStatusError(status, error, message, headers) {
        return Errors.APIError.generate(status, error, message, headers);
    }
    buildURL(path, query, defaultBaseURL) {
        const baseURL = (!__classPrivateFieldGet(this, _LlamaCloud_instances, "m", _LlamaCloud_baseURLOverridden).call(this) && defaultBaseURL) || this.baseURL;
        const url = isAbsoluteURL(path) ?
            new URL(path)
            : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        if (!isEmptyObj(defaultQuery)) {
            query = { ...defaultQuery, ...query };
        }
        if (typeof query === 'object' && query && !Array.isArray(query)) {
            url.search = this.stringifyQuery(query);
        }
        return url.toString();
    }
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */
    async prepareOptions(options) { }
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    async prepareRequest(request, { url, options }) { }
    get(path, opts) {
        return this.methodRequest('get', path, opts);
    }
    post(path, opts) {
        return this.methodRequest('post', path, opts);
    }
    patch(path, opts) {
        return this.methodRequest('patch', path, opts);
    }
    put(path, opts) {
        return this.methodRequest('put', path, opts);
    }
    delete(path, opts) {
        return this.methodRequest('delete', path, opts);
    }
    methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts) => {
            return { method, path, ...opts };
        }));
    }
    request(options, remainingRetries = null) {
        return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
    }
    async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
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
        loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
            retryOfRequestLogID,
            method: options.method,
            url,
            options,
            headers: req.headers,
        }));
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
            const isTimeout = isAbortError(response) ||
                /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
            if (retriesRemaining) {
                loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`);
                loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`, formatRequestDetails({
                    retryOfRequestLogID,
                    url,
                    durationMs: headersTime - startTime,
                    message: response.message,
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
            }
            loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`);
            loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`, formatRequestDetails({
                retryOfRequestLogID,
                url,
                durationMs: headersTime - startTime,
                message: response.message,
            }));
            if (isTimeout) {
                throw new Errors.APIConnectionTimeoutError();
            }
            throw new Errors.APIConnectionError({ cause: response });
        }
        const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? 'succeeded' : 'failed'} with status ${response.status} in ${headersTime - startTime}ms`;
        if (!response.ok) {
            const shouldRetry = await this.shouldRetry(response);
            if (retriesRemaining && shouldRetry) {
                const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
                // We don't need the body of this response.
                await Shims.CancelReadableStream(response.body);
                loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
                loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                    retryOfRequestLogID,
                    url: response.url,
                    status: response.status,
                    headers: response.headers,
                    durationMs: headersTime - startTime,
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
            }
            const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
            loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
            const errText = await response.text().catch((err) => castToError(err).message);
            const errJSON = safeJSON(errText);
            const errMessage = errJSON ? undefined : errText;
            loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                retryOfRequestLogID,
                url: response.url,
                status: response.status,
                headers: response.headers,
                message: errMessage,
                durationMs: Date.now() - startTime,
            }));
            const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
            throw err;
        }
        loggerFor(this).info(responseInfo);
        loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime,
        }));
        return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
    }
    getAPIList(path, Page, opts) {
        return this.requestAPIList(Page, { method: 'get', path, ...opts });
    }
    requestAPIList(Page, options) {
        const request = this.makeRequest(options, null, undefined);
        return new Pagination.PagePromise(this, request, Page);
    }
    async fetchWithTimeout(url, init, ms, controller) {
        const { signal, method, ...options } = init || {};
        if (signal)
            signal.addEventListener('abort', () => controller.abort());
        const timeout = setTimeout(() => controller.abort(), ms);
        const isReadableBody = (globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream) ||
            (typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body);
        const fetchOptions = {
            signal: controller.signal,
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
        }
        finally {
            clearTimeout(timeout);
        }
    }
    async shouldRetry(response) {
        // Note this is not a standard header.
        const shouldRetryHeader = response.headers.get('x-should-retry');
        // If the server explicitly says whether or not to retry, obey.
        if (shouldRetryHeader === 'true')
            return true;
        if (shouldRetryHeader === 'false')
            return false;
        // Retry on request timeouts.
        if (response.status === 408)
            return true;
        // Retry on lock timeouts.
        if (response.status === 409)
            return true;
        // Retry on rate limits.
        if (response.status === 429)
            return true;
        // Retry internal errors.
        if (response.status >= 500)
            return true;
        return false;
    }
    async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
        let timeoutMillis;
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
            }
            else {
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
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8.0;
        const numRetries = maxRetries - retriesRemaining;
        // Apply exponential backoff, but not more than the max.
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        // Apply some jitter, take up to at most 25 percent of the retry time.
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1000;
    }
    async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        const options = { ...inputOptions };
        const { method, path, query, defaultBaseURL } = options;
        const url = this.buildURL(path, query, defaultBaseURL);
        if ('timeout' in options)
            validatePositiveInteger('timeout', options.timeout);
        options.timeout = options.timeout ?? this.timeout;
        const { bodyHeaders, body } = this.buildBody({ options });
        const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
        const req = {
            method,
            headers: reqHeaders,
            ...(options.signal && { signal: options.signal }),
            ...(globalThis.ReadableStream &&
                body instanceof globalThis.ReadableStream && { duplex: 'half' }),
            ...(body && { body }),
            ...(this.fetchOptions ?? {}),
            ...(options.fetchOptions ?? {}),
        };
        return { req, url, timeout: options.timeout };
    }
    async buildHeaders({ options, method, bodyHeaders, retryCount, }) {
        let idempotencyHeaders = {};
        if (this.idempotencyHeader && method !== 'get') {
            if (!options.idempotencyKey)
                options.idempotencyKey = this.defaultIdempotencyKey();
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
    buildBody({ options: { body, headers: rawHeaders } }) {
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
            (globalThis.Blob && body instanceof globalThis.Blob) ||
            // `FormData` -> `multipart/form-data`
            body instanceof FormData ||
            // `URLSearchParams` -> `application/x-www-form-urlencoded`
            body instanceof URLSearchParams ||
            // Send chunked stream (each chunk has own `length`)
            (globalThis.ReadableStream && body instanceof globalThis.ReadableStream)) {
            return { bodyHeaders: undefined, body: body };
        }
        else if (typeof body === 'object' &&
            (Symbol.asyncIterator in body ||
                (Symbol.iterator in body && 'next' in body && typeof body.next === 'function'))) {
            return { bodyHeaders: undefined, body: Shims.ReadableStreamFrom(body) };
        }
        else {
            return __classPrivateFieldGet(this, _LlamaCloud_encoder, "f").call(this, { body, headers });
        }
    }
}
_a = LlamaCloud, _LlamaCloud_encoder = new WeakMap(), _LlamaCloud_instances = new WeakSet(), _LlamaCloud_baseURLOverridden = function _LlamaCloud_baseURLOverridden() {
    return this.baseURL !== 'https://api.cloud.llamaindex.ai';
};
LlamaCloud.LlamaCloud = _a;
LlamaCloud.DEFAULT_TIMEOUT = 60000; // 1 minute
LlamaCloud.LlamaCloudError = Errors.LlamaCloudError;
LlamaCloud.APIError = Errors.APIError;
LlamaCloud.APIConnectionError = Errors.APIConnectionError;
LlamaCloud.APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
LlamaCloud.APIUserAbortError = Errors.APIUserAbortError;
LlamaCloud.NotFoundError = Errors.NotFoundError;
LlamaCloud.ConflictError = Errors.ConflictError;
LlamaCloud.RateLimitError = Errors.RateLimitError;
LlamaCloud.BadRequestError = Errors.BadRequestError;
LlamaCloud.AuthenticationError = Errors.AuthenticationError;
LlamaCloud.InternalServerError = Errors.InternalServerError;
LlamaCloud.PermissionDeniedError = Errors.PermissionDeniedError;
LlamaCloud.UnprocessableEntityError = Errors.UnprocessableEntityError;
LlamaCloud.toFile = Uploads.toFile;
LlamaCloud.Projects = Projects;
LlamaCloud.DataSinks = DataSinks;
LlamaCloud.DataSources = DataSources;
LlamaCloud.Files = Files;
LlamaCloud.Pipelines = Pipelines;
LlamaCloud.Retrievers = Retrievers;
LlamaCloud.Parsing = Parsing;
LlamaCloud.Classifier = Classifier;
LlamaCloud.Extraction = Extraction;
LlamaCloud.Beta = Beta;
//# sourceMappingURL=client.mjs.map