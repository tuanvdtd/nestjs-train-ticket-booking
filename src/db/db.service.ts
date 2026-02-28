import { Inject, Injectable } from '@nestjs/common';
import { writeFile, access, readFile } from 'fs/promises';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: { path: string };
  async write(obj: Record<string, any>) {
    console.log(`Writing to ${this.options.path}:`, obj);
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf-8',
    });
  }

  async read<T>(): Promise<T> {
    const filePath = this.options.path;

    try {
      await access(filePath);
    } catch {
      await writeFile(filePath, '[]');
    }

    const data = await readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(data) as T;
  }
}
