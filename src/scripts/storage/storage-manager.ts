import { GoogleDriveStorage } from './google-drive';
import { LocalStorage } from './local';
import { TestStorage } from './test';
import { IStorage } from './types';

export class StorageManager {
  public static getStorages(): IStorage[] {
    const storages = [
      new LocalStorage(),
      new GoogleDriveStorage(),
    ];

    if (process.env.NODE_ENV !== 'production')
      storages.unshift(new TestStorage());

    return storages;
  }
}
