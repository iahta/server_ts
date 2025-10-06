import { db } from "../index.js";
import { asc, eq, desc } from 'drizzle-orm'
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning()
    return result;
}

export async function getAllChirps(sort: string) {
    if (sort === "desc") {
        const result = await db.query.chirps.findMany({
            orderBy: [desc(chirps.createdAt)],
        });
        return result;
    }
    const result = await db.query.chirps.findMany({
        orderBy: [asc(chirps.createdAt)],
    });
    return result
}

export async function getChirpsByID(id: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.user_id, id))
    return result
}

export async function getChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result
}

export async function deleteChirp(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id)); 
}