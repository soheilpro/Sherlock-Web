import * as React from 'react';
import { IFolder } from '../../../core';
import { useScreenSize } from '../../hooks';
import { FolderView } from '../folder-view';
import { ArrowRightSLineIcon } from '../images/icons';

interface IFolderBreadcrumbProps {
  folder: IFolder;
  onFolderSelect(folder: IFolder): void;
}

export function FolderBreadcrumb(props: IFolderBreadcrumbProps): JSX.Element {
  const [ screen_size ] = useScreenSize();

  function handleFolderClick(folder: IFolder): void {
    props.onFolderSelect(folder);
  }

  const path_folders = getPathFolders(props.folder);

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:flex-col sm:items-stretch">
      {
        path_folders.map((folder, index) => (
          <React.Fragment key={ folder.id }>
            <button className="px-2.5 py-2.5 bg-white rounded border-2 border-transparent hover-hover:hover:border-primary" style={{ paddingLeft: screen_size === 'sm' ? `${ (index + 1) * .5 }rem` : '' }} onClick={ () => handleFolderClick(folder) }>
              <FolderView folder={ folder } no_wrap={ true } />
            </button>
            {
              (index !== path_folders.length - 1) &&
                <ArrowRightSLineIcon className="w-5 h-5 -mx-1 fill-gray-500 sm:hidden" />
            }
          </React.Fragment>
        ))
      }
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
