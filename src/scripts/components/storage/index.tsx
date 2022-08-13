import * as React from 'react';
import { IStorage } from '../../storage';
import { Bug2LineIcon, ComputerLineIcon, DriveFillIcon } from '../images/icons';

interface IStorageProps {
  storage: IStorage;
  onSelect(): void;
}

export function Storage(props: IStorageProps): JSX.Element {
  const [ is_initialized, set_is_initialized ] = React.useState(props.storage.is_initialized);

  React.useEffect(() => {
    function handleStorageInitialized(): void {
      set_is_initialized(true);
    }

    props.storage.addEventListener('initialized', handleStorageInitialized);

    return () => {
      props.storage.removeEventListener('initialized', handleStorageInitialized);
    };
  }, [ is_initialized ]);

  return (
    <button disabled={ !is_initialized } className="button-secondary" onClick={ props.onSelect }>
      <div className="p-2 flex flex-col items-center">
        <div>
          {
            (props.storage.id === 'test') &&
              <Bug2LineIcon className="w-8 h-8 opacity-90" />
          }
          {
            (props.storage.id === 'local') &&
              <ComputerLineIcon className="w-8 h-8 opacity-90" />
          }
          {
            (props.storage.id === 'google-drive') &&
              <DriveFillIcon className="w-8 h-8 opacity-90" />
          }
        </div>
        <div className="h-2"></div>
        <span>{ props.storage.name }</span>
      </div>
    </button>
  );
}
