import express from "express";
import { createUser } from "./db/queries/users.js"
import { NewUser } from "./db/schema.js"
import { BadRequestError } from "./error_handler.js";

export async function handlerCreateUser(req: express.Request, res: express.Response) {
    type parameters = {
        email: string;
    }
    
    const params: parameters = req.body;

    if (params.email) {
        const user: NewUser = {
            email: params.email
        }

        const newUser = await createUser(user);
        return res.status(201).json({
            id: newUser.id,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            email: newUser.email
        });
    } else {
        throw new BadRequestError ("Missing or invalid email address");
    }
}