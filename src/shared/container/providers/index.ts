import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayJsDateProvider } from './DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import { SESMailProvider } from './MailProvider/implementations/SESMailProvider';
import { RateLimiterFlexible } from './RateLimiter/implementations/RateLimiterFlexible';
import { IRateLimiter } from './RateLimiter/IRateLimiter';
import { LocalStorageProvider } from './StorageProvider/implementations/LocalStorageProvider';
import { S3StorageProvider } from './StorageProvider/implementations/S3StorageProvider';
import { IStorageProvider } from './StorageProvider/IStorageProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);

const typeMail = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  typeMail[process.env.MAIL_PROVIDER]
);

const typeStorage = {
  local: container.resolve(LocalStorageProvider),
  s3: container.resolve(S3StorageProvider),
};

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  typeStorage[process.env.disk]
);

container.registerSingleton<IRateLimiter>('RateLimiter', RateLimiterFlexible);
