import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Required environment variables schema
const requiredEnvSchema = z.object({
    CLICKHOUSE_HOST: z.string().min(1),
    CLICKHOUSE_USER: z.string().min(1),
    CLICKHOUSE_PASSWORD: z.string().min(1),
});

// Optional environment variables schema with defaults
const optionalEnvSchema = z.object({
    CLICKHOUSE_PORT: z.string().transform(Number).optional(),
    CLICKHOUSE_SECURE: z.string().transform(val => val.toLowerCase() === 'true').default('true'),
    CLICKHOUSE_VERIFY: z.string().transform(val => val.toLowerCase() === 'true').default('true'),
    CLICKHOUSE_CONNECT_TIMEOUT_SEC: z.string().transform(Number).default('10'),
    CLICKHOUSE_SEND_RECEIVE_TIMEOUT_SEC: z.string().transform(Number).default('60'),
    CLICKHOUSE_DATABASE: z.string().optional(),
    CLICKHOUSE_CERT_PATH: z.string().optional(),
});

// Parse and validate environment variables
const validateEnv = () => {
    // First validate required variables
    const required = requiredEnvSchema.safeParse(process.env);
    if (!required.success) {
        const missingVars = Object.keys(required.error.format())
            .filter(key => key !== '_errors')
            .join(', ');

        throw new Error(`Missing required environment variables: ${missingVars}`);
    }

    // Then validate optional variables
    const optional = optionalEnvSchema.safeParse(process.env);
    if (!optional.success) {
        console.warn('Warning: Some optional environment variables are invalid. Using defaults instead.');
    }

    return {
        ...required.success ? required.data : {},
        ...optional.success ? optional.data : optionalEnvSchema.parse({}),
    };
};

// Exported configuration
export const env = validateEnv();

// Helper to load certificate if path is provided
export const loadCertificate = (): Buffer | undefined => {
    if (env.CLICKHOUSE_CERT_PATH) {
        try {
            return fs.readFileSync(env.CLICKHOUSE_CERT_PATH);
        } catch (error) {
            console.error(`Failed to load certificate from ${env.CLICKHOUSE_CERT_PATH}:`, error);
            throw new Error(`Failed to load certificate from ${env.CLICKHOUSE_CERT_PATH}`);
        }
    }
    return undefined;
}; 