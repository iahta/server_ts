import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from 'drizzle-orm'

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
    await db.delete(users)
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result
}

export async function getUserByID(userID: string) {
    const [result] = await db.select().from(users).where(eq(users.id, userID));
    return result;
}

export async function updateUser(userID: string, email: string, password: string) {
    const [result] = await db
        .update(users)
        .set({email: email, 
            hashed_password: password})
        .where(eq(users.id, userID))
        .returning();
    return result
}

export async function isChirpyRed(userID: string) {
    await db
    .update(users)
    .set({is_chirpy_red: true})
    .where(eq(users.id, userID));
}
