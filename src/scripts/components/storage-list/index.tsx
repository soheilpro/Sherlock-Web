import * as React from 'react';
import { IStorage } from '../../storage';

const icons: { [index: string]: string } = {
  'google-drive': require('./google-drive.png'),
};

require('./index.less');

interface IStorageListProps {
  storages: IStorage[];
  onSelect(storage: IStorage): void;
}

interface IStorageListState {
}

export class StorageList extends React.PureComponent<IStorageListProps, IStorageListState> {
  private async handleButtonClick(storage: IStorage, event: React.MouseEvent<HTMLElement>): Promise<void> {
    event.preventDefault();

    this.props.onSelect(storage);
  }

  render(): JSX.Element {
    return (
      <div className="storage-list-component">
        <div className="title">Sherlock</div>
        {
          this.props.storages.map(storage => {
            return (
              <button className="storage" disabled={!storage.isInitialized} onClick={this.handleButtonClick.bind(this, storage)} key={storage.id}>
                {
                  icons[storage.id] &&
                    <img className="icon" src={icons[storage.id]} />
                }
                { storage.name }
              </button>
            );
          })
        }
      </div>
    );
  }
}
