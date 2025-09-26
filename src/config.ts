import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
}

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
};

type DBConfig = {
    dbURL: string;
    migrationConfig: MigrationConfig; 
}

type JWTConfig = {
    defaultDuration: number;
    refreshDuration: number;
    secret: string;
    issuer: string;
}

process.loadEnvFile();

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
}

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    db: {
        dbURL: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        defaultDuration: 60 * 60,
        refreshDuration: 60 * 60 * 24 * 60 * 1000,
        secret: envOrThrow("JWT_SECRET"),
        issuer: "chirpy",
    }
};

export default config