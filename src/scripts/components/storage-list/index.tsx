import * as React from 'react';
import { IStorage } from '../../storage';
import { Storage } from '../storage';

interface IStorageListProps {
  storages: IStorage[];
  onSelect(storage: IStorage): void;
}

export function StorageList(props: IStorageListProps): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <div className="h-12"></div>
      <h1 className="font-bold text-3xl text-center">Sherlock</h1>
      <div className="h-12"></div>
      <div className="min-w-40 grid gap-5">
        {
          props.storages.map(storage => (
            <Storage storage={ storage } key={ storage.id } onSelect={ () => props.onSelect(storage) } />
          ))
        }
      </div>
    </div>
  );
}
