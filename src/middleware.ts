import express from 'express';

export function middlewareLogResponses(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    })
    next();
}