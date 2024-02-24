import * as React from 'react';
import { IDatabase, IFolder, IItem } from '../../core';

export type PasteboardAction = 'copy' | 'cut';

interface IPasteboardContext {
  folders: IFolder[];
  items: IItem[];
  folder_action: PasteboardAction | undefined;
  item_action: PasteboardAction | undefined;
  setFolders(folders: IFolder[], action: PasteboardAction): void;
  setItems(items: IItem[], action: PasteboardAction): void;
  clearFolders(): void;
  clearItems(): void;
}

const PasteboardContext = React.createContext<IPasteboardContext | undefined>(undefined);

export function usePasteboardContext(): IPasteboardContext {
  const pasteboard_context = React.useContext(PasteboardContext);

  if (!pasteboard_context)
    throw new Error('usePasteboardContext must be used within a PasteboardContextProvider');

  return pasteboard_context;
}

interface IPasteboardContextProviderProps {
  database: IDatabase;
  children: React.ReactNode;
}

export function PasteboardContextProvider(props: IPasteboardContextProviderProps): JSX.Element {
  const [ folders, set_folders ] = React.useState<IFolder[]>([]);
  const [ items, set_items ] = React.useState<IItem[]>([]);
  const [ folder_action, set_folder_action ] = React.useState<PasteboardAction | undefined>();
  const [ item_action, set_item_action ] = React.useState<PasteboardAction | undefined>();

  React.useEffect(() => {
    function handleDatabaseChange(): void {
      // Remove deleted folders and items

      if (folders.some(folder => !Boolean(folder.parent)))
        set_folders(folders.filter(folder => Boolean(folder.parent)));

      if (items.some(item => !Boolean(item.parent)))
        set_items(items.filter(item => Boolean(item.parent)));
    }

    props.database.addEventListener('changed', handleDatabaseChange);

    return () => {
      props.database.removeEventListener('changed', handleDatabaseChange);
    };
  }, [ props.database, items, folders ]);

  function setFolders(folders: IFolder[], action: PasteboardAction): void {
    set_folders(folders);
    set_folder_action(action);
  }

  function setItems(items: IItem[], action: PasteboardAction): void {
    set_items(items);
    set_item_action(action);
  }

  function clearFolders(): void {
    set_folders([]);
    set_folder_action(undefined);
  }

  function clearItems(): void {
    set_items([]);
    set_item_action(undefined);
  }

  const context: IPasteboardContext = {
    folders: folders,
    items: items,
    folder_action: folder_action,
    item_action: item_action,
    setFolders: setFolders,
    setItems: setItems,
    clearFolders: clearFolders,
    clearItems: clearItems,
  };

  return (
    <PasteboardContext.Provider value={ context }>
      { props.children }
    </PasteboardContext.Provider>
  );
}
