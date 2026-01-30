import { APIResource } from "../core/resource.mjs";
import * as Shared from "./shared.mjs";
import { APIPromise } from "../core/api-promise.mjs";
import { RequestOptions } from "../internal/request-options.mjs";
export declare class DataSources extends APIResource {
    /**
     * Create a new data source.
     */
    create(params: DataSourceCreateParams, options?: RequestOptions): APIPromise<DataSource>;
    /**
     * Update a data source by ID.
     */
    update(dataSourceID: string, body: DataSourceUpdateParams, options?: RequestOptions): APIPromise<DataSource>;
    /**
     * List data sources for a given project. If project_id is not provided, uses the
     * default project.
     */
    list(query?: DataSourceListParams | null | undefined, options?: RequestOptions): APIPromise<DataSourceListResponse>;
    /**
     * Delete a data source by ID.
     */
    delete(dataSourceID: string, options?: RequestOptions): APIPromise<void>;
    /**
     * Get a data source by ID.
     */
    get(dataSourceID: string, options?: RequestOptions): APIPromise<DataSource>;
}
/**
 * Schema for a data source.
 */
export interface DataSource {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Component that implements the data source
     */
    component: {
        [key: string]: unknown;
    } | Shared.CloudS3DataSource | Shared.CloudAzStorageBlobDataSource | Shared.CloudOneDriveDataSource | Shared.CloudSharepointDataSource | Shared.CloudSlackDataSource | Shared.CloudNotionPageDataSource | Shared.CloudConfluenceDataSource | Shared.CloudJiraDataSource | Shared.CloudJiraDataSourceV2 | Shared.CloudBoxDataSource;
    /**
     * The name of the data source.
     */
    name: string;
    project_id: string;
    source_type: 'S3' | 'AZURE_STORAGE_BLOB' | 'GOOGLE_DRIVE' | 'MICROSOFT_ONEDRIVE' | 'MICROSOFT_SHAREPOINT' | 'SLACK' | 'NOTION_PAGE' | 'CONFLUENCE' | 'JIRA' | 'JIRA_V2' | 'BOX';
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Custom metadata that will be present on all data loaded from the data source
     */
    custom_metadata?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
    /**
     * Version metadata for the data source
     */
    version_metadata?: DataSourceReaderVersionMetadata | null;
}
export interface DataSourceReaderVersionMetadata {
    /**
     * The version of the reader to use for this data source.
     */
    reader_version?: '1.0' | '2.0' | '2.1' | null;
}
export type DataSourceListResponse = Array<DataSource>;
export interface DataSourceCreateParams {
    /**
     * Body param: Component that implements the data source
     */
    component: {
        [key: string]: unknown;
    } | Shared.CloudS3DataSource | Shared.CloudAzStorageBlobDataSource | Shared.CloudOneDriveDataSource | Shared.CloudSharepointDataSource | Shared.CloudSlackDataSource | Shared.CloudNotionPageDataSource | Shared.CloudConfluenceDataSource | Shared.CloudJiraDataSource | Shared.CloudJiraDataSourceV2 | Shared.CloudBoxDataSource;
    /**
     * Body param: The name of the data source.
     */
    name: string;
    /**
     * Body param
     */
    source_type: 'S3' | 'AZURE_STORAGE_BLOB' | 'GOOGLE_DRIVE' | 'MICROSOFT_ONEDRIVE' | 'MICROSOFT_SHAREPOINT' | 'SLACK' | 'NOTION_PAGE' | 'CONFLUENCE' | 'JIRA' | 'JIRA_V2' | 'BOX';
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: Custom metadata that will be present on all data loaded from the
     * data source
     */
    custom_metadata?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
}
export interface DataSourceUpdateParams {
    source_type: 'S3' | 'AZURE_STORAGE_BLOB' | 'GOOGLE_DRIVE' | 'MICROSOFT_ONEDRIVE' | 'MICROSOFT_SHAREPOINT' | 'SLACK' | 'NOTION_PAGE' | 'CONFLUENCE' | 'JIRA' | 'JIRA_V2' | 'BOX';
    /**
     * Component that implements the data source
     */
    component?: {
        [key: string]: unknown;
    } | Shared.CloudS3DataSource | Shared.CloudAzStorageBlobDataSource | Shared.CloudOneDriveDataSource | Shared.CloudSharepointDataSource | Shared.CloudSlackDataSource | Shared.CloudNotionPageDataSource | Shared.CloudConfluenceDataSource | Shared.CloudJiraDataSource | Shared.CloudJiraDataSourceV2 | Shared.CloudBoxDataSource | null;
    /**
     * Custom metadata that will be present on all data loaded from the data source
     */
    custom_metadata?: {
        [key: string]: {
            [key: string]: unknown;
        } | Array<unknown> | string | number | boolean | null;
    } | null;
    /**
     * The name of the data source.
     */
    name?: string | null;
}
export interface DataSourceListParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace DataSources {
    export { type DataSource as DataSource, type DataSourceReaderVersionMetadata as DataSourceReaderVersionMetadata, type DataSourceListResponse as DataSourceListResponse, type DataSourceCreateParams as DataSourceCreateParams, type DataSourceUpdateParams as DataSourceUpdateParams, type DataSourceListParams as DataSourceListParams, };
}
//# sourceMappingURL=data-sources.d.mts.map