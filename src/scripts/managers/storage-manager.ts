import { IStorage, IStorageManager } from '../core';
import { FileSystemStorage, LocalStorage, GoogleDriveStorage, TestStorage } from '../storage';

export class StorageManager implements IStorageManager {
  public getStorages(): IStorage[] {
    const storages: IStorage[] = [];

    if (FileSystemStorage.isAvailable())
      storages.push(new FileSystemStorage());
    else if (LocalStorage.isAvailable())
      storages.push(new LocalStorage());

    if (GoogleDriveStorage.isAvailable()) {
      storages.push(new GoogleDriveStorage({
        app_id: process.env.GOOGLE_API_APP_ID,
        client_id: process.env.GOOGLE_API_CLIENT_ID,
        developer_key: process.env.GOOGLE_API_DEVELOPER_KEY,
      }));
    }

    if (TestStorage.isAvailable())
      storages.push(new TestStorage());

    return storages;
  }
}
