import classNames from 'classnames';
import * as React from 'react';
import { IDatabase, IItem } from '../../../core';
import { useEditContext } from '../../contexts';
import { isInteractiveElement } from '../../util';
import { ItemEdit } from '../item-edit';
import { ItemView } from '../item-view';

interface IItemProps {
  item: IItem;
  database: IDatabase;
  is_selected: boolean;
  onClick(event: React.MouseEvent): void;
}

export function Item(props: IItemProps): JSX.Element {
  const edit_context = useEditContext();

  const is_editing = edit_context.editing_item === props.item;

  function handleClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (isInteractiveElement(event.target as Element))
      return;

    props.onClick(event);
  }

  function handleEditAccept(item: { name: string; value: string; is_secret: boolean; }): void {
    props.database.updateItem(props.item, {
      name: item.name,
      value: item.value,
      is_secret: item.is_secret,
    });

    edit_context.setEditingItem(undefined);
  }

  function handleEditCancel(): void {
    edit_context.setEditingItem(undefined);
  }

  return (
    <div className={ classNames('px-4 py-4 flex flex-col bg-white border-2 rounded cursor-default sm:pl-3 sm:py-2.5', { 'border-white': !props.is_selected }, { 'border-primary': props.is_selected }) } onClick={ handleClick }>
      {
        (!is_editing) ?
          <ItemView item={ props.item } is_active={ props.is_selected } />
          :
          <ItemEdit item={ props.item } onAccept={ handleEditAccept } onCancel={ handleEditCancel } />
      }
    </div>
  );
}
