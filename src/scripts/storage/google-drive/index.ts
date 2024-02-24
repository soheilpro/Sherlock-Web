import axios from 'axios';
import { IFile, IStorage } from '../types';

export class GoogleDriveStorage extends EventTarget implements IStorage {
  public id = 'google-drive';
  public name = 'Google Drive';
  public is_slow = true;
  public is_initialized = false;

  public init(): Promise<void> {
    if (this.is_initialized)
      return Promise.resolve();

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
          this.dispatchEvent(new Event('initialized'));

          return resolve();
        });
      });

      document.body.appendChild(script_element);
    });
  }

  public async getFiles(): Promise<IFile[]> {
    // Must be called in response to user events
    if (!gapi.auth2.getAuthInstance().isSignedIn.get())
      await gapi.auth2.getAuthInstance().signIn();

    const response = await gapi.client.drive.files.list({
      'q': 'fileExtension=\'sdb\'',
    });

    return response.result.files!.map(googleDriveFile => ({
      name: googleDriveFile.name!,
      metadata: googleDriveFile,
    }));
  }

  public async getFileData(file: IFile): Promise<ArrayBuffer> {
    const oauth_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

    const response = await axios.request({
      baseURL: 'https://www.googleapis.com/drive/v3/files/',
      url: file.metadata.id,
      params: {
        'alt': 'media',
      },
      headers: {
        'Authorization': `Bearer ${ oauth_token }`,
      },
      responseType: 'arraybuffer',
    });

    return response.data;
  }
}
