import * as fs from "node:fs/promises";
import { env } from "@/lib/config";
import { JWTError } from "@/lib/utils/error-handle";

export const getPKCS8PrivateKey = async () => {
  try {
    return await fs.readFile(env.PRIVATE_KEY_PATH, "utf8");
  } catch {
    throw new JWTError("Error reading private key");
  }
};
