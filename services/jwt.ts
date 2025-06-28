import * as djwt from "@zaubrik/djwt";
import { GetVar } from "../utils/getVar.ts";
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@^6.0.11";

const SecretApiKey = GetVar("SECRET_API_KEY") as string;

const encoder = new TextEncoder();

const secret = encoder.encode(SecretApiKey);

export async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  return jwt;
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload; // Explicit type assertion for safety
  } catch (error) {
    // Handle specific JWT errors with clear messages
    if (error instanceof Error) {
      switch (error.name) {
        case "jwt expired":
          throw new Error("jwt expired. Please log in again.");
        case "jwt invalid":
          throw new Error("Invalid jwt. Token is malformed or tampered with.");
        default:
          throw new Error(`jwt verification failed: ${error.message}`);
      }
    }
    // Fallback for non-Error objects (rare)
    throw new Error("Unknown error during jwt verification.");
  }
}
