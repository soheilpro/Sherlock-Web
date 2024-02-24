import { IDatabase, IDatabaseManager, IFolder, IItem } from '../core';
import { Database, Folder, Item } from '../database';
import { decrypt, encrypt } from './crypto';

export class DatabaseManager implements IDatabaseManager {
  public loadDatabase(data: ArrayBuffer, password: string): IDatabase | undefined {
    if (password)
      data = decrypt(data, password);

    const text_decoder = new TextDecoder('utf-8');
    const text = text_decoder.decode(data);

    const dom_parser = new DOMParser();
    const document = dom_parser.parseFromString(text, 'text/xml').documentElement;

    if (document.tagName !== 'data')
      return undefined;

    const database = new Database({
      password: password,
      root_folder: readFolder(document, undefined),
    });

    return database;
  }

  public saveDatabase(database: IDatabase): ArrayBuffer {
    const xml = serializeDatabase(database);
    const data = new TextEncoder().encode(xml);

    if (database.password)
      return encrypt(data.buffer, database.password);
    else
      return data.buffer;
  }
}

function readFolder(element: Element, parent: IFolder | undefined): IFolder {
  const children = [].map.call(element.children, (e: Node) => e) as Element[];

  const folder: IFolder = new Folder({
    parent: parent,
    name: element.getAttribute('name') || 'Root',
    folders: children.filter(e => e.tagName === 'category').map(e => readFolder(e, undefined)),
    items: children.filter(e => e.tagName === 'item').map(e => readItem(e, undefined)),
  });

  return folder;
}

function readItem(element: Element, parent: IFolder | undefined): IItem {
  return new Item({
    parent: parent,
    name: element.getAttribute('name')!,
    value: element.textContent!,
    is_secret: element.getAttribute('type') === 'password',
  });
}

function serializeDatabase(database: IDatabase): string {
  const document = window.document.implementation.createDocument(null, 'root');
  const root_node = serializeFolder(database.root_folder, document);

  const serializer = new XMLSerializer();

  return serializer.serializeToString(root_node);
}

function serializeFolder(folder: IFolder, document: XMLDocument): Element {
  const is_root = !folder.parent;

  const node = document.createElement(is_root ? 'data' : 'category');

  if (!is_root)
    node.setAttribute('name', folder.name);

  for (const sub_folder of folder.folders)
    node.appendChild(serializeFolder(sub_folder, document));

  for (const item of folder.items)
    node.appendChild(serializeItem(item, document));

  return node;
}

function serializeItem(item: IItem, document: XMLDocument): Element {
  const node = document.createElement('item');
  node.setAttribute('name', item.name);
  node.setAttribute('type', item.is_secret ? 'password' : 'text');
  node.textContent = item.value;

  return node;
}
