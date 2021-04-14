import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarUseCase } from './CreateCarUseCase';

class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      brand,
      category_id,
      daily_rate,
      license_plate,
      fine_amount,
    } = request.body;

    const createCarUseCase = container.resolve(CreateCarUseCase);

    const car = await createCarUseCase.execute({
      name,
      description,
      brand,
      category_id,
      daily_rate,
      license_plate,
      fine_amount,
    });

    return response.status(201).json(car);
  }
}

export { CreateCarController };
