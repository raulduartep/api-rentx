import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationRepository: ISpecificationsRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const specificationAçreadyExists = await this.specificationRepository.findByName(
      name
    );

    if (specificationAçreadyExists) {
      throw new AppError('Specification already exists!');
    }

    await this.specificationRepository.create({
      name,
      description,
    });
  }
}

export { CreateSpecificationUseCase };
