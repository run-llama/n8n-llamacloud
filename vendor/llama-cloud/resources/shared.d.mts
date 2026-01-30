/**
 * Cloud AstraDB Vector Store.
 *
 * This class is used to store the configuration for an AstraDB vector store, so
 * that it can be created and used in LlamaCloud.
 *
 * Args: token (str): The Astra DB Application Token to use. api_endpoint (str):
 * The Astra DB JSON API endpoint for your database. collection_name (str):
 * Collection name to use. If not existing, it will be created. embedding_dimension
 * (int): Length of the embedding vectors in use. keyspace (optional[str]): The
 * keyspace to use. If not provided, 'default_keyspace'
 */
export interface CloudAstraDBVectorStore {
    /**
     * The Astra DB JSON API endpoint for your database
     */
    api_endpoint: string;
    /**
     * Collection name to use. If not existing, it will be created
     */
    collection_name: string;
    /**
     * Length of the embedding vectors in use
     */
    embedding_dimension: number;
    class_name?: string;
    /**
     * The keyspace to use. If not provided, 'default_keyspace'
     */
    keyspace?: string | null;
    supports_nested_metadata_filters?: true;
}
export interface CloudAzStorageBlobDataSource {
    /**
     * The Azure Storage Blob account URL to use for authentication.
     */
    account_url: string;
    /**
     * The name of the Azure Storage Blob container to read from.
     */
    container_name: string;
    /**
     * The Azure Storage Blob account name to use for authentication.
     */
    account_name?: string | null;
    /**
     * The blob name to read from.
     */
    blob?: string | null;
    class_name?: string;
    /**
     * The Azure AD client ID to use for authentication.
     */
    client_id?: string | null;
    /**
     * The prefix of the Azure Storage Blob objects to read from.
     */
    prefix?: string | null;
    supports_access_control?: boolean;
    /**
     * The Azure AD tenant ID to use for authentication.
     */
    tenant_id?: string | null;
}
/**
 * Cloud Azure AI Search Vector Store.
 */
export interface CloudAzureAISearchVectorStore {
    search_service_endpoint: string;
    class_name?: string;
    client_id?: string | null;
    embedding_dimension?: number | null;
    filterable_metadata_field_keys?: {
        [key: string]: unknown;
    } | null;
    index_name?: string | null;
    search_service_api_version?: string | null;
    supports_nested_metadata_filters?: true;
    tenant_id?: string | null;
}
export interface CloudBoxDataSource {
    /**
     * The type of authentication to use (Developer Token or CCG)
     */
    authentication_mechanism: 'developer_token' | 'ccg';
    class_name?: string;
    /**
     * Box API key used for identifying the application the user is authenticating with
     */
    client_id?: string | null;
    /**
     * Box Enterprise ID, if provided authenticates as service.
     */
    enterprise_id?: string | null;
    /**
     * The ID of the Box folder to read from.
     */
    folder_id?: string | null;
    supports_access_control?: boolean;
    /**
     * Box User ID, if provided authenticates as user.
     */
    user_id?: string | null;
}
export interface CloudConfluenceDataSource {
    /**
     * Type of Authentication for connecting to Confluence APIs.
     */
    authentication_mechanism: string;
    /**
     * The server URL of the Confluence instance.
     */
    server_url: string;
    class_name?: string;
    /**
     * The CQL query to use for fetching pages.
     */
    cql?: string | null;
    /**
     * Configuration for handling failures during processing. Key-value object
     * controlling failure handling behaviors.
     *
     * Example: { "skip_list_failures": true }
     *
     * Currently supports:
     *
     * - skip_list_failures: Skip failed batches/lists and continue processing
     */
    failure_handling?: FailureHandlingConfig;
    /**
     * Whether to index restricted pages.
     */
    index_restricted_pages?: boolean;
    /**
     * Whether to keep the markdown format.
     */
    keep_markdown_format?: boolean;
    /**
     * The label to use for fetching pages.
     */
    label?: string | null;
    /**
     * The page IDs of the Confluence to read from.
     */
    page_ids?: string | null;
    /**
     * The space key to read from.
     */
    space_key?: string | null;
    supports_access_control?: boolean;
    /**
     * The username to use for authentication.
     */
    user_name?: string | null;
}
/**
 * Cloud Jira Data Source integrating JiraReader.
 */
