import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import createConnection from '@shared/infra/typeorm';

import uploadConfig from '@config/upload';

import swaggerSetup from '../../../swagger.json';
import { errorTratment } from './middlewares/errorTratment';
import { router } from './routes/index.routes';

createConnection();
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));
app.use('/uploads', express.static(`${uploadConfig.tmpFolder}`));

app.use(cors());
app.use(router);

app.use(errorTratment);

export { app };
