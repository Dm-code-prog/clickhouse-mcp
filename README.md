# ClickHouse MCP Server

A Model Context Protocol server for ClickHouse database interactions. This server allows AI models to safely access and query ClickHouse databases.

## Installation

```bash
npm install -g clickhouse-mcp
```

## Usage

### Using npx

```bash
npx clickhouse-mcp
```

### Environment Variables

Set these environment variables before running:

- `CLICKHOUSE_HOST`: Your ClickHouse host
- `CLICKHOUSE_PORT`: Your ClickHouse port (default: 8443)
- `CLICKHOUSE_USER`: Your ClickHouse username
- `CLICKHOUSE_PASSWORD`: Your ClickHouse password
- `CLICKHOUSE_DATABASE`: Your default ClickHouse database
- `CLICKHOUSE_CONNECT_TIMEOUT_SEC`: Connection timeout in seconds (default: 10)
- `CLICKHOUSE_CERT_PATH`: Path to CA certificate (optional)

Example:

```bash
export CLICKHOUSE_HOST=your-clickhouse-server.com
export CLICKHOUSE_PORT=8443
export CLICKHOUSE_USER=default
export CLICKHOUSE_PASSWORD=your_password
export CLICKHOUSE_DATABASE=default
npx clickhouse-mcp
```

## Features

- **List Databases**: View all available databases on the server
- **List Tables**: View all tables in a specified database
- **Run SELECT Queries**: Execute read-only queries with security validation

## Security

This server enforces read-only access to your ClickHouse database by:

1. Setting the `readonly` ClickHouse setting to "1"
2. Validating that only SELECT, SHOW, and DESCRIBE statements are executed
3. Rejecting any other query types for security reasons

## License

MIT

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