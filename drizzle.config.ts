import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "src/db/schema.ts",
    out: "src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://loganharrison:@localhost:5432/chirpy?sslmode=disable",
    },
});