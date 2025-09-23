import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
    api: APIConfig;
    db: DBConfig;
}

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    jwt_secret: string;
};

type DBConfig = {
    dbURL: string;
    migrationConfig: MigrationConfig; 
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
        jwt_secret: envOrThrow("JWT_SECRET"),
    },
    db: {
        dbURL: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    }
};

export default config