import { IEventEmitter } from '../util';

export type DatabaseEventType = 'changed';

export interface IDatabase extends IEventEmitter<DatabaseEventType> {
  readonly password: string;
  readonly root_folder: IFolder;
  readonly is_dirty: boolean;

  addFolders(folders: IFolder[], parent: IFolder): void;
  addItems(items: IItem[], parent: IFolder): void;
  updateFolder(folder: IFolder, props: Partial<IFolder>): void;
  updateItem(item: IItem, props: Partial<IItem>): void;
  deleteFolders(folders: IFolder[]): void;
  deleteItems(items: IItem[]): void;
  copyFolders(folders: IFolder[], destination: IFolder): IFolder[];
  copyItems(items: IItem[], destination: IFolder): IItem[];
  moveFolders(folder: IFolder[], destination: IFolder): void;
  moveItems(item: IItem[], destination: IFolder): void;
  clearIsDirty(): void;
}

export type FolderEventType = 'name-changed' | 'folders-changed' | 'items-changed';

export interface IFolder extends IEventEmitter<FolderEventType> {
  readonly id: string;
  readonly parent: IFolder | undefined;
  readonly name: string;
  readonly folders: readonly IFolder[];
  readonly items: readonly IItem[];

  setName(name: string): void;
  addFolder(folder: IFolder): void;
  addItem(item: IItem): void;
  deleteFolder(folder: IFolder): void;
  deleteItem(item: IItem): void;
  sortFolders(): void;
  sortItems(): void;
  clone(): IFolder;
}

export type ItemEventType = 'name-changed' | 'value-changed' | 'is-secret-changed';

export interface IItem extends IEventEmitter<ItemEventType> {
  readonly id: string;
  readonly parent: IFolder | undefined;
  readonly name: string;
  readonly value: string;
  readonly is_secret: boolean;

  setName(name: string): void;
  setValue(value: string): void;
  setIsSecret(is_secret: boolean): void;
  clone(): IItem;
}
