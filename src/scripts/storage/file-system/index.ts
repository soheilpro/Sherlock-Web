import { IFile, IStorage, StorageEventType } from '../../core';
import { EventEmitter } from '../../util';

declare global {
  interface Window {
    showOpenFilePicker: (options?: any) => Promise<FileSystemFileHandle[]>;
  }
}

interface IFileSystemStorageFile extends IFile {
  handle: FileSystemFileHandle;
}

export class FileSystemStorage extends EventEmitter<StorageEventType> implements IStorage {
  public id = 'file-system';
  public name = 'File System';
  public is_slow = false;
  public is_writable = true;
  public is_initialized = true;

  public static isAvailable(): boolean {
    return ('showOpenFilePicker' in window);
  }

  public async init(): Promise<void> {
    return;
  }

  public async getFiles(): Promise<IFile[] | undefined> {
    try {
      const [ file_system_file ] = await window.showOpenFilePicker({
        id: 'sherlock',
        types: [
          {
            description: 'Sherlock Files',
            accept: {
              'text/plain': [ '.sdb' ],
            },
          },
        ],
      });

      const file: IFileSystemStorageFile = {
        name: file_system_file.name,
        handle: file_system_file,
      };

      return [ file ];
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError')
        return undefined;

      throw error;
    }
  }

  public async getFileData(file: IFileSystemStorageFile): Promise<ArrayBuffer> {
    return (await file.handle.getFile()).arrayBuffer();
  }

  public async save(file: IFileSystemStorageFile, data: ArrayBuffer): Promise<void> {
    const stream = await file.handle.createWritable();
    await stream.write(data);
    await stream.close();
  }
}
