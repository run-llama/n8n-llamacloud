// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Projects extends APIResource {
  /**
   * List projects or get one by name
   */
  list(
    query: ProjectListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ProjectListResponse> {
    return this._client.get('/api/v1/projects', { query, ...options });
  }

  /**
   * Get a project by ID.
   */
  get(
    projectID: string,
    query: ProjectGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Project> {
    return this._client.get(path`/api/v1/projects/${projectID}`, { query, ...options });
  }
}

/**
 * Schema for a project.
 */
export interface Project {
  /**
   * Unique identifier
   */
  id: string;

  name: string;

  /**
   * The Organization ID the project is under.
   */
  organization_id: string;

  ad_hoc_eval_dataset_id?: string | null;

  /**
   * Creation datetime
   */
  created_at?: string | null;

  /**
   * Whether this project is the default project for the user.
   */
  is_default?: boolean;

  /**
   * Update datetime
   */
  updated_at?: string | null;
}

export type ProjectListResponse = Array<Project>;

export interface ProjectListParams {
  organization_id?: string | null;

  project_name?: string | null;
}

export interface ProjectGetParams {
  organization_id?: string | null;
}

export declare namespace Projects {
  export {
    type Project as Project,
    type ProjectListResponse as ProjectListResponse,
    type ProjectListParams as ProjectListParams,
    type ProjectGetParams as ProjectGetParams,
  };
}
