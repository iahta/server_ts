import express from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./error_handler.js";
import { NewChirp } from "./db/schema.js";
import { createChirp, deleteChirp, getAllChirps, getChirp, getChirpsByID } from "./db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js"

export async function handlerChirp(req: express.Request, res: express.Response) {
    type parameters = {
        body: string,
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);

    const params: parameters = req.body;
    const cleanChirp = validateChirp(params.body)
    const chirp: NewChirp = {
        body: cleanChirp,
        user_id: userId,
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

export async function handlerAllChirps(req: express.Request, res: express.Response) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    if (authorId !== "") {
        const chirps = await getChirpsByID(authorId);
        return res.status(200).json(chirps);
    }
    
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

export async function handlerDeleteChirp(req: express.Request, res: express.Response) {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwt.secret);
    
    const id = req.params.chirpID;
    if (id === "") {
        throw new BadRequestError("Missing Chirp ID");
    }
    const chirp = await getChirp(id);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    if (chirp.user_id !== userID) {
        throw new ForbiddenError("Forbidden Request");
    }

    await deleteChirp(id);
    return res.status(204).send();
}