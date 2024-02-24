import * as React from 'react';
import { IDatabase, IItem } from '../../../core';
import { Item } from '../item';

interface IItemListProps {
  items: readonly IItem[];
  database: IDatabase;
  selected_items: IItem[];
  onSelectionChange(items: IItem[]): void;
}

export function ItemList(props: IItemListProps): JSX.Element {
  function handleItemClick(item: IItem, event: React.MouseEvent): void {
    if (!props.onSelectionChange)
      return;

    if (props.selected_items.length === 0) {
      props.onSelectionChange([ item ]);
      return;
    }

    if (!props.selected_items.includes(item)) {
      if (!event.metaKey)
        props.onSelectionChange([ item ]);
      else
        props.onSelectionChange([ ...props.selected_items, item ]);
      return;
    }

    if (!event.metaKey)
      props.onSelectionChange([]);
    else
      props.onSelectionChange(props.selected_items.filter(f => f !== item));
  }

  return (
    <div>
      {
        (props.items.length > 0) ?
          <div className="grid gap-y-2">
            {
              props.items.map(item => <Item item={ item } database={ props.database } is_selected={ props.selected_items.includes(item) } onClick={ event => handleItemClick(item, event) } key={ item.id } />)
            }
          </div>
          :
          <div className="px-3 py-4 flex justify-center text-gray-400 border-2 border-dashed border-gray-300">
            <span>No items.</span>
          </div>
      }
    </div>
  );
}
