import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import createConnection from '@shared/infra/typeorm';

import uploadConfig from '@config/upload';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import swaggerSetup from '../../../swagger.json';
import { errorTratment } from './middlewares/errorTratment';
import rateLimiter from './middlewares/rateLimiter';
import { router } from './routes/index.routes';

createConnection();
const app = express();

app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));
app.use('/uploads', express.static(`${uploadConfig.tmpFolder}`));

app.use(cors());
app.use(router);

app.use(Sentry.Handlers.errorHandler());

app.use(errorTratment);

export { app };
