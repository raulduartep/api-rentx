import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const tokenAlreadyExists = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!tokenAlreadyExists) {
      throw new AppError('Token invalid!');
    }

    const dateNow = this.dateProvider.dateNow();

    if (
      this.dateProvider.compareIfBefore(
        tokenAlreadyExists.expires_date,
        dateNow
      )
    ) {
      throw new AppError('Token expired!');
    }

    const user = await this.usersRepository.findById(
      tokenAlreadyExists.user_id
    );

    const hashPassword = await hash(password, 8);

    await this.usersRepository.update(user.id, { password: hashPassword });

    await this.usersTokensRepository.deleteById(tokenAlreadyExists.id);
  }
}

export { ResetPasswordUserUseCase };
