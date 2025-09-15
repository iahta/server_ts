import express from "express";
import { BadRequestError } from "./error_handler.js";

export async function handlerValidate(req: express.Request, res: express.Response) {
    type parameters = {
        body: string;
    }
    
    const params: parameters = req.body;

    if (params.body.length > 140) {
        throw new BadRequestError ("Chirp is too long. Max length is 140");
    }
    let cleaned = cleanChirp(params.body);
    return res.status(200).json({
        cleanedBody: cleaned
    });
}

function cleanChirp(chirp: string): string {
    const profanity = ["kerfuffle", "sharbert", "fornax"];

    let split = chirp.split(" ")
    for (let i = 0; i < split.length; i++) {
        if (profanity.includes(split[i].toLowerCase())) {
            split[i] = "****";
        };
    }
    return split.join(" ")
}