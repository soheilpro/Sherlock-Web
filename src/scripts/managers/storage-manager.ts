import { IStorage, IStorageManager } from '../core';
import { FileSystemStorage, LocalStorage, GoogleDriveStorage, TestStorage } from '../storage';

export class StorageManager implements IStorageManager {
  public getStorages(): IStorage[] {
    const storages: IStorage[] = [];

    if (FileSystemStorage.isAvailable())
      storages.push(new FileSystemStorage());
    else if (LocalStorage.isAvailable())
      storages.push(new LocalStorage());

    if (GoogleDriveStorage.isAvailable())
      storages.push(new GoogleDriveStorage());

    if (TestStorage.isAvailable())
      storages.push(new TestStorage());

    return storages;
  }
}
