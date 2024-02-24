import { FolderEventType, IFolder, IItem } from '../core';
import { EventEmitter } from '../util';
import { Item } from './item';
import { Sequence } from './sequence';

export class Folder extends EventEmitter<FolderEventType> implements IFolder {
  public id: string;
  public parent: IFolder | undefined;
  public name: string;
  public folders: IFolder[];
  public items: IItem[];

  public constructor(props: { parent?: IFolder; name: string; folders?: IFolder[]; items?: IItem[]; }) {
    super();

    this.id = Sequence.next();
    this.parent = props.parent;
    this.name = props.name;
    this.folders = props.folders || [];
    this.items = props.items || [];

    for (const folder of this.folders)
      (folder as Folder).parent = this;

    for (const item of this.items)
      (item as Item).parent = this;
  }

  public setName(name: string): void {
    this.name = name;

    this.emit('name-changed');
  }

  public addFolder(folder: IFolder): void {
    (folder as Folder).parent = this;

    this.folders.push(folder);

    this.emit('folders-changed');
  }

  public addItem(item: IItem): void {
    (item as Item).parent = this;

    this.items.push(item);

    this.emit('items-changed');
  }

  public deleteFolder(folder: IFolder): void {
    (folder as Folder).parent = undefined;

    this.folders.splice(this.folders.indexOf(folder), 1);

    this.emit('folders-changed');
  }

  public deleteItem(item: IItem): void {
    (item as Item).parent = undefined;

    this.items.splice(this.items.indexOf(item), 1);

    this.emit('items-changed');
  }

  public sortFolders(): void {
    this.folders.sort((folder1, folder2) => folder1.name.localeCompare(folder2.name));

    this.emit('folders-changed');
  }

  public sortItems(): void {
    this.items.sort((item1, item2) => item1.name.localeCompare(item2.name));

    this.emit('items-changed');
  }

  public clone(): IFolder {
    return new Folder({
      parent: this.parent,
      name: this.name,
      folders: this.folders.map(folder => folder.clone()),
      items: this.items.map(item => item.clone()),
    });
  }
}
