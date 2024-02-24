import * as React from 'react';
import { IFolder, IItem } from '../../core';

interface IEditContext {
  editing_folder: IFolder | undefined;
  editing_item: IItem | undefined;
  setEditingFolder(folder: IFolder | undefined): void;
  setEditingItem(item: IItem | undefined): void;
}

const EditContext = React.createContext<IEditContext | undefined>(undefined);

export function useEditContext(): IEditContext {
  const edit_context = React.useContext(EditContext);

  if (!edit_context)
    throw new Error('useEditContext must be used within a EditContextProvider');

  return edit_context;
}

interface IEditContextProviderProps {
  children: React.ReactNode;
}

export function EditContextProvider(props: IEditContextProviderProps): JSX.Element {
  const [ editing_folder, set_editing_folder ] = React.useState<IFolder | undefined>(undefined);
  const [ editing_item, set_editing_item ] = React.useState<IItem | undefined>(undefined);

  const context: IEditContext = {
    editing_folder: editing_folder,
    editing_item: editing_item,
    setEditingFolder: set_editing_folder,
    setEditingItem: set_editing_item,
  };

  return (
    <EditContext.Provider value={ context }>
      { props.children }
    </EditContext.Provider>
  );
}
