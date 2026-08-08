import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export interface TokenPayload {
  userId: string;
  role: string;
}

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return new TextEncoder().encode(secret);
};

// ==============================
// Password Hashing
// ==============================

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

// ==============================
// Generate JWT
// ==============================

export async function generateToken(
  userId: string,
  role: string
): Promise<string> {
  return await new SignJWT({
    userId,
    role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

// ==============================
// Verify JWT
// ==============================

export async function verifyToken(
  token: string
): Promise<TokenPayload> {
  try {
    console.log("========== JWT VERIFY ==========");
    console.log("JWT_SECRET Exists:", !!process.env.JWT_SECRET);
    console.log("Received Token:", token);

    const { payload } = await jwtVerify(
      token,
      getJwtSecretKey()
    );

    console.log("Decoded Payload:", payload);

    const userId = payload.userId;
    const role = payload.role;

    if (typeof userId !== "string") {
      throw new Error("Invalid token payload: userId missing");
    }

    if (typeof role !== "string") {
      throw new Error("Invalid token payload: role missing");
    }

    console.log("JWT Verified Successfully");
    console.log("===============================");

    return {
      userId,
      role,
    };
  } catch (error) {
    console.error("========== JWT ERROR ==========");
    console.error(error);
    console.error("===============================");

    throw error;
  }
}
