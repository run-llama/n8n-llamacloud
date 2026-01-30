import { APIResource } from "../../core/resource.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
export declare class AgentData extends APIResource {
    /**
     * Update agent data by ID (overwrites).
     */
    update(itemID: string, params: AgentDataUpdateParams, options?: RequestOptions): APIPromise<AgentData>;
    /**
     * Delete agent data by ID.
     */
    delete(itemID: string, params?: AgentDataDeleteParams | null | undefined, options?: RequestOptions): APIPromise<AgentDataDeleteResponse>;
    /**
     * Create new agent data.
     */
    agentData(params: AgentDataAgentDataParams, options?: RequestOptions): APIPromise<AgentData>;
    /**
     * Aggregate agent data with grouping and optional counting/first item retrieval.
     */
    aggregate(params: AgentDataAggregateParams, options?: RequestOptions): APIPromise<AgentDataAggregateResponse>;
    /**
     * Bulk delete agent data by query (deployment_name, collection, optional filters).
     */
    deleteByQuery(params: AgentDataDeleteByQueryParams, options?: RequestOptions): APIPromise<AgentDataDeleteByQueryResponse>;
    /**
     * Get agent data by ID.
     */
    get(itemID: string, query?: AgentDataGetParams | null | undefined, options?: RequestOptions): APIPromise<AgentData>;
    /**
     * Search agent data with filtering, sorting, and pagination.
     */
    search(params: AgentDataSearchParams, options?: RequestOptions): APIPromise<AgentDataSearchResponse>;
}
/**
 * API Result for a single agent data item
 */
export interface AgentData {
    data: {
        [key: string]: unknown;
    };
    deployment_name: string;
    id?: string | null;
    collection?: string;
    created_at?: string | null;
    project_id?: string | null;
    updated_at?: string | null;
}
export type AgentDataDeleteResponse = {
    [key: string]: string;
};
export interface AgentDataAggregateResponse {
    /**
     * The list of items.
     */
    items: Array<AgentDataAggregateResponse.Item>;
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this
     * field is omitted, there are no subsequent pages.
     */
    next_page_token?: string | null;
    /**
     * The total number of items available. This is only populated when specifically
     * requested. The value may be an estimate and can be used for display purposes
     * only.
     */
    total_size?: number | null;
}
export declare namespace AgentDataAggregateResponse {
    /**
     * API Result for a single group in the aggregate response
     */
    interface Item {
        group_key: {
            [key: string]: unknown;
        };
        count?: number | null;
        first_item?: {
            [key: string]: unknown;
        } | null;
    }
}
/**
 * API response for bulk delete operation
 */
