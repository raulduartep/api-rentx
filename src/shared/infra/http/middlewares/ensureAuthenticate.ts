import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '@shared/errors/AppError';

import auth from '@config/auth';

interface IPayloadToken {
  sub: string;
}

export async function ensureAuthenticate(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, auth.secretToken) as IPayloadToken;

    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
