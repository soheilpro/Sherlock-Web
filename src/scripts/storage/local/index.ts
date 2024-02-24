import { IFile, IStorage, StorageEventType } from '../../core';
import { EventEmitter } from '../../util';

interface ILocalStorageFile extends IFile {
  handle: File;
}

export class LocalStorage extends EventEmitter<StorageEventType> implements IStorage {
  public id = 'local';
  public name = 'Local';
  public is_slow = false;
  public is_writable = false;
  public is_initialized = true;

  public static isAvailable(): boolean {
    return true;
  }

  public async init(): Promise<void> {
    return;
  }

  public getFiles(): Promise<IFile[] | undefined> {
    return new Promise(resolve => {
      const input_element = document.createElement('input');
      input_element.type = 'file';
      input_element.accept = '.sdb';
      input_element.style.display = 'none';
      input_element.addEventListener('change', () => {
        const local_files = [].map.call(input_element.files, (e: File) => e) as File[];

        const files = local_files.map(localFile => ({
          name: localFile.name,
          handle: localFile,
        }));

        document.body.removeChild(input_element);

        return resolve(files);
      });

      document.body.appendChild(input_element);
      input_element.click();
    });
  }

  public getFileData(file: ILocalStorageFile): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      const file_reader = new FileReader();

      file_reader.addEventListener('load', (event: any) => resolve(event.target.result));

      file_reader.readAsArrayBuffer(file.handle);
    });
  }

  public save(file: IFile, data: ArrayBuffer): Promise<void> {
    throw new Error('Not supported.');
  }
}
