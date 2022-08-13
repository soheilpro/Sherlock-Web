import * as React from 'react';
import { IDatabase, IFolder } from '../../core';
import { IFile, IStorage } from '../../storage';
import { FolderView } from '../folder-view';
import { SearchInput } from '../search-input';
import { SearchResults } from '../search-results';

interface IDatabaseProps {
  database: IDatabase;
  file: IFile;
  storage: IStorage;
  onUnload(): void;
}

export function Database(props: IDatabaseProps): JSX.Element {
  const [ search_query, set_search_query ] = React.useState('');
  const [ current_folder, set_current_folder ] = React.useState(props.database.root_folder);

  function handleSearchChange(query: string): void {
    set_search_query(query);
  }

  function handleSearchFolderSelect(folder: IFolder): void {
    set_search_query('');
    set_current_folder(folder);

    window.scrollTo(0, 0);
  }

  function handleFolderSelect(folder: IFolder): void {
    set_current_folder(folder);

    window.scrollTo(0, 0);
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{ props.file.name } ({ props.storage.name })</span>
        <button className="button-secondary" onClick={ props.onUnload }>Unload</button>
      </div>
      <div className="h-8"></div>
      <SearchInput query={ search_query } onChange={ handleSearchChange } />
      <div className="h-8"></div>
      {
        (search_query) ?
          <SearchResults folders={ search(props.database.root_folder, search_query) } onFolderSelect={ handleSearchFolderSelect } />
          :
          <FolderView folder={ current_folder } onFolderSelect={ handleFolderSelect } />
      }
    </div>
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
