import classNames from 'classnames';
import * as React from 'react';
import { IDatabase, IFolder } from '../../../core';
import { useEditContext } from '../../contexts';
import { isInteractiveElement } from '../../util';
import { FolderEdit } from '../folder-edit';
import { FolderView } from '../folder-view';

interface IFolderProps {
  folder: IFolder;
  database: IDatabase;
  is_selected: boolean;
  onClick(event: React.MouseEvent): void;
  onDoubleClick(event: React.MouseEvent): void;
}

export function Folder(props: IFolderProps): JSX.Element {
  const edit_context = useEditContext();

  const is_editing = edit_context.editing_folder === props.folder;

  function handleClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (isInteractiveElement(event.target as Element))
      return;

    props.onClick(event);
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (isInteractiveElement(event.target as Element))
      return;

    if (is_editing)
      return;

    props.onDoubleClick(event);

    document.getSelection()?.removeAllRanges();
  }

  function handleEditAccept(folder: { name: string; }): void {
    props.database.updateFolder(props.folder, {
      name: folder.name,
    });

    edit_context.setEditingFolder(undefined);
  }

  function handleEditCancel(): void {
    edit_context.setEditingFolder(undefined);
  }

  return (
    <div className={ classNames('px-4 py-3 flex flex-col bg-white border-2 rounded cursor-default sm:pl-3 sm:py-2.5', { 'border-white': !props.is_selected }, { 'border-primary': props.is_selected }) } onClick={ handleClick } onDoubleClick={ handleDoubleClick }>
      {
        (!is_editing) ?
          <FolderView folder={ props.folder } />
          :
          <FolderEdit folder={ props.folder } onAccept={ handleEditAccept } onCancel={ handleEditCancel } />
      }
    </div>
  );
}
