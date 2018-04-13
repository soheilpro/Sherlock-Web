import axios from 'axios';
import { IStorage } from '../istorage';
import { IFile } from '../ifile';

export class TestStorage implements IStorage {
  id = 'test';
  name = 'Test';
  isInitialized = true;

  init(): Promise<void> {
    return Promise.resolve();
  }

  getFiles(): Promise<IFile[]> {
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

  async getFileData(file: IFile): Promise<ArrayBuffer> {
    const response = await axios.request({
      url: file.name,
      responseType: 'arraybuffer',
    });

    return response.data;
  }
}
