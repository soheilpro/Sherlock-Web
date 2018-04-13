import { IFile } from './ifile';

export interface IStorage {
  id: string;
  name: string;
  isInitialized: boolean;
  init(): Promise<void>;
  getFiles(): Promise<IFile[]>;
  getFileData(file: IFile): Promise<ArrayBuffer>;
}
