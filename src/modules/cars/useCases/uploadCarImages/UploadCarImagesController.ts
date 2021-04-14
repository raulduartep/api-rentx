import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

class UploadCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const files = request.files as Express.Multer.File[];

    const uploadCarsImagesUseCase = container.resolve(UploadCarImagesUseCase);

    const filenames = files.map(image => image.filename);

    await uploadCarsImagesUseCase.execute({
      car_id: id,
      images_name: filenames,
    });

    return response.status(201).send();
  }
}

export { UploadCarImageController };
