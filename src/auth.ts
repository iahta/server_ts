import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "./error_handler.js";
import express from 'express';
import { NewRefreshToken } from "./db/schema.js";
import { randomBytes } from "crypto";


export async function hashPassword(password: string): Promise<string> {
    const hashed = bcrypt.hash(password, 10)
    return hashed
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issueDate = Math.floor(Date.now() / 1000);
    const userPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: issueDate,
        exp: issueDate + expiresIn,
    };
    const auth = jwt.sign(userPayload, secret)
    return auth
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as payload;
        if (!decoded || typeof decoded.sub !== 'string') {
            throw new UnauthorizedError("Invalid token payload");
        }
        return decoded.sub
    } catch(err) {
        throw new UnauthorizedError("Unable to authenticate");
    }
}

export function getBearerToken(req: express.Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorizedError("Request not allowed");
    }

    const prefix = "Bearer ";
    if (!authHeader.startsWith(prefix)) {
        throw new UnauthorizedError("Invalid Authorization format");
    }

    const token = authHeader.slice(prefix.length).trim();

    if (!token) {
        throw new UnauthorizedError("Missing token");
    }

    return token;
}

export function makeRefreshToken() {
    return randomBytes(32).toString("hex");
}