import express from 'express';
import config from './config.js';

export function middlewareLogResponses(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    })
    next();
}

export function middlewareMetricsInc(_: express.Request, __: express.Response, next: express.NextFunction) {
    config.fileserverHits++;
    next();
}