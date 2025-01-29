import type { UserInToken } from "@/@types";
import { env } from "@/lib/config";
import { handleError } from "@/lib/utils/error-handle";
import { getPKCS8PrivateKey } from "@/lib/utils/keypair";
import { compare, genSalt, hash } from "bcryptjs";
import { SignJWT, importPKCS8, jwtVerify } from "jose";

const algorithm = "RS256";

export const hashUserPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(env.SALT_FACTOR);
  return await hash(password, salt);
};

export const compareUserPassword = async (password: string, hash: string): Promise<boolean> => {
  return await compare(password, hash);
};

export const generateToken = async (payload: UserInToken): Promise<string | null> => {
  try {
    const pkcs8 = await getPKCS8PrivateKey();
    const pk = await importPKCS8(pkcs8 as string, algorithm);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: algorithm, publicKey: true })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .sign(pk);
  } catch (e) {
    return handleError(e);
  }
};

export const verifyToken = async (token: string): Promise<UserInToken | null> => {
  try {
    const pkcs8 = await getPKCS8PrivateKey();
    const pk = await importPKCS8(pkcs8, algorithm);
    return (await jwtVerify(token, pk)) as unknown as UserInToken;
  } catch (e) {
    return null;
  }
};
