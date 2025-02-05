/* istanbul ignore */
export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ServerError extends Error {
  public code: string;
  public port: number;

  constructor(message: string, code: string, port: number) {
    super(message);
    this.name = "ServerError";
    this.code = code;
    this.port = port;
  }
}

export const handleError = (
  err: unknown | (unknown & { message?: string }),
) => {
  const withMessage = err as unknown & { message?: string };

  if (err instanceof ValidationError) {
    return err.message;
  }
  if (err instanceof JWTError) {
    return err.message;
  }
  return withMessage.message ? withMessage.message : "Something went wrong";
};
