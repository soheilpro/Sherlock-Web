import { IStorage } from '../istorage';
import { IFile } from '../ifile';

export class LocalStorage implements IStorage {
  id = 'local';
  name = 'Local';
  isInitialized = true;

  init(): Promise<void> {
    return Promise.resolve();
  }

  getFiles(): Promise<IFile[]> {
    return new Promise(resolve => {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = '.sdb';
      inputElement.style.display = 'none';
      inputElement.addEventListener('change', () => {
        const localFiles = [].map.call(inputElement.files, (e: File) => e) as File[];

        const files = localFiles.map(localFile => {
          return {
            name: localFile.name,
            metadata: localFile,
          };
        });

        document.body.removeChild(inputElement);

        return resolve(files);
      });

      document.body.appendChild(inputElement);
      inputElement.click();
    });
  }

  getFileData(file: IFile): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', (event: any) => {
        return resolve(event.target.result);
      });

      fileReader.readAsArrayBuffer(file.metadata);
    });
  }
}
