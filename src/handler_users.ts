import express from "express";
import { createUser, getUserByEmail } from "./db/queries/users.js"
import { NewUser } from "./db/schema.js"
import { BadRequestError, UnauthorizedError } from "./error_handler.js";
import { hashPassword, checkPasswordHash } from "./auth.js";

export type UserResponse = Omit<NewUser, "hashed_password">

export async function handlerCreateUser(req: express.Request, res: express.Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;
    if (!params.password || !params.email) {
        throw new BadRequestError ("Missing required fields")
    }
    const hashedPassword = await hashPassword(params.password)

    const user = await createUser({
        email: params.email,
        hashed_password: hashedPassword,
    } satisfies NewUser);

    if (!user) {
        throw new Error ("Could not create user");
    }
    return res.status(201).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}

export async function handlerLogin(req: express.Request, res: express.Response) {
    type parameters = {
        email: string;
        password: string;
    }
    
    const params: parameters = req.body;

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new BadRequestError ("Unable to find user")
    }
    const login = await checkPasswordHash(params.password, user.hashed_password)
    if (!login) {
        throw new UnauthorizedError ("Incorrect email or password")
    }
    
    return res.status(200).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}