import * as React from 'react';
import { IFolder } from '../../core';
import { FolderList } from '../folder-list';
import { ItemList } from '../item-list';

interface IFolderViewProps {
  folder: IFolder;
  onFolderSelect(folder: IFolder): void;
}

export function FolderView(props: IFolderViewProps): JSX.Element {
  const path_folders = getPathFolders(props.folder);

  return (
    <div>
      <div className="grid grid-cols-[30%_1fr] gap-6 sm:grid-cols-1">
        <div>
          <div className="grid gap-6">
            <FolderList folders={ path_folders } opened={ true } indent={ true } onFolderSelect={ props.onFolderSelect } />
            {
              (props.folder.folders.length > 0) &&
                <FolderList folders={ props.folder.folders } onFolderSelect={ props.onFolderSelect } />
            }
          </div>
        </div>
        <div className="w-full">
          <ItemList items={ props.folder.items } />
        </div>
      </div>
    </div>
  );
}

function getPathFolders(folder: IFolder): IFolder[] {
  const parent_folders = [];
  let parent_folder: IFolder | undefined = folder;

  while (parent_folder) {
    parent_folders.unshift(parent_folder);
    parent_folder = parent_folder.parent;
  }

  return parent_folders;
}
