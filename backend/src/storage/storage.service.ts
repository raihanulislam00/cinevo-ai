import { Injectable } from '@nestjs/common';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
export interface IStorageService { upload(file: Buffer, path: string, contentType: string): Promise<string>; delete(path: string): Promise<void>; getUrl(path: string): Promise<string>; }
@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly root = process.env.STORAGE_LOCAL_PATH ?? './storage';
  async upload(file: Buffer, path: string, _contentType: string) { const target = join(this.root, path); await mkdir(dirname(target), { recursive: true }); await writeFile(target, file); return this.getUrl(path); }
  async delete(path: string) { try { await unlink(join(this.root, path)); } catch { /* missing files are already deleted */ } }
  async getUrl(path: string) { return `/storage/${path}`; }
}
