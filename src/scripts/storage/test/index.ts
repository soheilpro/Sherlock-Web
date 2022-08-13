import axios from 'axios';
import { IFile, IStorage } from '../types';

export class TestStorage extends EventTarget implements IStorage {
  public id = 'test';
  public name = 'Test';
  public is_slow = false;
  public is_initialized = true;

  public init(): Promise<void> {
    return Promise.resolve();
  }

  public getFiles(): Promise<IFile[]> {
    const files: IFile[] = [
      {
        name: 'test1.sdb',
      },
      {
        name: 'test2.sdb',
      },
    ];

    return Promise.resolve(files);
  }

  public async getFileData(file: IFile): Promise<ArrayBuffer> {
    const response = await axios.request({
      url: file.name,
      responseType: 'arraybuffer',
    });

    return response.data;
  }
}
