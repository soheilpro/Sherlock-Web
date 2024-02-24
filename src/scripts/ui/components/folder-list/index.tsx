import * as React from 'react';
import { IFolder } from '../../../core';
import { Folder } from '../folder';

interface IFolderListProps {
  folders: IFolder[];
  opened?: boolean;
  indent?: boolean;
  onFolderSelect(folder: IFolder): void;
}

export function FolderList(props: IFolderListProps): JSX.Element {
  return (
    <div>
      {
        (props.folders.length > 0) &&
          <div className="grid gap-1">
            {
              props.folders.map((folder, index) => (
                <Folder folder={ folder } is_opened={ props.opened } indentation={ props.indent ? index : 0 } onSelect={ () => props.onFolderSelect(folder) } key={ index } />
              ))
            }
          </div>
      }
    </div>
  );
}