export interface CloudJiraDataSource {
    /**
     * Type of Authentication for connecting to Jira APIs.
     */
    authentication_mechanism: string;
    /**
     * JQL (Jira Query Language) query to search.
     */
    query: string;
    class_name?: string;
    /**
     * The cloud ID, used in case of OAuth2.
     */
    cloud_id?: string | null;
    /**
     * The email address to use for authentication.
     */
    email?: string | null;
    /**
     * The server url for Jira Cloud.
     */
    server_url?: string | null;
    supports_access_control?: boolean;
}
/**
 * Cloud Jira Data Source integrating JiraReaderV2.
 */
export interface CloudJiraDataSourceV2 {
    /**
     * Type of Authentication for connecting to Jira APIs.
     */
    authentication_mechanism: string;
    /**
     * JQL (Jira Query Language) query to search.
     */
    query: string;
    /**
     * The server url for Jira Cloud.
     */
    server_url: string;
    /**
     * Jira REST API version to use (2 or 3). 3 supports Atlassian Document Format
     * (ADF).
     */
    api_version?: '2' | '3';
    class_name?: string;
    /**
     * The cloud ID, used in case of OAuth2.
     */
    cloud_id?: string | null;
    /**
     * The email address to use for authentication.
     */
    email?: string | null;
    /**
     * Fields to expand in the response.
     */
    expand?: string | null;
    /**
     * List of fields to retrieve from Jira. If None, retrieves all fields.
     */
    fields?: Array<string> | null;
    /**
     * Whether to fetch project role permissions and issue-level security
     */
    get_permissions?: boolean;
    /**
     * Rate limit for Jira API requests per minute.
     */
    requests_per_minute?: number | null;
    supports_access_control?: boolean;
}
/**
 * Cloud Milvus Vector Store.
 */
export interface CloudMilvusVectorStore {
    uri: string;
    class_name?: string;
    collection_name?: string | null;
    embedding_dimension?: number | null;
    supports_nested_metadata_filters?: boolean;
}
/**
 * Cloud MongoDB Atlas Vector Store.
 *
 * This class is used to store the configuration for a MongoDB Atlas vector store,
 * so that it can be created and used in LlamaCloud.
 *
 * Args: mongodb_uri (str): URI for connecting to MongoDB Atlas db_name (str): name
 * of the MongoDB database collection_name (str): name of the MongoDB collection
 * vector_index_name (str): name of the MongoDB Atlas vector index
 * fulltext_index_name (str): name of the MongoDB Atlas full-text index
 */
export interface CloudMongoDBAtlasVectorSearch {
    collection_name: string;
    db_name: string;
    class_name?: string;
    embedding_dimension?: number | null;
    fulltext_index_name?: string | null;
    supports_nested_metadata_filters?: boolean;
    vector_index_name?: string | null;
}
export interface CloudNotionPageDataSource {
    class_name?: string;
    /**
     * The Notion Database Id to read content from.
     */
    database_ids?: string | null;
    /**
     * The Page ID's of the Notion to read from.
     */
    page_ids?: string | null;
    supports_access_control?: boolean;
}
export interface CloudOneDriveDataSource {
    /**
     * The client ID to use for authentication.
     */
    client_id: string;
    /**
     * The tenant ID to use for authentication.
     */
    tenant_id: string;
    /**
     * The user principal name to use for authentication.
     */
    user_principal_name: string;
    class_name?: string;
    /**
     * The ID of the OneDrive folder to read from.
     */
    folder_id?: string | null;
    /**
     * The path of the OneDrive folder to read from.
     */
    folder_path?: string | null;
    /**
     * The list of required file extensions.
     */
    required_exts?: Array<string> | null;
    supports_access_control?: true;
}
/**
 * Cloud Pinecone Vector Store.
 *
 * This class is used to store the configuration for a Pinecone vector store, so
 * that it can be created and used in LlamaCloud.
 *
 * Args: api_key (str): API key for authenticating with Pinecone index_name (str):
 * name of the Pinecone index namespace (optional[str]): namespace to use in the
 * Pinecone index insert_kwargs (optional[dict]): additional kwargs to pass during
 * insertion
 */
