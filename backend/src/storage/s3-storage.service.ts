import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.service.js';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly bucket = process.env.S3_BUCKET ?? '';
  private readonly client = new S3Client({ region: process.env.S3_REGION ?? 'us-east-1', endpoint: process.env.S3_ENDPOINT || undefined, forcePathStyle: Boolean(process.env.S3_ENDPOINT), credentials: process.env.S3_ACCESS_KEY ? { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY ?? '' } : undefined });
  async upload(file: Buffer, path: string, contentType: string) { await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: path, Body: file, ContentType: contentType })); return this.getUrl(path); }
  async delete(path: string) { await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: path })); }
  async getUrl(path: string) { return `${process.env.S3_PUBLIC_URL ?? process.env.S3_ENDPOINT ?? ''}/${this.bucket}/${path}`; }
}