// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Images extends APIResource {
  /**
   * Get a specific figure from a page of a file.
   */
  getPageFigure(
    figureName: string,
    params: ImageGetPageFigureParams,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    const { id, page_index, ...query } = params;
    return this._client.get(path`/api/v1/files/${id}/page-figures/${page_index}/${figureName}`, {
      query,
      ...options,
    });
  }

  /**
   * Get screenshot of a page from a file.
   */
  getPageScreenshot(
    pageIndex: number,
    params: ImageGetPageScreenshotParams,
    options?: RequestOptions,
  ): APIPromise<unknown> {
    const { id, ...query } = params;
    return this._client.get(path`/api/v1/files/${id}/page_screenshots/${pageIndex}`, { query, ...options });
  }

  /**
   * List metadata for all figures from all pages of a file.
   */
  listPageFigures(
    id: string,
    query: ImageListPageFiguresParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ImageListPageFiguresResponse> {
    return this._client.get(path`/api/v1/files/${id}/page-figures`, { query, ...options });
  }

  /**
   * List metadata for all screenshots of pages from a file.
   */
  listPageScreenshots(
    id: string,
    query: ImageListPageScreenshotsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ImageListPageScreenshotsResponse> {
    return this._client.get(path`/api/v1/files/${id}/page_screenshots`, { query, ...options });
  }
}

export type ImageGetPageFigureResponse = unknown;

export type ImageGetPageScreenshotResponse = unknown;

export type ImageListPageFiguresResponse =
  Array<ImageListPageFiguresResponse.ImageListPageFiguresResponseItem>;

export namespace ImageListPageFiguresResponse {
  export interface ImageListPageFiguresResponseItem {
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
    metadata?: { [key: string]: unknown } | null;
  }
}

export type ImageListPageScreenshotsResponse =
  Array<ImageListPageScreenshotsResponse.ImageListPageScreenshotsResponseItem>;

export namespace ImageListPageScreenshotsResponse {
  export interface ImageListPageScreenshotsResponseItem {
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
    metadata?: { [key: string]: unknown } | null;
  }
}

export interface ImageGetPageFigureParams {
  /**
   * Path param
   */
  id: string;

  /**
   * Path param
   */
  page_index: number;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;
}

export interface ImageGetPageScreenshotParams {
  /**
   * Path param
   */
  id: string;

  /**
   * Query param
   */
  organization_id?: string | null;

  /**
   * Query param
   */
  project_id?: string | null;
}

export interface ImageListPageFiguresParams {
  organization_id?: string | null;

  project_id?: string | null;
}

export interface ImageListPageScreenshotsParams {
  organization_id?: string | null;

  project_id?: string | null;
}

export declare namespace Images {
  export {
    type ImageGetPageFigureResponse as ImageGetPageFigureResponse,
    type ImageGetPageScreenshotResponse as ImageGetPageScreenshotResponse,
    type ImageListPageFiguresResponse as ImageListPageFiguresResponse,
    type ImageListPageScreenshotsResponse as ImageListPageScreenshotsResponse,
    type ImageGetPageFigureParams as ImageGetPageFigureParams,
    type ImageGetPageScreenshotParams as ImageGetPageScreenshotParams,
    type ImageListPageFiguresParams as ImageListPageFiguresParams,
    type ImageListPageScreenshotsParams as ImageListPageScreenshotsParams,
  };
}
