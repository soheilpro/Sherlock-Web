import { IFile, IStorage, StorageEventType } from '../../core';
import { EventEmitter } from '../../util';

interface IGoogleDriveStorageFile extends IFile {
  handle: gapi.client.drive.File;
}

export class GoogleDriveStorage extends EventEmitter<StorageEventType> implements IStorage {
  public id = 'google-drive';
  public name = 'Google Drive';
  public is_slow = true;
  public is_writable = false;
  public is_initialized = false;

  public static isAvailable(): boolean {
    return true;
  }

  public async init(): Promise<void> {
    if (this.is_initialized)
      return;

    return new Promise(resolve => {
      const script_element = document.createElement('script');
      script_element.src = 'https://apis.google.com/js/api.js';
      script_element.addEventListener('load', () => {
        gapi.load('client:auth2', async () => {
          await gapi.client.init({
            apiKey: process.env.GOOGLE_API_DEVELOPER_KEY,
            clientId: process.env.GOOGLE_API_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.readonly',
          });

          this.is_initialized = true;
          this.emit('initialized');

          return resolve();
        });
      });

      document.body.appendChild(script_element);
    });
  }

  public async getFiles(): Promise<IFile[] | undefined> {
    // Must be called in response to user events
    if (!gapi.auth2.getAuthInstance().isSignedIn.get())
      await gapi.auth2.getAuthInstance().signIn();

    const response = await gapi.client.drive.files.list({
      'q': 'fileExtension=\'sdb\'',
    });

    return response.result.files!.map(googleDriveFile => ({
      name: googleDriveFile.name!,
      handle: googleDriveFile,
    }));
  }

  public async getFileData(file: IGoogleDriveStorageFile): Promise<ArrayBuffer> {
    const oauth_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${ file.handle.id }?alt=media`, {
      headers: {
        'Authorization': `Bearer ${ oauth_token }`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.arrayBuffer();
  }

  public save(file: IFile, data: ArrayBuffer): Promise<void> {
    throw new Error('Not supported.');
  }
}
