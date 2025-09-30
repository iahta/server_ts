import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerReadiness } from "./handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerHits, handlerReset } from "./handler_hits.js";
import { errorHandler } from "./error_handler.js";
import { config } from "./config.js";
import { handlerCreateUser, handlerLogin, handlerRefresh, handlerRevoke, handlerUpdateUserInfo } from "./handler_users.js";
import { handlerAllChirps, handlerChirp, handlerDeleteChirp, handlerGetChirp } from "./handler_chirps.js";

const migrationClient = postgres(config.db.dbURL, { max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHits);
app.get("/api/chirps", handlerAllChirps);
app.get("/api/chirps/:chirpID", handlerGetChirp);
app.post("/admin/reset", handlerReset);
app.post("/api/chirps", handlerChirp);
app.post("/api/users", handlerCreateUser);
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefresh);
app.post("/api/revoke", handlerRevoke);
app.put("/api/users", handlerUpdateUserInfo);
app.delete("/api/chirps/:chirpID", handlerDeleteChirp);

app.use(errorHandler);
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
})