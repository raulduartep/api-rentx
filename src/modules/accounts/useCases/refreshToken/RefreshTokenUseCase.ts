import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

interface IRequest {
  token: string;
}
interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ token }: IRequest): Promise<ITokenResponse> {
    const { email, sub: userId } = verify(
      token,
      auth.secretRefreshToken
    ) as IPayload;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token
    );

    if (!userToken) {
      throw new AppError('Refresh Token does not exists');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshTokenExpireIn = this.dateProvider.addDays(
      auth.expiresInRefreshTokenInDays
    );

    const refreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: userId,
      expiresIn: auth.expiresInRefreshToken,
    });

    await this.usersTokensRepository.create({
      expires_date: refreshTokenExpireIn,
      refresh_token: refreshToken,
      user_id: userId,
    });

    const accessToken = sign({}, auth.secretToken, {
      subject: userId,
      expiresIn: auth.expiresInToken,
    });

    return {
      refresh_token: refreshToken,
      token: accessToken,
    };
  }
}

export { RefreshTokenUseCase };
