import * as React from 'react';
import { IDatabase, IDatabaseManager, IFile, IStorage } from '../../../core';
import { EditContextProvider } from '../../contexts';
import { Database } from '../database';
import { FileList } from '../file-list';
import { Layout } from '../layout';
import { Loading } from '../loading';
import { Password } from '../password';
import { StorageList } from '../storage-list';

interface IAppProps {
  storages: IStorage[];
  database_manager: IDatabaseManager;
}

export function App(props: IAppProps): JSX.Element {
  const [ is_loading_files, set_is_loading_files ] = React.useState(false);
  const [ is_loading_file_data, set_is_loading_file_data ] = React.useState(false);
  const [ storage, set_storage ] = React.useState<IStorage>();
  const [ files, set_files ] = React.useState<IFile[]>();
  const [ file, set_file ] = React.useState<IFile>();
  const [ file_data, set_file_data ] = React.useState<ArrayBuffer>();
  const [ is_password_invalid, set_is_password_invalid ] = React.useState(false);
  const [ database, set_database ] = React.useState<IDatabase>();

  function reset(): void {
    set_is_loading_files(false);
    set_is_loading_file_data(false);
    set_storage(undefined);
    set_files(undefined);
    set_file(undefined);
    set_file_data(undefined);
    set_is_password_invalid(false);
    set_database(undefined);
  }

  async function handleStorageSelect(storage: IStorage): Promise<void> {
    if (storage.is_slow)
      set_is_loading_files(true);

    const files = await storage.getFiles();

    if (storage.is_slow)
      set_is_loading_files(false);

    if (!files)
      return;

    if (files.length === 1) {
      if (storage.is_slow)
        set_is_loading_file_data(true);

      const file = files[0];
      const file_data = await storage.getFileData(file);

      if (storage.is_slow)
        set_is_loading_file_data(false);

      const database = props.database_manager.loadDatabase(file_data, '');

      set_file(file);
      set_file_data(file_data);
      set_is_password_invalid(false);
      set_database(database);
    }

    set_files(files);
    set_storage(storage);
  }

  async function handleFileSelect(file: IFile): Promise<void> {
    if (storage!.is_slow)
      set_is_loading_file_data(true);

    const file_data = await storage!.getFileData(file);

    if (storage!.is_slow)
      set_is_loading_file_data(false);

    const database = props.database_manager.loadDatabase(file_data, '');

    set_file(file);
    set_file_data(file_data);
    set_is_password_invalid(false);
    set_database(database);
  }

  function handleFileCancel(): void {
    reset();
  }

  function handlePasswordEnter(password: string): void {
    const database = props.database_manager.loadDatabase(file_data!, password);

    if (!database)
      set_is_password_invalid(true);

    set_database(database);
  }

  function handlePasswordCancel(): void {
    reset();
  }

  function handleDatabaseUnload(): void {
    reset();
  }

  function renderContent(): JSX.Element {
    if (is_loading_files)
      return <Loading message='Loading databases' />;

    if (is_loading_file_data)
      return <Loading message={'Loading database'} />;

    if (!storage)
      return <StorageList storages={ props.storages } onSelect={ handleStorageSelect } />;

    if (!file)
      return <FileList files={ files! } onSelect={ handleFileSelect } onCancel={ handleFileCancel } />;

    if (!database)
      return <Password is_invalid={ is_password_invalid } onEnter={ handlePasswordEnter } onCancel={ handlePasswordCancel } />;

    return <Database database={ database } file={ file } storage={ storage } database_manager={ props.database_manager } onUnload={ handleDatabaseUnload } />;
  }

  return (
    <EditContextProvider>
      <Layout>
        { renderContent() }
      </Layout>
    </EditContextProvider>
  );
}
