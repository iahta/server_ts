import express from "express";
import { createUser, getUserByEmail, getUserByID, isChirpyRed, updateUser } from "./db/queries/users.js"
import { NewRefreshToken, NewUser } from "./db/schema.js"
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error_handler.js";
import { hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js";
import { revokeRefreshToken, saveRefreshToken, userForRefreshToken } from "./db/queries/refresh_tokens.js";

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
        isChirpyRed: user.is_chirpy_red
    });
}

type LoginResponse = UserResponse & {
    token: string,
    refreshToken: string;
};

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

    const matching = await checkPasswordHash(params.password, user.hashed_password)
    if (!matching) {
        throw new UnauthorizedError ("Incorrect email or password")
    }
    
    const access_token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = await makeRefreshToken();
    const saved = await saveRefreshToken(user.id, refreshToken);
    if (!saved) {
        throw new UnauthorizedError("couldn't save refresh token");
    }

    return res.status(200).json({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.is_chirpy_red,
        token: access_token,
        refreshToken: refreshToken,
    });
}

export async function handlerRefresh(req: express.Request, res: express.Response) {
    let refreshToken = getBearerToken(req);

    const result = await userForRefreshToken(refreshToken);
    if (!result) {
        throw new UnauthorizedError ("invalid refresh token")
    }

    const user = result.user;
    const accessToken = makeJWT(
        user.id,
        config.jwt.defaultDuration,
        config.jwt.secret,
    );

    type response = {
        token: string;
    }

    res.status(200).json({
        token: accessToken,
    } satisfies response);
}

export async function handlerRevoke(req: express.Request, res: express.Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
}

export async function handlerUpdateUserInfo(req: express.Request, res: express.Response) {
   type parameters = {
        email: string;
        password: string;
   }
   
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwt.secret);
    const params: parameters = req.body;
    const hashed_password = await hashPassword(params.password);

    const updatedUser = await updateUser(userID, params.email, hashed_password);

    return res.status(200).json({
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        isChirpyRed: updatedUser.is_chirpy_red
    });

}   

export async function handlerIsChirpyRed(req: express.Request, res: express.Response) {
    type parameters = {
        event: string;
        data: {
            userId: string
        }
    }

    const params: parameters = req.body;
    if (params.event !== "user.upgraded") {
        return res.status(204).send();
    }

    const user = getUserByID(params.data.userId);
    if (!user) {
        throw new NotFoundError("unable to locate user");
    }
    await isChirpyRed(params.data.userId);
    return res.status(204).send();
}