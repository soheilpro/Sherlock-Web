import { IFile, IStorage, StorageEventType } from '../../core';
import { EventEmitter } from '../../util';

interface IGoogleDriveStorageFile extends IFile {
  handle: gapi.client.drive.File;
}

interface IGoogleDriveStorageConfig {
  app_id: string;
  client_id: string;
  developer_key: string;
}

export class GoogleDriveStorage extends EventEmitter<StorageEventType> implements IStorage {
  public id = 'google-drive';
  public name = 'Google Drive';
  public is_slow = true;
  public is_writable = true;
  public is_initialized = false;
  private config: IGoogleDriveStorageConfig;
  private access_token: string | undefined = undefined;

  public static isAvailable(): boolean {
    return true;
  }

  public constructor(config: IGoogleDriveStorageConfig) {
    super();

    this.config = config;
  }

  public async init(): Promise<void> {
    if (this.is_initialized)
      return;

    await Promise.all([
      this.initScript1(),
      this.initScript2(),
    ]);

    this.is_initialized = true;

    this.emit('initialized');
  }

  private initScript1(): Promise<void> {
    return new Promise(resolve => {
      const element = document.createElement('script');
      element.src = 'https://apis.google.com/js/api.js';
      element.addEventListener('load', () => {
        gapi.load('picker', () => resolve());
      });

      document.body.appendChild(element);
    });
  }

  private initScript2(): Promise<void> {
    return new Promise(resolve => {
      const element = document.createElement('script');
      element.src = 'https://accounts.google.com/gsi/client';
      element.addEventListener('load', () => resolve());

      document.body.appendChild(element);
    });
  }

  public getFiles(): Promise<IFile[] | undefined> {
    return new Promise(resolve => {
      const token_client = google.accounts.oauth2.initTokenClient({
        client_id: this.config.client_id,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: response => {
          if (response.error !== undefined)
            throw new Error(response.error);

          this.access_token = response.access_token;

          const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
          (view as any).setQuery('*.sdb');

          const picker = new google.picker.PickerBuilder()
            .setAppId(this.config.app_id)
            .setDeveloperKey(this.config.developer_key)
            .setOAuthToken(response.access_token)
            .addView(view)
            .setCallback(data => {
              switch (data[google.picker.Response.ACTION]) {
                case google.picker.Action.PICKED: {
                  const document = data[google.picker.Response.DOCUMENTS][0];

                  const file: IGoogleDriveStorageFile = {
                    name: document.name,
                    handle: document,
                  };

                  return resolve([ file ]);
                }

                case google.picker.Action.CANCEL:
                  return resolve(undefined);
              }
            })
            .build();

          picker.setVisible(true);
        },
      });

      if (this.access_token === undefined) {
        // Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
        token_client.requestAccessToken({ prompt: 'consent' });
      }
      else {
        // Skip display of account chooser and consent dialog for an existing session.
        token_client.requestAccessToken({ prompt: '' });
      }
    });
  }

  public async getFileData(file: IGoogleDriveStorageFile): Promise<ArrayBuffer> {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${ file.handle.id }?alt=media`, {
      headers: {
        'Authorization': `Bearer ${ this.access_token }`,
      },
    });

    if (!response.ok)
      throw new Error('Network response was not ok');

    return response.arrayBuffer();
  }

  public async save(file: IGoogleDriveStorageFile, data: ArrayBuffer): Promise<void> {
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${ file.handle.id }?uploadType=media`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ this.access_token }`,
        'Content-Type': 'application/octet-stream',
      },
      body: data,
    });

    if (!response.ok)
      throw new Error('Network response was not ok');
  }
}
