import { IFile, IStorage } from '../types';

export class LocalStorage extends EventTarget implements IStorage {
  public id = 'local';
  public name = 'Local';
  public is_slow = false;
  public is_initialized = true;

  public async init(): Promise<void> {
    return;
  }

  public getFiles(): Promise<IFile[]> {
    return new Promise(resolve => {
      const input_element = document.createElement('input');
      input_element.type = 'file';
      input_element.accept = '.sdb';
      input_element.style.display = 'none';
      input_element.addEventListener('change', () => {
        const local_files = [].map.call(input_element.files, (e: File) => e) as File[];

        const files = local_files.map(localFile => ({
          name: localFile.name,
          metadata: localFile,
        }));

        document.body.removeChild(input_element);

        return resolve(files);
      });

      document.body.appendChild(input_element);
      input_element.click();
    });
  }

  public getFileData(file: IFile): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      const file_reader = new FileReader();

      file_reader.addEventListener('load', (event: any) => resolve(event.target.result));

      file_reader.readAsArrayBuffer(file.metadata);
    });
  }
}
