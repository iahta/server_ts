import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";
import { UnauthorizedError } from "./error_handler.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;
  let authToken: string;
  let user = "userOne";
  let secret = "secret";

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
    authToken = await makeJWT(user, 100, secret);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const result = await checkPasswordHash("incorrectPassword", hash2);
    expect(result).toBe(false);
  })

  it("should return true for matching userID", async () => {
    const result = await validateJWT(authToken, secret);
    expect(result).toBe(user);
  })

  it("should return an error for invalid token", () => {
    expect(() => validateJWT("tokentoken", secret)).toThrow(UnauthorizedError);
  });


});

