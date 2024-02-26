import { IFile, IStorage } from '../types';

export class TestStorage extends EventTarget implements IStorage {
  public id = 'test';
  public name = 'Test';
  public is_slow = false;
  public is_initialized = true;

  public async init(): Promise<void> {
    return;
  }

  public async getFiles(): Promise<IFile[]> {
    const files: IFile[] = [
      {
        name: 'test1.sdb',
      },
      {
        name: 'test2.sdb',
      },
    ];

    return files;
  }

  public async getFileData(file: IFile): Promise<ArrayBuffer> {
    const response = await fetch(file.name);

    return response.arrayBuffer();
  }
}
