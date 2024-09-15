import * as React from 'react';
import { app } from '../../../../app';
import { IStorage } from '../../../core';
import { Storage } from '../storage';

interface IStorageListProps {
  storages: IStorage[];
  onSelect(storage: IStorage): void;
}

export function StorageList(props: IStorageListProps): JSX.Element {
  async function update(): Promise<void> {
    const service_worker_registration = await navigator.serviceWorker.getRegistration();

    await service_worker_registration!.update();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-12"></div>
      <h1 className="font-bold text-3xl text-center">Sherlock</h1>
      <div className="h-12"></div>
      <div className="min-w-40 grid gap-5">
        {
          props.storages.map(storage => (
            <Storage storage={ storage } onSelect={ () => props.onSelect(storage) } key={ storage.id } />
          ))
        }
      </div>
      <div className="h-12"></div>
      <div>
        <button className="text-gray-500" onClick={ update }>v{ app.version }</button>
      </div>
    </div>
  );
}
