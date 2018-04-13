import axios from 'axios';
import { IStorage } from '../istorage';
import { IFile } from '../ifile';

export class GoogleDriveStorage implements IStorage {
  id = 'google-drive';
  name = 'Google Drive';
  isInitialized = false;

  init(): Promise<void> {
    if (this.isInitialized)
      return Promise.resolve();

    return new Promise(resole => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://apis.google.com/js/api.js';
      scriptElement.addEventListener('load', () => {
        gapi.load('client:auth2', async () => {
          await gapi.client.init({
            apiKey: process.env.GOOGLE_API_DEVELOPER_KEY,
            clientId: process.env.GOOGLE_API_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.readonly',
          });

          this.isInitialized = true;

          return resole();
        });
      });

      document.body.appendChild(scriptElement);
    });
  }

  async getFiles(): Promise<IFile[]> {
    // Must be called in response to user events
    if (!gapi.auth2.getAuthInstance().isSignedIn.get())
      await gapi.auth2.getAuthInstance().signIn();

    const response = await gapi.client.drive.files.list({
      'q': 'fileExtension=\'sdb\'',
    });

    return response.result.files.map(googleDriveFile => {
      return {
        name: googleDriveFile.name,
        metadata: googleDriveFile,
      };
    });
  }

  async getFileData(file: IFile): Promise<ArrayBuffer> {
    const oauthToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

    const response = await axios.request({
      baseURL: 'https://www.googleapis.com/drive/v3/files/',
      url: file.metadata.id,
      params: {
        'alt': 'media',
      },
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
      },
      responseType: 'arraybuffer',
    });

    return response.data;
  }
}
