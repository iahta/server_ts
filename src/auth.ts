import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const hashed = bcrypt.hash(password, 10)
    return hashed
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}