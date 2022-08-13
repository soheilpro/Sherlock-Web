export interface IFile {
  name: string;
  metadata?: any;
}

export interface IStorage extends EventTarget {
  id: string;
  name: string;
  is_slow: boolean;
  is_initialized: boolean;
  init(): Promise<void>;
  getFiles(): Promise<IFile[]>;
  getFileData(file: IFile): Promise<ArrayBuffer>;
}
