import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarUseCase } from './ListAvailableCarUseCase';

let listAvailableCarsUseCase: ListAvailableCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarUseCase(
      carsRepositoryInMemory
    );
  });

  it('Should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Carro desription',
      brand: 'Car brand',
      category_id: 'category_id',
      daily_rate: 110.0,
      license_plate: 'ABC-1245',
      fine_amount: 40,
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Carro desription',
      brand: 'Car Brand Test',
      category_id: 'category_id',
      daily_rate: 110.0,
      license_plate: 'ABC-1245',
      fine_amount: 40,
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car Brand Test',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Carro desription',
      brand: 'Car Brand Test',
      category_id: 'category_id',
      daily_rate: 110.0,
      license_plate: 'ABC-1245',
      fine_amount: 40,
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car3',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Carro desription',
      brand: 'Car Brand Test',
      category_id: '123',
      daily_rate: 110.0,
      license_plate: 'ABC-1245',
      fine_amount: 40,
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '123',
    });

    expect(cars).toEqual([car]);
  });
});
