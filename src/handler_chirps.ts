import express from "express";
import { BadRequestError, NotFoundError } from "./error_handler.js";
import { NewChirp } from "./db/schema.js";
import { createChirp, getAllChirps, getChirp } from "./db/queries/chirps.js";

export async function handlerChirp(req: express.Request, res: express.Response) {
    type parameters = {
        body: string,
        userId: string,
    }

    const params: parameters = req.body;
    const cleanChirp = validateChirp(params.body)
    const chirp: NewChirp = {
        body: cleanChirp,
        user_id: params.userId,
    }

    const newChirp = await createChirp(chirp);
    return res.status(201).json({
        id: newChirp.id,
        createdAt: newChirp.createdAt,
        updatedAt: newChirp.updatedAt,
        body: newChirp.body,
        userId: newChirp.user_id
    });
}

function validateChirp(chirp: string): string {
    if (chirp.length > 140) {
        throw new BadRequestError ("Chirp is too long. Max length is 140");
    }
    let cleaned = cleanChirp(chirp);
    return cleaned
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

export async function handlerAllChirps(_: express.Request, res: express.Response) {
    const chirps = await getAllChirps();
    return res.status(200).json(chirps);
}

export async function handlerGetChirp(req: express.Request, res: express.Response) {
    const id = req.params.chirpID;
    if (id === "") {
        throw new BadRequestError ("Missing Chirp ID");
    }
    const chirp = await getChirp(id);
    if (!chirp) {
        throw new NotFoundError ("Chirp not found");
    }
    return res.status(200).json(chirp);
}