import { APIResource } from "../core/resource.js";
import * as Shared from "./shared.js";
import { APIPromise } from "../core/api-promise.js";
import { RequestOptions } from "../internal/request-options.js";
export declare class DataSinks extends APIResource {
    /**
     * Create a new data sink.
     */
    create(params: DataSinkCreateParams, options?: RequestOptions): APIPromise<DataSink>;
    /**
     * Update a data sink by ID.
     */
    update(dataSinkID: string, body: DataSinkUpdateParams, options?: RequestOptions): APIPromise<DataSink>;
    /**
     * List data sinks for a given project.
     */
    list(query?: DataSinkListParams | null | undefined, options?: RequestOptions): APIPromise<DataSinkListResponse>;
    /**
     * Delete a data sink by ID.
     */
    delete(dataSinkID: string, options?: RequestOptions): APIPromise<void>;
    /**
     * Get a data sink by ID.
     */
    get(dataSinkID: string, options?: RequestOptions): APIPromise<DataSink>;
}
/**
 * Schema for a data sink.
 */
export interface DataSink {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Component that implements the data sink
     */
    component: {
        [key: string]: unknown;
    } | Shared.CloudPineconeVectorStore | Shared.CloudPostgresVectorStore | Shared.CloudQdrantVectorStore | Shared.CloudAzureAISearchVectorStore | Shared.CloudMongoDBAtlasVectorSearch | Shared.CloudMilvusVectorStore | Shared.CloudAstraDBVectorStore;
    /**
     * The name of the data sink.
     */
    name: string;
    project_id: string;
    sink_type: 'PINECONE' | 'POSTGRES' | 'QDRANT' | 'AZUREAI_SEARCH' | 'MONGODB_ATLAS' | 'MILVUS' | 'ASTRA_DB';
    /**
     * Creation datetime
     */
    created_at?: string | null;
    /**
     * Update datetime
     */
    updated_at?: string | null;
}
export type DataSinkListResponse = Array<DataSink>;
export interface DataSinkCreateParams {
    /**
     * Body param: Component that implements the data sink
     */
    component: {
        [key: string]: unknown;
    } | Shared.CloudPineconeVectorStore | Shared.CloudPostgresVectorStore | Shared.CloudQdrantVectorStore | Shared.CloudAzureAISearchVectorStore | Shared.CloudMongoDBAtlasVectorSearch | Shared.CloudMilvusVectorStore | Shared.CloudAstraDBVectorStore;
    /**
     * Body param: The name of the data sink.
     */
    name: string;
    /**
     * Body param
     */
    sink_type: 'PINECONE' | 'POSTGRES' | 'QDRANT' | 'AZUREAI_SEARCH' | 'MONGODB_ATLAS' | 'MILVUS' | 'ASTRA_DB';
    /**
     * Query param
     */
    organization_id?: string | null;
    /**
     * Query param
     */
    project_id?: string | null;
}
export interface DataSinkUpdateParams {
    sink_type: 'PINECONE' | 'POSTGRES' | 'QDRANT' | 'AZUREAI_SEARCH' | 'MONGODB_ATLAS' | 'MILVUS' | 'ASTRA_DB';
    /**
     * Component that implements the data sink
     */
    component?: {
        [key: string]: unknown;
    } | Shared.CloudPineconeVectorStore | Shared.CloudPostgresVectorStore | Shared.CloudQdrantVectorStore | Shared.CloudAzureAISearchVectorStore | Shared.CloudMongoDBAtlasVectorSearch | Shared.CloudMilvusVectorStore | Shared.CloudAstraDBVectorStore | null;
    /**
     * The name of the data sink.
     */
    name?: string | null;
}
export interface DataSinkListParams {
    organization_id?: string | null;
    project_id?: string | null;
}
export declare namespace DataSinks {
    export { type DataSink as DataSink, type DataSinkListResponse as DataSinkListResponse, type DataSinkCreateParams as DataSinkCreateParams, type DataSinkUpdateParams as DataSinkUpdateParams, type DataSinkListParams as DataSinkListParams, };
}
//# sourceMappingURL=data-sinks.d.ts.map