import { db } from "../index.js";
import { asc } from 'drizzle-orm'
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning()
    return result;
}

export async function getAllChirps() {
    const result = await db.query.chirps.findMany({
        orderBy: [asc(chirps.createdAt)],
    });
    return result
}