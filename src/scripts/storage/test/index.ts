import { IFile, IStorage, StorageEventType } from '../../core';
import { EventEmitter } from '../../util';

export class TestStorage extends EventEmitter<StorageEventType> implements IStorage {
  public id = 'test';
  public name = 'Test';
  public is_slow = false;
  public is_writable = true;
  public is_initialized = true;

  public static isAvailable(): boolean {
    return (process.env.NODE_ENV !== 'production');
  }

  public async init(): Promise<void> {
    return;
  }

  public async getFiles(): Promise<IFile[] | undefined> {
    const files: IFile[] = [
      {
        name: 'test1.sdb',
      },
    ];

    return files;
  }

  public async getFileData(file: IFile): Promise<ArrayBuffer> {
    const response = await fetch(file.name);

    return response.arrayBuffer();
  }

  public save(file: IFile, data: ArrayBuffer): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}
