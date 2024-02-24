import { DatabaseEventType, IDatabase, IFolder, IItem } from '../core';
import { EventEmitter } from '../util';

export class Database extends EventEmitter<DatabaseEventType> implements IDatabase {
  public password: string;
  public root_folder: IFolder;
  public is_dirty: boolean = false;

  public constructor(database: { password: string; root_folder: IFolder; }) {
    super();

    this.password = database.password;
    this.root_folder = database.root_folder;
  }

  public addFolders(folders: IFolder[], parent: IFolder): void {
    for (const folder of folders)
      parent.addFolder(folder);

    parent.sortFolders();

    this.is_dirty = true;

    this.emit('changed');
  }

  public addItems(items: IItem[], parent: IFolder): void {
    for (const item of items)
      parent.addItem(item);

    parent.sortItems();

    this.is_dirty = true;

    this.emit('changed');
  }

  public updateFolder(folder: IFolder, props: Partial<IFolder>): void {
    let is_changed = false;

    if (props.name !== undefined) {
      if (folder.name !== props.name) {
        folder.setName(props.name);
        folder.parent!.sortFolders();
        is_changed = true;
      }
    }

    if (!is_changed)
      return;

    this.is_dirty = true;

    this.emit('changed');
  }

  public updateItem(item: IItem, props: Partial<IItem>): void {
    let is_changed = false;

    if (props.name !== undefined) {
      if (item.name !== props.name) {
        item.setName(props.name);
        item.parent!.sortItems();
        is_changed = true;
      }
    }

    if (props.value !== undefined) {
      if (item.value !== props.value) {
        item.setValue(props.value);
        is_changed = true;
      }
    }

    if (props.is_secret !== undefined) {
      if (item.is_secret !== props.is_secret) {
        item.setIsSecret(props.is_secret);
        is_changed = true;
      }
    }

    if (!is_changed)
      return;

    this.is_dirty = true;

    this.emit('changed');
  }

  public deleteFolders(folders: IFolder[]): void {
    for (const folder of folders)
      folder.parent!.deleteFolder(folder);

    this.is_dirty = true;

    this.emit('changed');
  }

  public deleteItems(items: IItem[]): void {
    for (const item of items)
      item.parent!.deleteItem(item);

    this.is_dirty = true;

    this.emit('changed');
  }

  public copyFolders(folders: IFolder[], destination: IFolder): IFolder[] {
    const new_folders: IFolder[] = [];

    for (const folder of folders) {
      const new_folder = folder.clone();
      destination.addFolder(new_folder);

      new_folders.push(new_folder);
    }

    destination.sortFolders();

    this.is_dirty = true;

    this.emit('changed');

    return new_folders;
  }

  public copyItems(items: IItem[], destination: IFolder): IItem[] {
    const new_items: IItem[] = [];

    for (const item of items) {
      const new_item = item.clone();
      destination.addItem(new_item);

      new_items.push(new_item);
    }

    destination.sortItems();

    this.is_dirty = true;

    this.emit('changed');

    return new_items;
  }

  public moveFolders(folders: IFolder[], destination: IFolder): void {
    for (const folder of folders) {
      folder.parent!.deleteFolder(folder);
      destination.addFolder(folder);
    }

    destination.sortFolders();

    this.is_dirty = true;

    this.emit('changed');
  }

  public moveItems(items: IItem[], destination: IFolder): void {
    for (const item of items) {
      item.parent!.deleteItem(item);
      destination.addItem(item);
    }

    destination.sortItems();

    this.is_dirty = true;

    this.emit('changed');
  }

  public clearIsDirty(): void {
    this.is_dirty = false;

    this.emit('changed');
  }
}
