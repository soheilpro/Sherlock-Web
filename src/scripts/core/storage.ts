import { IEventEmitter } from '../util';

export interface IFile {
  name: string;
}

export type StorageEventType = 'initialized';

export interface IStorage extends IEventEmitter<StorageEventType> {
  id: string;
  name: string;
  is_slow: boolean;
  is_writable: boolean;
  is_initialized: boolean;
  init(): Promise<void>;
  getFiles(): Promise<IFile[] | undefined>;
  getFileData(file: IFile): Promise<ArrayBuffer>;
  save(file: IFile, data: ArrayBuffer): Promise<void>;
}