export interface CloudPineconeVectorStore {
    index_name: string;
    class_name?: string;
    insert_kwargs?: {
        [key: string]: unknown;
    } | null;
    namespace?: string | null;
    supports_nested_metadata_filters?: true;
}
export interface CloudPostgresVectorStore {
    database: string;
    embed_dim: number;
    host: string;
    port: number;
    schema_name: string;
    table_name: string;
    user: string;
    class_name?: string;
    /**
     * HNSW settings for PGVector.
     */
    hnsw_settings?: PgVectorHnswSettings | null;
    hybrid_search?: boolean | null;
    perform_setup?: boolean;
    supports_nested_metadata_filters?: boolean;
}
/**
 * Cloud Qdrant Vector Store.
 *
 * This class is used to store the configuration for a Qdrant vector store, so that
 * it can be created and used in LlamaCloud.
 *
 * Args: collection_name (str): name of the Qdrant collection url (str): url of the
 * Qdrant instance api_key (str): API key for authenticating with Qdrant
 * max_retries (int): maximum number of retries in case of a failure. Defaults to 3
 * client_kwargs (dict): additional kwargs to pass to the Qdrant client
 */
export interface CloudQdrantVectorStore {
    collection_name: string;
    url: string;
    class_name?: string;
    client_kwargs?: {
        [key: string]: unknown;
    };
    max_retries?: number;
    supports_nested_metadata_filters?: true;
}
export interface CloudS3DataSource {
    /**
     * The name of the S3 bucket to read from.
     */
    bucket: string;
    /**
     * The AWS access ID to use for authentication.
     */
    aws_access_id?: string | null;
    class_name?: string;
    /**
     * The prefix of the S3 objects to read from.
     */
    prefix?: string | null;
    /**
     * The regex pattern to filter S3 objects. Must be a valid regex pattern.
     */
    regex_pattern?: string | null;
    /**
     * The S3 endpoint URL to use for authentication.
     */
    s3_endpoint_url?: string | null;
    supports_access_control?: boolean;
}
export interface CloudSharepointDataSource {
    /**
     * The client ID to use for authentication.
     */
    client_id: string;
    /**
     * The tenant ID to use for authentication.
     */
    tenant_id: string;
    class_name?: string;
    /**
     * The name of the Sharepoint drive to read from.
     */
    drive_name?: string | null;
    /**
     * List of regex patterns for file paths to exclude. Files whose paths (including
     * filename) match any pattern will be excluded. Example: ['/temp/', '/backup/',
     * '\.git/', '\.tmp$', '^~']
     */
    exclude_path_patterns?: Array<string> | null;
    /**
     * The ID of the Sharepoint folder to read from.
     */
    folder_id?: string | null;
    /**
     * The path of the Sharepoint folder to read from.
     */
    folder_path?: string | null;
    /**
     * Whether to get permissions for the sharepoint site.
     */
    get_permissions?: boolean | null;
    /**
     * List of regex patterns for file paths to include. Full paths (including
     * filename) must match at least one pattern to be included. Example: ['/reports/',
     * '/docs/.*\.pdf$', '^Report.*\.pdf$']
     */
    include_path_patterns?: Array<string> | null;
    /**
     * The list of required file extensions.
     */
    required_exts?: Array<string> | null;
    /**
     * The ID of the SharePoint site to download from.
     */
    site_id?: string | null;
    /**
     * The name of the SharePoint site to download from.
     */
    site_name?: string | null;
    supports_access_control?: true;
}
export interface CloudSlackDataSource {
    /**
     * Slack Channel.
     */
    channel_ids?: string | null;
    /**
     * Slack Channel name pattern.
     */
    channel_patterns?: string | null;
    class_name?: string;
    /**
     * Earliest date.
     */
    earliest_date?: string | null;
    /**
     * Earliest date timestamp.
     */
    earliest_date_timestamp?: number | null;
    /**
     * Latest date.
     */
    latest_date?: string | null;
    /**
     * Latest date timestamp.
     */
    latest_date_timestamp?: number | null;
    supports_access_control?: boolean;
}
/**
 * Configuration for handling different types of failures during data source
 * processing.
 */
export interface FailureHandlingConfig {
    /**
     * Whether to skip failed batches/lists and continue processing
     */
    skip_list_failures?: boolean;
}
/**
 * HNSW settings for PGVector.
 */
export interface PgVectorHnswSettings {
    /**
     * The distance method to use.
     */
    distance_method?: 'l2' | 'ip' | 'cosine' | 'l1' | 'hamming' | 'jaccard';
    /**
     * The number of edges to use during the construction phase.
     */
    ef_construction?: number;
    /**
     * The number of edges to use during the search phase.
     */
    ef_search?: number;
    /**
     * The number of bi-directional links created for each new element.
     */
    m?: number;
    /**
     * The type of vector to use.
     */
    vector_type?: 'vector' | 'half_vec' | 'bit' | 'sparse_vec';
}
//# sourceMappingURL=shared.d.mts.map