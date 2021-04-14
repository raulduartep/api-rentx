import { AppError } from '@shared/errors/AppError';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('Should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      brand: 'Brand',
      category_id: 'category',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
    });

    expect(car).toHaveProperty('id');
  });

  it('Should not be able to create a car with existing license plate', async () => {
    await createCarUseCase.execute({
      name: 'Name Car 1',
      description: 'Description Car 1',
      brand: 'Brand',
      category_id: 'category 1 ',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
    });

    await expect(
      createCarUseCase.execute({
        name: 'Name Car 2',
        description: 'Description Car 2',
        brand: 'Brand',
        category_id: 'category',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
      })
    ).rejects.toEqual(new AppError('Car already exists'));
  });

  it('Should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car Available',
      description: 'Description Car 1',
      brand: 'Brand',
      category_id: 'category 1 ',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
    });

    expect(car.available).toBe(true);
  });
});
