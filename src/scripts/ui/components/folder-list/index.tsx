import * as React from 'react';
import { IDatabase, IFolder } from '../../../core';
import { Folder } from '../folder';

interface IFolderListProps {
  folders: readonly IFolder[];
  database: IDatabase;
  selected_folders: IFolder[];
  onSelectionChange(folders: IFolder[]): void;
  onFolderSelect(folder: IFolder): void;
}

export function FolderList(props: IFolderListProps): JSX.Element {
  function handleFolderClick(folder: IFolder, event: React.MouseEvent): void {
    if (!props.onSelectionChange)
      return;

    if (props.selected_folders.length === 0) {
      props.onSelectionChange([ folder ]);
      return;
    }

    if (!props.selected_folders.includes(folder)) {
      if (!event.metaKey)
        props.onSelectionChange([ folder ]);
      else
        props.onSelectionChange([ ...props.selected_folders, folder ]);
      return;
    }

    if (!event.metaKey)
      props.onSelectionChange([]);
    else
      props.onSelectionChange(props.selected_folders.filter(f => f !== folder));
  }

  function handleFolderDoubleClick(folder: IFolder, event: React.MouseEvent): void {
    props.onFolderSelect(folder);
  }

  return (
    <div>
      {
        (props.folders.length > 0) ?
          <div className="flex flex-col gap-y-2">
            {
              props.folders.map(folder => (
                <Folder folder={ folder } database={ props.database } is_selected={ props.selected_folders.includes(folder) } onClick={ event => handleFolderClick(folder, event) } onDoubleClick={ event => handleFolderDoubleClick(folder, event) } key={ folder.id } />
              ))
            }
          </div>
          :
          <div className="px-3 py-4 flex justify-center text-gray-400 border-2 border-dashed border-gray-300">
            <span>No sub-folders.</span>
          </div>
      }
    </div>
  );
}
