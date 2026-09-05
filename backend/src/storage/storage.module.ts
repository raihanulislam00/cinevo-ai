import { Global, Module } from '@nestjs/common';
import { LocalStorageService } from './storage.service.js';
import { S3StorageService } from './s3-storage.service.js';
export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
@Global()
@Module({ providers: [{ provide: STORAGE_SERVICE, useFactory: () => process.env.STORAGE_PROVIDER === 's3' ? new S3StorageService() : new LocalStorageService() }], exports: [STORAGE_SERVICE] })
export class StorageModule {}
