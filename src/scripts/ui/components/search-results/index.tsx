import * as React from 'react';
import { IDatabase, IFolder } from '../../../core';
import { FolderView } from '../folder-view';

interface ISearchResultsProps {
  folders: IFolder[];
  database: IDatabase;
  onFolderSelect(folder: IFolder): void;
}

export function SearchResults(props: ISearchResultsProps): JSX.Element {
  const groups = new Map<string, IFolder[]>();

  for (const folder of props.folders) {
    const folder_path = getFolderPath(folder.parent!);
    const group = groups.get(folder_path);

    if (group)
      group.push(folder);
    else
      groups.set(folder_path, [ folder ]);
  }

  const folder_paths = Array.from(groups.keys()).sort((path1, path2) => path1.localeCompare(path2));

  return (
    <div className="grid gap-8">
      {
        folder_paths.map(folder_path => (
          <div key={ folder_path }>
            <div className="font-bold text-sm text-gray-600">{ folder_path }</div>
            <div className="h-3"></div>
            <div className="flex flex-col items-strech gap-y-2">
              {
                groups.get(folder_path)!.map(folder => (
                  <button className="px-2.5 py-3 bg-white rounded border-2 border-transparent hover-hover:hover:border-primary" onClick={ () => props.onFolderSelect(folder) }>
                    <FolderView folder={ folder } no_wrap={ true } />
                  </button>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}

function getParentFolders(folder: IFolder): IFolder[] {
  const parent_folders = [];
  let parent_folder: IFolder | undefined = folder;

  while (parent_folder) {
    parent_folders.unshift(parent_folder);
    parent_folder = parent_folder.parent;
  }

  return parent_folders;
}

function getFolderPath(folder: IFolder): string {
  const parent_folders = getParentFolders(folder);

  return parent_folders.map(folder => folder.name).join(' → ');
}
