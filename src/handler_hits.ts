import { config } from "./config.js";
import express from 'express';
import { ForbiddenError } from "./error_handler.js";
import { deleteAllUsers } from "./db/queries/users.js";

export function handlerHits(req: express.Request, res: express.Response) {
    res.set('Content-Type', "text/html; charset=utf-8");
    res.send(`<html>
                <body>
                    <h1>Welcome, Chirpy Admin</h1>
                    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
                </body>
            </html>`);
    
}

export function handlerReset(req: express.Request, res: express.Response) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError ("Forbidden");
    }
    config.api.fileserverHits = 0;
    deleteAllUsers();
    res.write("Hits reset to 0");
    res.write
    res.end();
}