import express from "express";
import { handlerReadiness } from "./handler_readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerHits, handlerReset } from "./handler_hits.js";

const app = express();
const PORT = 8080

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHits);
app.get("/admin/reset", handlerReset);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})