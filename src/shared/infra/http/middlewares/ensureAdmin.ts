import { NextFunction, Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';

export async function ensureAdmin(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(id);

  if (!user.is_admin) {
    throw new AppError('User is not admin!');
  }

  return next();
}
