import * as React from 'react';
import { IFolder } from '../../core';
import { FolderFillIcon, FolderOpenFillIcon } from '../images/icons';

interface IFolderProps {
  folder: IFolder;
  is_opened?: boolean;
  indentation?: number;
  onSelect(): void;
}

export function Folder(props: IFolderProps): JSX.Element {
  return (
    <button className="px-3 py-2.5 flex justify-between items-center bg-white text-left rounded hover-hover:hover:bg-primary hover-hover:hover:text-white sm:py-3" onClick={ props.onSelect }>
      <div className="flex" style={{ paddingLeft: `${ (props.indentation || 0) * .5 }rem` }}>
        {
          (props.is_opened) ?
            <FolderOpenFillIcon className="mt-0.5 mr-2 w-5 h-5 shrink-0 fill-amber-400" />
            :
            <FolderFillIcon className="mt-0.5 mr-2 w-5 h-5 shrink-0 fill-amber-400" />
        }
        <span>{ props.folder.name }</span>
      </div>
    </button>
  );
}
