import * as React from 'react';
import { IItem } from '../../../core';
import { Item } from '../item';

interface IItemListProps {
  items: IItem[];
}

export function ItemList(props: IItemListProps): JSX.Element {
  return (
    <div>
      {
        (props.items.length > 0) &&
          <div className="grid gap-1">
            {
              props.items.map((item, index) => <Item item={ item } key={ index } />)
            }
          </div>
      }
    </div>
  );
}
