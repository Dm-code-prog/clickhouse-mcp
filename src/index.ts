import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createClient, ClickHouseClient, ClickHouseClientConfigOptions } from '@clickhouse/client';
import fs from "fs";
import { z } from "zod";

import { env } from "./env.js";

/**
 * Start the ClickHouse MCP server
 */
export function startServer() {
    // Create server instance
    const server = new McpServer({
        name: "clickhouse-mcp",
        version: "1.0.0",
    });


    const client: ClickHouseClient = createClient({
        username: env.CLICKHOUSE_USER,
        password: env.CLICKHOUSE_PASSWORD,
        database: env.CLICKHOUSE_DATABASE,
        url: `https://${env.CLICKHOUSE_HOST}:${env.CLICKHOUSE_PORT}`,
        request_timeout: env.CLICKHOUSE_CONNECT_TIMEOUT_SEC * 1000,
        compression: {
            response: true,
            request: false
        },
        tls: env.CLICKHOUSE_CERT_PATH ? {
            ca_cert: fs.readFileSync(env.CLICKHOUSE_CERT_PATH)
        } : undefined,
        clickhouse_settings: {
            readonly: "1"
        }
    } satisfies ClickHouseClientConfigOptions);



    client.ping().catch((err) => {
        console.error({
            status: 'error',
            message: 'Failed to connect to ClickHouse server',
            error: err
        });
        process.exit(1);
    });



    server.tool(
        "list_databases",
        "List all databases on the ClickHouse server",
        {},
        async () => {
            const result = await client.query({
                query: "SHOW DATABASES",
                format: "JSON"
            });


            const databases = await result.json();

            const foundDatabases = `Found the following databases on the ClickHouse server: ${databases.data.map((db: any) => db.name).join(", ")}`;

            return {
                content: [{
                    type: "text",
                    text: foundDatabases
                }]
            }
        }
    )

    server.tool(
        "list_tables",
        "List all tables in a specified database",
        {
            database: z.string().optional().describe("The database name to list tables from")
        },
        async (params) => {
            try {
                const database = params.database || env.CLICKHOUSE_DATABASE;
                const result = await client.query({
                    query: `SHOW TABLES FROM ${database}`,
                    format: "JSON"
                });

                const tables = await result.json();

                if (tables.data.length === 0) {
                    return {
                        content: [{
                            type: "text",
                            text: `No tables found in database: ${database}`
                        }]
                    };
                }

                const foundTables = `Found the following tables in database ${database}: ${tables.data.map((table: any) => table.name).join(", ")}`;

                return {
                    content: [{
                        type: "text",
                        text: foundTables
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: "text",
                        text: `Error listing tables: ${error.message}`
                    }],
                    isError: true
                };
            }
        }
    )

    server.tool(
        "run_select_query",
        "Run a SELECT query on the ClickHouse server. Only SELECT statements are allowed for security reasons.",
        {
            query: z.string().describe("The SELECT query to execute. Only SELECT statements are allowed.")
        },
        async (params) => {
            try {
                const query = params.query.trim();

                // Sanitize query - ensure it's a SELECT statement
                if (!query.toUpperCase().startsWith('SELECT') &&
                    !query.toUpperCase().startsWith('SHOW') &&
                    !query.toUpperCase().startsWith('DESCRIBE')) {
                    return {
                        content: [{
                            type: "text",
                            text: "Error: Only SELECT, SHOW, and DESCRIBE queries are allowed for security reasons."
                        }],
                        isError: true
                    };
                }

                const result = await client.query({
                    query: query,
                    format: "JSON"
                });

                const data = await result.json();

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify(data, null, 2)
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: "text",
                        text: `Error executing query: ${error.message}`
                    }],
                    isError: true
                };
            }
        }
    )

    server.connect(new StdioServerTransport());

    console.log("ClickHouse MCP server started");

    return server;
}

// Call startServer if this module is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer();
}