import { db } from "../index.js";
import { asc, eq } from 'drizzle-orm'
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

export async function getChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result
}

export async function deleteChirp(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id)); 
}