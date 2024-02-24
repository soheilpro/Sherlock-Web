import classNames from 'classnames';
import * as React from 'react';
import { IFolder } from '../../../core';
import { FolderFillIcon } from '../images/icons';

interface IFolderViewProps {
  folder: IFolder;
  no_wrap?: boolean;
}

export function FolderView(props: IFolderViewProps): JSX.Element {
  return (
    <div className="flex text-left">
      <FolderFillIcon className="mr-2 w-5 h-5 shrink-0 fill-amber-400" />
      <span className={ classNames({ 'whitespace-nowrap sm:whitespace-normal': props.no_wrap }, { 'text-gray-400': !Boolean(props.folder.name) }) }>{ props.folder.name || '<no name>' }</span>
    </div>
  );
}
