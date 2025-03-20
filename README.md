# clickhouse-mcp
Clickhouse MCP client that support TLS certificate authentication

# Tools

## run_select_query

Execute SQL queries on your ClickHouse cluster.
Input: sql (string): The SQL query to execute.
All ClickHouse queries are run with readonly = 1 to ensure they are safe.

## list_databases

List all databases on your ClickHouse cluster.

## list_tables

List all tables in a database.
Input: database (string): The name of the database.


# Environment Variables
The following environment variables are used to configure the ClickHouse connection:

## Required Variables
CLICKHOUSE_HOST: The hostname of your ClickHouse server
CLICKHOUSE_USER: The username for authentication
CLICKHOUSE_PASSWORD: The password for authentication

## Optional Variables
- CLICKHOUSE_PORT: The port number of your ClickHouse server
Default: 8443 if HTTPS is enabled, 8123 if disabled
Usually doesn't need to be set unless using a non-standard port  

- CLICKHOUSE_SECURE: Enable/disable HTTPS connection
Default: "true"
Set to "false" for non-secure connections

- CLICKHOUSE_VERIFY: Enable/disable SSL certificate verification
Default: "true"
Set to "false" to disable certificate verification (not recommended for production)  

- CLICKHOUSE_CONNECT_TIMEOUT: Connection timeout in seconds
Default: "30"
Increase this value if you experience connection timeouts  

- CLICKHOUSE_SEND_RECEIVE_TIMEOUT: Send/receive timeout in seconds  
Default: "300"
Increase this value for long-running queries
- CLICKHOUSE_DATABASE: Default database to use  
Default: None (uses server default)
Set this to automatically connect to a specific database

- CLICKHOUSE_CERT_PATH: Path to the TLS certificate file
Default: None
Set this to the path of your TLS certificate file if using HTTPS