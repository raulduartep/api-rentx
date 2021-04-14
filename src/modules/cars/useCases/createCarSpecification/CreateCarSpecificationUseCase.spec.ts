import { AppError } from '@shared/errors/AppError';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationRepositoryInMemory = new SpecificationRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationRepositoryInMemory
    );
  });

  it('Should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Name Car',
      description: 'Description Car',
      brand: 'Brand',
      category_id: 'category',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
    });

    const specification = await specificationRepositoryInMemory.create({
      description: 'Test',
      name: 'Test',
    });

    const specifications_id = [specification.id];

    const specificationsCar = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCar).toHaveProperty('specifications');
    expect(specificationsCar.specifications).toHaveLength(1);
  });

  it('Should not be able to add a new specification to an nonexistent car', async () => {
    await expect(
      createCarSpecificationUseCase.execute({
        car_id: '1234',
        specifications_id: ['54321'],
      })
    ).rejects.toEqual(new AppError('Car does not exists'));
  });
});
