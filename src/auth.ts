import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { UnauthorizedError } from "./error_handler";


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