import { ChildProcess } from "child_process";
import { error } from "console";
import express from "express";

export async function handlerValidate(req: express.Request, res: express.Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        let statusCode = 200;
        let respBody = {};

        try {
            const parsedBody = JSON.parse(body);

            if (!parsedBody.body) {
                statusCode = 400;
                respBody = {
                    error: "Something went wrong"
                };
            } else if (parsedBody.body.length > 140) {
                statusCode = 400;
                respBody = {
                    error: "Chirp is too long"
                };
            } else {
                respBody = {
                    valid: true
                };
            }
        } catch (error) {
            statusCode = 400;
            respBody = {
                error: "Something went wrong"
            }
        }
        res.header("Content-Type", "application/json");
        res.status(statusCode).send(JSON.stringify(respBody))
    });

    res.on("error", (err) => {
        res.status(500).json({
            error: "Server error"
        });
    })
}