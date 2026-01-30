// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var _AbstractPage_client;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../internal/tslib.mjs";
import { LlamaCloudError } from "./error.mjs";
import { defaultParseResponse } from "../internal/parse.mjs";
import { APIPromise } from "./api-promise.mjs";
import { maybeObj } from "../internal/utils/values.mjs";
export class AbstractPage {
    constructor(client, response, body, options) {
        _AbstractPage_client.set(this, void 0);
        __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
        this.options = options;
        this.response = response;
        this.body = body;
    }
    hasNextPage() {
        const items = this.getPaginatedItems();
        if (!items.length)
            return false;
        return this.nextPageRequestOptions() != null;
    }
    async getNextPage() {
        const nextOptions = this.nextPageRequestOptions();
        if (!nextOptions) {
            throw new LlamaCloudError('No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.');
        }
        return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    }
    async *iterPages() {
        let page = this;
        yield page;
        while (page.hasNextPage()) {
            page = await page.getNextPage();
            yield page;
        }
    }
    async *[(_AbstractPage_client = new WeakMap(), Symbol.asyncIterator)]() {
        for await (const page of this.iterPages()) {
            for (const item of page.getPaginatedItems()) {
                yield item;
            }
        }
    }
}
/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export class PagePromise extends APIPromise {
    constructor(client, request, Page) {
        super(client, request, async (client, props) => new Page(client, props.response, await defaultParseResponse(client, props), props.options));
    }
    /**
     * Allow auto-paginating iteration on an unawaited list call, eg:
     *
     *    for await (const item of client.items.list()) {
     *      console.log(item)
     *    }
     */
    async *[Symbol.asyncIterator]() {
        const page = await this;
        for await (const item of page) {
            yield item;
        }
    }
}
export class PaginatedJobsHistory extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.jobs = body.jobs || [];
        this.total_count = body.total_count || 0;
        this.offset = body.offset || 0;
    }
    getPaginatedItems() {
        return this.jobs ?? [];
    }
    nextPageRequestOptions() {
        const offset = this.offset ?? 0;
        const length = this.getPaginatedItems().length;
        const currentCount = offset + length;
        const totalCount = this.total_count;
        if (!totalCount) {
            return null;
        }
        if (currentCount < totalCount) {
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    offset: currentCount,
                },
            };
        }
        return null;
    }
}
export class PaginatedPipelineFiles extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.files = body.files || [];
        this.total_count = body.total_count || 0;
        this.offset = body.offset || 0;
    }
    getPaginatedItems() {
        return this.files ?? [];
    }
    nextPageRequestOptions() {
        const offset = this.offset ?? 0;
        const length = this.getPaginatedItems().length;
        const currentCount = offset + length;
        const totalCount = this.total_count;
        if (!totalCount) {
            return null;
        }
        if (currentCount < totalCount) {
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    offset: currentCount,
                },
            };
        }
        return null;
    }
}
export class PaginatedBatchItems extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.total_size = body.total_size || 0;
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const offset = this.options.query.offset ?? 0;
        const length = this.getPaginatedItems().length;
        const currentCount = offset + length;
        const totalCount = this.total_size;
        if (!totalCount) {
            return null;
        }
        if (currentCount < totalCount) {
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    offset: currentCount,
                },
            };
        }
        return null;
    }
}
export class PaginatedExtractRuns extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.total = body.total || 0;
        this.skip = body.skip || 0;
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const offset = this.skip ?? 0;
        const length = this.getPaginatedItems().length;
        const currentCount = offset + length;
        const totalCount = this.total;
        if (!totalCount) {
            return null;
        }
        if (currentCount < totalCount) {
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    skip: currentCount,
                },
            };
        }
        return null;
    }
}
export class PaginatedCloudDocuments extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.documents = body.documents || [];
        this.total_count = body.total_count || 0;
        this.offset = body.offset || 0;
    }
    getPaginatedItems() {
        return this.documents ?? [];
    }
    nextPageRequestOptions() {
        const offset = this.offset ?? 0;
        const length = this.getPaginatedItems().length;
        const currentCount = offset + length;
        const totalCount = this.total_count;
        if (!totalCount) {
            return null;
        }
        if (currentCount < totalCount) {
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    skip: currentCount,
                },
            };
        }
        return null;
    }
}
export class PaginatedQuotaConfigurations extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.page = body.page || 0;
        this.pages = body.pages || 0;
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const currentPage = this.page;
        if (currentPage >= this.pages) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page: currentPage + 1,
            },
        };
    }
}
export class PaginatedClassifyJobs extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.next_page_token = body.next_page_token || '';
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const cursor = this.next_page_token;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page_token: cursor,
            },
        };
    }
}
export class PaginatedSpreadsheetJobs extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.next_page_token = body.next_page_token || '';
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const cursor = this.next_page_token;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page_token: cursor,
            },
        };
    }
}
export class PaginatedAgentDataSearch extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.next_page_token = body.next_page_token || '';
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const cursor = this.next_page_token;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            body: {
                ...maybeObj(this.options.body),
                page_token: cursor,
            },
        };
    }
}
export class PaginatedAgentDataAggregate extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.items = body.items || [];
        this.next_page_token = body.next_page_token || '';
    }
    getPaginatedItems() {
        return this.items ?? [];
    }
    nextPageRequestOptions() {
        const cursor = this.next_page_token;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            body: {
                ...maybeObj(this.options.body),
                page_token: cursor,
            },
        };
    }
}
//# sourceMappingURL=pagination.mjs.map