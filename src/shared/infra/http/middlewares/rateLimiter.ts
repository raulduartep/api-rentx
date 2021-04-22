import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { IRateLimiter } from '@shared/container/providers/RateLimiter/IRateLimiter';
import { AppError } from '@shared/errors/AppError';

export default async function rateLimiter(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const rateLimiter = container.resolve<IRateLimiter>('RateLimiter');

  try {
    await rateLimiter.verify(request.ip);

    return next();
  } catch (error) {
    console.log(error);
    throw new AppError('Too many requests', 429);
  }
}
