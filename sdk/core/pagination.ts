// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { LlamaCloudError } from './error';
import { FinalRequestOptions } from '../internal/request-options';
import { defaultParseResponse } from '../internal/parse';
import { type LlamaCloud } from '../client';
import { APIPromise } from './api-promise';
import { type APIResponseProps } from '../internal/parse';
import { maybeObj } from '../internal/utils/values';

export type PageRequestOptions = Pick<FinalRequestOptions, 'query' | 'headers' | 'body' | 'path' | 'method'>;

export abstract class AbstractPage<Item> implements AsyncIterable<Item> {
  #client: LlamaCloud;
  protected options: FinalRequestOptions;

  protected response: Response;
  protected body: unknown;

  constructor(client: LlamaCloud, response: Response, body: unknown, options: FinalRequestOptions) {
    this.#client = client;
    this.options = options;
    this.response = response;
    this.body = body;
  }

  abstract nextPageRequestOptions(): PageRequestOptions | null;

  abstract getPaginatedItems(): Item[];

  hasNextPage(): boolean {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageRequestOptions() != null;
  }

  async getNextPage(): Promise<this> {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new LlamaCloudError(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.',
      );
    }

    return await this.#client.requestAPIList(this.constructor as any, nextOptions);
  }

  async *iterPages(): AsyncGenerator<this> {
    let page: this = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
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
export class PagePromise<
    PageClass extends AbstractPage<Item>,
    Item = ReturnType<PageClass['getPaginatedItems']>[number],
  >
  extends APIPromise<PageClass>
  implements AsyncIterable<Item>
{
  constructor(
    client: LlamaCloud,
    request: Promise<APIResponseProps>,
    Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass,
  ) {
    super(
      client,
      request,
      async (client, props) =>
        new Page(client, props.response, await defaultParseResponse(client, props), props.options),
    );
  }

  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}

export interface PaginatedJobsHistoryResponse<Item> {
  jobs: Array<Item>;

  total_count: number;

  offset: number;
}

export interface PaginatedJobsHistoryParams {
  /**
   * Number of items to skip
   */
  offset?: number;

  /**
   * Maximum number of items to return
   */
  limit?: number;
}

export class PaginatedJobsHistory<Item>
  extends AbstractPage<Item>
  implements PaginatedJobsHistoryResponse<Item>
{
  jobs: Array<Item>;

  total_count: number;

  offset: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedJobsHistoryResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.jobs = body.jobs || [];
    this.total_count = body.total_count || 0;
    this.offset = body.offset || 0;
  }

  getPaginatedItems(): Item[] {
    return this.jobs ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedPipelineFilesResponse<Item> {
  files: Array<Item>;

  total_count: number;

  offset: number;
}

export interface PaginatedPipelineFilesParams {
  /**
   * Number of items to skip
   */
  offset?: number;

  /**
   * Maximum number of items to return
   */
  limit?: number;
}

export class PaginatedPipelineFiles<Item>
  extends AbstractPage<Item>
  implements PaginatedPipelineFilesResponse<Item>
{
  files: Array<Item>;

  total_count: number;

  offset: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedPipelineFilesResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.files = body.files || [];
    this.total_count = body.total_count || 0;
    this.offset = body.offset || 0;
  }

  getPaginatedItems(): Item[] {
    return this.files ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedBatchItemsResponse<Item> {
  items: Array<Item>;

  total_size: number;
}

export interface PaginatedBatchItemsParams {
  /**
   * Number of items to skip
   */
  offset?: number;

  /**
   * Maximum number of items to return
   */
  limit?: number;
}

export class PaginatedBatchItems<Item>
  extends AbstractPage<Item>
  implements PaginatedBatchItemsResponse<Item>
{
  items: Array<Item>;

  total_size: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedBatchItemsResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.total_size = body.total_size || 0;
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const offset = (this.options.query as PaginatedBatchItemsParams).offset ?? 0;
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

export interface PaginatedExtractRunsResponse<Item> {
  items: Array<Item>;

  total: number;

  skip: number;
}

export interface PaginatedExtractRunsParams {
  /**
   * Number of extraction runs to skip
   */
  skip?: number;

  /**
   * Maximum number of extraction runs to return
   */
  limit?: number;
}

export class PaginatedExtractRuns<Item>
  extends AbstractPage<Item>
  implements PaginatedExtractRunsResponse<Item>
{
  items: Array<Item>;

  total: number;

  skip: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedExtractRunsResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.total = body.total || 0;
    this.skip = body.skip || 0;
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedCloudDocumentsResponse<Item> {
  documents: Array<Item>;

  total_count: number;

  offset: number;
}

export interface PaginatedCloudDocumentsParams {
  /**
   * Number of documents to skip
   */
  skip?: number;

  /**
   * Maximum number of documents to return
   */
  limit?: number;
}

export class PaginatedCloudDocuments<Item>
  extends AbstractPage<Item>
  implements PaginatedCloudDocumentsResponse<Item>
{
  documents: Array<Item>;

  total_count: number;

  offset: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedCloudDocumentsResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.documents = body.documents || [];
    this.total_count = body.total_count || 0;
    this.offset = body.offset || 0;
  }

  getPaginatedItems(): Item[] {
    return this.documents ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedQuotaConfigurationsResponse<Item> {
  items: Array<Item>;

  page: number;

  pages: number;
}

export interface PaginatedQuotaConfigurationsParams {
  /**
   * Page number to retrieve
   */
  page?: number;

  /**
   * Number of items per page
   */
  page_size?: number;
}

export class PaginatedQuotaConfigurations<Item>
  extends AbstractPage<Item>
  implements PaginatedQuotaConfigurationsResponse<Item>
{
  items: Array<Item>;

  page: number;

  pages: number;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedQuotaConfigurationsResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.page = body.page || 0;
    this.pages = body.pages || 0;
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedCursorResponse<Item> {
  items: Array<Item>;

  next_page_token: string;
}

export interface PaginatedCursorParams {
  /**
   * Token for retrieving next page
   */
  page_token?: string;

  /**
   * Maximum number of items to return
   */
  page_size?: number;
}

export class PaginatedCursor<Item> extends AbstractPage<Item> implements PaginatedCursorResponse<Item> {
  items: Array<Item>;

  next_page_token: string;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedCursorResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.next_page_token = body.next_page_token || '';
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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

export interface PaginatedCursorPostResponse<Item> {
  items: Array<Item>;

  next_page_token: string;
}

export interface PaginatedCursorPostParams {
  /**
   * Token for retrieving next page
   */
  page_token?: string;

  /**
   * Maximum number of items to return
   */
  page_size?: number;
}

export class PaginatedCursorPost<Item>
  extends AbstractPage<Item>
  implements PaginatedCursorPostResponse<Item>
{
  items: Array<Item>;

  next_page_token: string;

  constructor(
    client: LlamaCloud,
    response: Response,
    body: PaginatedCursorPostResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.next_page_token = body.next_page_token || '';
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  nextPageRequestOptions(): PageRequestOptions | null {
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
