import * as React from 'react';
import { IDatabase, DatabaseManager } from '../../core';
import { IStorage, IFile } from '../../storage';
import { TestStorage } from '../../storage/test';
import { LocalStorage } from '../../storage/local';
import { GoogleDriveStorage } from '../../storage/google-drive';
import { StorageList } from '../storage-list';
import { FileList } from '../file-list';
import { Password } from '../password';
import { Database } from '../database';

require('./index.less');

interface IAppProps {
}

interface IAppState {
  storages: IStorage[];
  storage: IStorage;
  files: IFile[];
  file: IFile;
  fileData: ArrayBuffer;
  database: IDatabase;
}

export class App extends React.PureComponent<IAppProps, IAppState> {
  private static createStorages(): IStorage[] {
    const storages = [
      new LocalStorage,
      new GoogleDriveStorage(),
    ];

    if (process.env.NODE_ENV !== 'production')
      storages.unshift(new TestStorage());

    return storages;
  }

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      storages: App.createStorages(),
      storage: null,
      files: null,
      file: null,
      fileData: null,
      database: null,
    };
  }

  async componentDidMount(): Promise<void> {
    for (const storage of this.state.storages) {
      await storage.init();

      this.forceUpdate();
    }
  }

  private reset(): void {
    this.setState({
      storage: null,
      files: null,
      file: null,
      fileData: null,
      database: null,
    });
  }

  private async handleStorageSelect(storage: IStorage): Promise<void> {
    const files = await storage.getFiles();

    if (files.length === 1) {
      const file = files[0];
      const fileData = await storage.getFileData(file);
      const database = DatabaseManager.loadDatabase(fileData, '');

      this.setState({
        storage: storage,
        files: files,
        file: file,
        fileData: fileData,
        database: database,
      });
    }
    else {
      this.setState({
        storage: storage,
        files: files,
      });
    }
  }

  private async handleFileSelect(file: IFile): Promise<void> {
    const fileData = await this.state.storage.getFileData(file);
    const database = DatabaseManager.loadDatabase(fileData, '');

    this.setState({
      file: file,
      fileData: fileData,
      database: database,
    });
  }

  private handleFileCancel(): void {
    this.reset();
  }

  private handlePasswordEnter(password: string): void {
    this.setState({
      database: DatabaseManager.loadDatabase(this.state.fileData, password),
    });
  }

  private handlePasswordCancel(): void {
    this.reset();
  }

  private handleDatabaseUnload(): void {
    this.reset();
  }

  render(): JSX.Element {
    if (!this.state.storage)
      return <StorageList storages={this.state.storages} onSelect={this.handleStorageSelect.bind(this)} />;

    if (!this.state.file)
      return <FileList files={this.state.files} onSelect={this.handleFileSelect.bind(this)} onCancel={this.handleFileCancel.bind(this)} />;

    if (!this.state.database)
      return <Password onEnter={this.handlePasswordEnter.bind(this)} onCancel={this.handlePasswordCancel.bind(this)} />;

    return <Database database={this.state.database} onUnload={this.handleDatabaseUnload.bind(this)} />;
  }
}
