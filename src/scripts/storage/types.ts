import { IEventEmitter } from '../event-emitter';

export interface IFile {
  name: string;
}

export type StorageEventType = 'initialized';

export interface IStorage extends IEventEmitter<StorageEventType> {
  id: string;
  name: string;
  is_slow: boolean;
  is_initialized: boolean;
  init(): Promise<void>;
  getFiles(): Promise<IFile[]>;
  getFileData(file: IFile): Promise<ArrayBuffer>;
}
