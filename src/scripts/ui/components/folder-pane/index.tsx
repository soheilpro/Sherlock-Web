import * as React from 'react';
import { IDatabase, IFolder, IItem, IStorage } from '../../../core';
import { Folder, Item } from '../../../database';
import { useEditContext, usePasteboardContext } from '../../contexts';
import { useScreenSize } from '../../hooks';
import { FolderBreadcrumb } from '../folder-breadcrumb';
import { FolderList } from '../folder-list';
import { AddLineIcon, ArrowLeftLineIcon, ClipboardLineIcon, DeleteBinLineIcon, FileCopyLineIcon, PencilLineIcon, ScissorsLineIcon } from '../images/icons';
import { ItemList } from '../item-list';

interface IFolderPaneProps {
  folder: IFolder;
  database: IDatabase;
  storage: IStorage;
  onFolderSelect(folder: IFolder): void;
}

export function FolderPane(props: IFolderPaneProps): JSX.Element {
  const edit_context = useEditContext();
  const pasteboard_context = usePasteboardContext();

  const [ folders, set_folders ] = React.useState(props.folder.folders);
  const [ items, set_items ] = React.useState(props.folder.items);
  const [ selected_folders, set_selected_folders ] = React.useState<IFolder[]>([]);
  const [ selected_items, set_selected_items ] = React.useState<IItem[]>([]);
  const [ screen_size ] = useScreenSize();

  React.useEffect(() => {
    set_folders([ ...props.folder.folders ]);
    set_items([ ...props.folder.items ]);
    setSelection([], []);
  }, [ props.folder ]);

  React.useEffect(() => {
    function handleFoldersChanged(): void {
      set_folders([ ...props.folder.folders ]);
    }

    function handleItemsChanged(): void {
      set_items([ ...props.folder.items ]);
    }

    props.folder.addEventListener('folders-changed', handleFoldersChanged);
    props.folder.addEventListener('items-changed', handleItemsChanged);

    return () => {
      props.folder.removeEventListener('folders-changed', handleFoldersChanged);
      props.folder.removeEventListener('items-changed', handleItemsChanged);
    };
  }, [ props.folder ]);

  function setSelection(folders: IFolder[], items: IItem[]): void {
    set_selected_folders(folders);
    set_selected_items(items);
  }

  function handleBackButtonClick(): void {
    props.onFolderSelect(props.folder.parent!);
  }

  function handleAddFolderButtonClick(): void {
    const folder = new Folder({
      name: '',
    });

    props.database.addFolders([ folder ], props.folder);

    edit_context.setEditingFolder(folder);
    edit_context.setEditingItem(undefined);

    setSelection([ folder ], []);
  }

  function handleEditFolderButtonClick(): void {
    edit_context.setEditingFolder(selected_folders[0]);
  }

  function handleDeleteFoldersButtonClick(): void {
    if (!confirm('Are your sure?'))
      return;

    props.database.deleteFolders(selected_folders);

    setSelection([], []);
  }

  function handleCutFoldersButtonClick(): void {
    pasteboard_context.setFolders(selected_folders, 'cut');
  }

  function handleCopyFoldersButtonClick(): void {
    pasteboard_context.setFolders(selected_folders, 'copy');
  }

  function handlePasteFoldersButtonClick(): void {
    function isSubFolderOf(folder: IFolder, parent: IFolder): boolean {
      while (true) {
        if (folder.parent === parent)
          return true;

        if (!folder.parent)
          return false;

        folder = folder.parent;
      }
    }

    switch (pasteboard_context.folder_action) {
      case 'copy':
        const new_folders = props.database.copyFolders(pasteboard_context.folders, props.folder);
        setSelection(new_folders, []);
        break;

      case 'cut':
        if (pasteboard_context.folders.some(folder => folder === props.folder || isSubFolderOf(props.folder, folder))) {
          alert('Cannot move a folder into its subfolders.');
          return;
        }

        props.database.moveFolders(pasteboard_context.folders, props.folder);
        setSelection(pasteboard_context.folders, []);
        break;
    }

    pasteboard_context.clearFolders();
  }

  function handleAddItemButtonClick(): void {
    const item = new Item({
      name: '',
      value: '',
      is_secret: false,
    });

    props.database.addItems([ item ], props.folder);

    edit_context.setEditingFolder(undefined);
    edit_context.setEditingItem(item);

    setSelection([], [ item ]);
  }

  function handleEditItemButtonClick(): void {
    edit_context.setEditingItem(selected_items[0]);
  }

  function handleDeleteItemsButtonClick(): void {
    if (!confirm('Are your sure?'))
      return;

    props.database.deleteItems(selected_items);

    setSelection([], []);
  }

  function handleCutItemsButtonClick(): void {
    pasteboard_context.setItems(selected_items, 'cut');
  }

  function handleCopyItemsButtonClick(): void {
    pasteboard_context.setItems(selected_items, 'copy');
  }

  function handlePasteItemsButtonClick(): void {
    switch (pasteboard_context.item_action) {
      case 'copy':
        const new_items = props.database.copyItems(pasteboard_context.items, props.folder);
        setSelection([], new_items);
        break;

      case 'cut':
        props.database.moveItems(pasteboard_context.items, props.folder);
        setSelection([], pasteboard_context.items);
        break;
    }

    pasteboard_context.clearItems();
  }

  function handleFolderListSelectionChange(folders: IFolder[]): void {
    setSelection(folders, []);
  }

  function handleFolderSelect(folder: IFolder): void {
    if (edit_context.editing_folder)
      edit_context.setEditingFolder(undefined);

    if (edit_context.editing_item)
      edit_context.setEditingItem(undefined);

    props.onFolderSelect(folder);
  }

  function handleItemListSelectionChange(items: IItem[]): void {
    setSelection([], items);
  }

  return (
    <div>
      <div>
        <FolderBreadcrumb folder={ props.folder } onFolderSelect={ handleFolderSelect } />
      </div>
      <div className="h-8"></div>
      <div className="grid grid-cols-[38%_1fr] gap-x-6 sm:grid-cols-1 sm:gap-y-12">
        <div>
          <div className="flex flex-col gap-y-1">
            <div className="py-3 top-0 flex flex-wrap gap-x-3 gap-y-3 bg-gray-100 sticky">
              <div className="flex gap-x-1">
                <button disabled={ !props.folder.parent } title="Go Back" className="button-secondary !px-5 sm:!px-3" onClick={ handleBackButtonClick }>
                  <ArrowLeftLineIcon className="w-5 h-5" />
                </button>
              </div>
              {
                (props.storage.is_writable) &&
                  <React.Fragment>
                    <div className="flex gap-x-1">
                      <button title="Add Folder" className="button-secondary sm:px-3" onClick={ handleAddFolderButtonClick }>
                        <AddLineIcon className="w-5 h-5" />
                      </button>
                      <button title="Edit Folder" disabled={ selected_folders.length !== 1 } className="button-secondary sm:px-3" onClick={ handleEditFolderButtonClick }>
                        <PencilLineIcon className="w-5 h-5" />
                      </button>
                      <button title="Delete Folder" disabled={ selected_folders.length === 0 } className="button-secondary sm:px-3" onClick={ handleDeleteFoldersButtonClick }>
                        <DeleteBinLineIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex gap-x-1">
                      <button title="Cut Folder" disabled={ selected_folders.length === 0 } className="button-secondary sm:px-3" onClick={ handleCutFoldersButtonClick }>
                        <ScissorsLineIcon className="w-5 h-5" />
                      </button>
                      <button title="Copy Folder" disabled={ selected_folders.length === 0 } className="button-secondary sm:px-3" onClick={ handleCopyFoldersButtonClick }>
                        <FileCopyLineIcon className="w-5 h-5" />
                      </button>
                      <button title="Paste Folder" disabled={ pasteboard_context.folders.length === 0 } className="button-secondary sm:px-3" onClick={ handlePasteFoldersButtonClick }>
                        <ClipboardLineIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </React.Fragment>
              }
            </div>
            <div className="flex flex-col gap-y-2">
              <FolderList folders={ folders } database={ props.database } selected_folders={ selected_folders } onSelectionChange={ handleFolderListSelectionChange } onFolderSelect={ handleFolderSelect } />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-y-1">
            {
              (props.storage.is_writable || screen_size !== 'sm') &&
                <div className="py-3 top-0 flex flex-wrap gap-x-3 gap-y-3 bg-gray-100 sticky">
                  {
                    (props.storage.is_writable) ?
                      <React.Fragment>
                        <div className="flex gap-x-1">
                          <button title="Add Item" className="button-secondary sm:px-3" onClick={ handleAddItemButtonClick }>
                            <AddLineIcon className="w-5 h-5" />
                          </button>
                          <button title="Edit Item" disabled={ selected_items.length !== 1 } className="button-secondary sm:px-3" onClick={ handleEditItemButtonClick }>
                            <PencilLineIcon className="w-5 h-5" />
                          </button>
                          <button title="Delete Item" disabled={ selected_items.length === 0 } className="button-secondary sm:px-3" onClick={ handleDeleteItemsButtonClick }>
                            <DeleteBinLineIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex gap-x-1">
                          <button title="Cut Item" disabled={ selected_items.length === 0 } className="button-secondary sm:px-3" onClick={ handleCutItemsButtonClick }>
                            <ScissorsLineIcon className="w-5 h-5" />
                          </button>
                          <button title="Copy Item" disabled={ selected_items.length === 0 } className="button-secondary sm:px-3" onClick={ handleCopyItemsButtonClick }>
                            <FileCopyLineIcon className="w-5 h-5" />
                          </button>
                          <button title="Paste Item" disabled={ pasteboard_context.items.length === 0 } className="button-secondary sm:px-3" onClick={ handlePasteItemsButtonClick }>
                            <ClipboardLineIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </React.Fragment>
                      :
                      <button className="button-secondary invisible">&nbsp;</button>
                  }
                </div>
            }
            <div>
              <ItemList items={ items } database={ props.database } selected_items={ selected_items } onSelectionChange={ handleItemListSelectionChange } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
