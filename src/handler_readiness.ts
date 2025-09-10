import express from 'express'

export function handlerReadiness(req: express.Request, res: express.Response) {
    res.set('Content-Type', "text/plain; charset=utf-8");
    res.send("OK");
}