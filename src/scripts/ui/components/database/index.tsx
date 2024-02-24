import * as React from 'react';
import { IDatabase, IDatabaseManager, IFile, IFolder, IStorage } from '../../../core';
import { PasteboardContextProvider } from '../../contexts';
import { FolderPane } from '../folder-pane';
import { Database2LineIcon, DoorOpenLineIcon, SaveLineIcon } from '../images/icons';
import { SearchInput } from '../search-input';
import { SearchResults } from '../search-results';

interface IDatabaseProps {
  database: IDatabase;
  file: IFile;
  storage: IStorage;
  database_manager: IDatabaseManager;
  onUnload(): void;
}

export function Database(props: IDatabaseProps): JSX.Element {
  const [ is_dirty, set_is_dirty ] = React.useState(props.database.is_dirty);
  const [ is_saving, set_is_saving ] = React.useState(false);
  const [ search_query, set_search_query ] = React.useState('');
  const [ current_folder, set_current_folder ] = React.useState(props.database.root_folder);

  React.useEffect(() => {
    function handleDatabaseChange(): void {
      set_is_dirty(props.database.is_dirty);
    }

    props.database.addEventListener('changed', handleDatabaseChange);

    return () => {
      props.database.removeEventListener('changed', handleDatabaseChange);
    };
  }, [ props.database ]);

  React.useEffect(() => {
    function handleWindowBeforeUnload(event: BeforeUnloadEvent): void {
      if (props.database.is_dirty)
        event.preventDefault();
    }

    window.addEventListener('beforeunload', handleWindowBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleWindowBeforeUnload);
    };
  }, []);

  async function handleSaveButtonClick(): Promise<void> {
    set_is_saving(true);

    try {
      const data = props.database_manager.saveDatabase(props.database);

      await props.storage.save(props.file, data);

      props.database.clearIsDirty();
    }
    catch (error: any) {
      alert(`Error while saving the database:\n\n${ error.message }`);
    }

    set_is_saving(false);
  }

  function handleUnloadButtonClick(): void {
    if (is_dirty) {
      if (!confirm('Discard changes?'))
        return;
    }

    props.onUnload();
  }

  function handleSearchInputChange(query: string): void {
    set_search_query(query);
  }

  function handleSearchResultsFolderSelect(folder: IFolder): void {
    set_search_query('');
    set_current_folder(folder);

    window.scrollTo(0, 0);
  }

  function handleFolderSelect(folder: IFolder): void {
    set_current_folder(folder);

    window.scrollTo(0, 0);
  }

  return (
    <PasteboardContextProvider database={ props.database }>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <Database2LineIcon className="w-5 h-5" />
            <span className="font-semibold">{ props.file.name } ({ props.storage.name })</span>
          </div>
          <div className="flex gap-x-2 items-end">
            {
              (props.storage.is_writable) &&
                <button disabled={ !is_dirty || is_saving } title="Save Database" className="button-secondary flex items-center gap-x-2" onClick={ handleSaveButtonClick }>
                  <SaveLineIcon className="w-5 h-5" />
                  <span className="sm:hidden">{ !is_saving ? 'Save' : 'Saving...' }</span>
                </button>
            }
            <button className="button-secondary flex items-center gap-x-2" title="Unload Database" onClick={ handleUnloadButtonClick }>
              <DoorOpenLineIcon className="w-5 h-5" />
              <span className="sm:hidden">Unload</span>
            </button>
          </div>
        </div>
        <div className="h-8"></div>
        <SearchInput query={ search_query } onChange={ handleSearchInputChange } />
        <div className="h-8"></div>
        {
          (search_query) ?
            <SearchResults folders={ search(props.database.root_folder, search_query) } database={ props.database } onFolderSelect={ handleSearchResultsFolderSelect } />
            :
            <FolderPane folder={ current_folder } database={ props.database } storage={ props.storage } onFolderSelect={ handleFolderSelect } />
        }
      </div>
    </PasteboardContextProvider>
  );
}

function search(root_folder: IFolder, query: string): IFolder[] {
  const results = new Array<IFolder>();

  function searchFolder(folder: IFolder): void {
    if (folder.name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1) {
      results.push(folder);
      return;
    }

    for (const sub_folder of folder.folders)
      searchFolder(sub_folder);
  }

  searchFolder(root_folder);

  return results;
}
