import { IDatabase } from './database';
import { IStorage } from './storage';

export interface IDatabaseManager {
  loadDatabase(data: ArrayBuffer, password: string): IDatabase | undefined;
  saveDatabase(database: IDatabase): ArrayBuffer;
}

export interface IStorageManager {
  getStorages(): IStorage[];
}
