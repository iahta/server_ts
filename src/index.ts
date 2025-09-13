import express from "express";
import { handlerReadiness } from "./handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerHits, handlerReset } from "./handler_hits.js";
import { handlerValidate } from "./handler_validate.js";

const app = express();
const PORT = 8080

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json());
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidate);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})