export interface AgentDataDeleteByQueryResponse {
    deleted_count: number;
}
export interface AgentDataSearchResponse {
    /**
     * The list of items.
     */
    items: Array<AgentData>;
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this
     * field is omitted, there are no subsequent pages.
     */
    next_page_token?: string | null;
    /**
     * The total number of items available. This is only populated when specifically
     * requested. The value may be an estimate and can be used for display purposes
     * only.
     */
    total_size?: number | null;
}
export interface AgentDataUpdateParams {
    /**
     * Body param
     */
    data: {
        [key: string]: unknown;
    };
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
}
export interface AgentDataDeleteParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface AgentDataAgentDataParams {
    /**
     * Body param
     */
    data: {
        [key: string]: unknown;
    };
    /**
     * Body param
     */
    deployment_name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param
     */
    collection?: string;
}
export interface AgentDataAggregateParams {
    /**
     * Body param: The agent deployment's name to aggregate data for
     */
    deployment_name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The logical agent data collection to aggregate data for
     */
    collection?: string;
    /**
     * Body param: Whether to count the number of items in each group
     */
    count?: boolean | null;
    /**
     * Body param: A filter object or expression that filters resources listed in the
     * response.
     */
    filter?: {
        [key: string]: AgentDataAggregateParams.Filter;
    } | null;
    /**
     * Body param: Whether to return the first item in each group (Sorted by
     * created_at)
     */
    first?: boolean | null;
    /**
     * Body param: The fields to group by. If empty, the entire dataset is grouped on.
     * e.g. if left out, can be used for simple count operations
     */
    group_by?: Array<string> | null;
    /**
     * Body param: The offset to start from. If not provided, the first page is
     * returned
     */
    offset?: number | null;
    /**
     * Body param: A comma-separated list of fields to order by, sorted in ascending
     * order. Use 'field_name desc' to specify descending order.
     */
    order_by?: string | null;
    /**
     * Body param: The maximum number of items to return. The service may return fewer
     * than this value. If unspecified, a default page size will be used. The maximum
     * value is typically 1000; values above this will be coerced to the maximum.
     */
    page_size?: number | null;
    /**
     * Body param: A page token, received from a previous list call. Provide this to
     * retrieve the subsequent page.
     */
    page_token?: string | null;
}
export declare namespace AgentDataAggregateParams {
    /**
     * API request model for a filter comparison operation.
     */
    interface Filter {
        eq?: number | string | (string & {}) | null;
        gt?: number | string | (string & {}) | null;
        gte?: number | string | (string & {}) | null;
        includes?: Array<number | string | (string & {}) | null>;
        lt?: number | string | (string & {}) | null;
        lte?: number | string | (string & {}) | null;
    }
}
export interface AgentDataDeleteByQueryParams {
    /**
     * Body param: The agent deployment's name to delete data for
     */
    deployment_name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The logical agent data collection to delete from
     */
    collection?: string;
    /**
     * Body param: Optional filters to select which items to delete
     */
    filter?: {
        [key: string]: AgentDataDeleteByQueryParams.Filter;
    } | null;
}
export declare namespace AgentDataDeleteByQueryParams {
    /**
     * API request model for a filter comparison operation.
     */
    interface Filter {
        eq?: number | string | (string & {}) | null;
        gt?: number | string | (string & {}) | null;
        gte?: number | string | (string & {}) | null;
        includes?: Array<number | string | (string & {}) | null>;
        lt?: number | string | (string & {}) | null;
        lte?: number | string | (string & {}) | null;
    }
}
export interface AgentDataGetParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export interface AgentDataSearchParams {
    /**
     * Body param: The agent deployment's name to search within
     */
    deployment_name: string;
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
    /**
     * Body param: The logical agent data collection to search within
     */
    collection?: string;
    /**
     * Body param: A filter object or expression that filters resources listed in the
     * response.
     */
    filter?: {
        [key: string]: AgentDataSearchParams.Filter;
    } | null;
    /**
     * Body param: Whether to include the total number of items in the response
     */
    include_total?: boolean;
    /**
     * Body param: The offset to start from. If not provided, the first page is
     * returned
     */
    offset?: number | null;
    /**
     * Body param: A comma-separated list of fields to order by, sorted in ascending
     * order. Use 'field_name desc' to specify descending order.
     */
    order_by?: string | null;
    /**
     * Body param: The maximum number of items to return. The service may return fewer
     * than this value. If unspecified, a default page size will be used. The maximum
     * value is typically 1000; values above this will be coerced to the maximum.
     */
    page_size?: number | null;
    /**
     * Body param: A page token, received from a previous list call. Provide this to
     * retrieve the subsequent page.
     */
    page_token?: string | null;
}
export declare namespace AgentDataSearchParams {
    /**
     * API request model for a filter comparison operation.
     */
    interface Filter {
        eq?: number | string | (string & {}) | null;
        gt?: number | string | (string & {}) | null;
        gte?: number | string | (string & {}) | null;
        includes?: Array<number | string | (string & {}) | null>;
        lt?: number | string | (string & {}) | null;
        lte?: number | string | (string & {}) | null;
    }
}
export declare namespace AgentData {
    export { type AgentData as AgentData, type AgentDataDeleteResponse as AgentDataDeleteResponse, type AgentDataAggregateResponse as AgentDataAggregateResponse, type AgentDataDeleteByQueryResponse as AgentDataDeleteByQueryResponse, type AgentDataSearchResponse as AgentDataSearchResponse, type AgentDataUpdateParams as AgentDataUpdateParams, type AgentDataDeleteParams as AgentDataDeleteParams, type AgentDataAgentDataParams as AgentDataAgentDataParams, type AgentDataAggregateParams as AgentDataAggregateParams, type AgentDataDeleteByQueryParams as AgentDataDeleteByQueryParams, type AgentDataGetParams as AgentDataGetParams, type AgentDataSearchParams as AgentDataSearchParams, };
}
//# sourceMappingURL=agent-data.d.mts.map