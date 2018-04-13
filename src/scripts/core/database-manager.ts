import * as CryptoJS from 'crypto-js';
import { IFolder } from './ifolder';
import { IItem } from './iitem';
import { IDatabase } from './idatabase';

export class DatabaseManager {
  static loadDatabase(data: ArrayBuffer, password: string): IDatabase {
    if (password)
      data = decrypt(data, password);

    const textDecoder = new TextDecoder('utf-8');
    const text = textDecoder.decode(data);

    const domParser = new DOMParser();
    const document = domParser.parseFromString(text, 'text/xml').documentElement;

    if (document.tagName !== 'data')
      return null;

    const database = {
      rootFolder: readFolder(document, null),
    };

    return database;
  }
}

function readFolder(element: Element, parent: IFolder): IFolder {
  const folder: IFolder = {
    parent: parent,
    name: element.getAttribute('name') || 'Root',
    folders: [],
    items: [],
  };

  const children = [].map.call(element.children, (e: Node) => e) as Element[];

  folder.folders = children.filter(e => e.tagName === 'category').map(e => readFolder(e, folder));
  folder.items = children.filter(e => e.tagName === 'item').map(e => readItem(e, folder));

  return folder;
}

function readItem(element: Element, parent: IFolder): IItem {
  return {
    parent: parent,
    name: element.getAttribute('name'),
    value: element.textContent,
    isSecret: element.getAttribute('type') === 'password',
  };
}

function decrypt(data: ArrayBuffer, password: string): ArrayBuffer {
  const key: string = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 24));
  const iv: string = CryptoJS.enc.Utf8.parse(fixedSizeString(password, 8));
  const decrypted = CryptoJS.TripleDES.decrypt({ ciphertext: CryptoJS.lib.WordArray.create(data) } as any, key, { 'iv': iv }) as CryptoJS.LibWordArray;

  return wordArrayToArrayBuffer(decrypted);
}

function fixedSizeString(text: string, length: number): string {
  while (text.length < length)
    text += text;

  if (text.length > length)
    text = text.substr(0, length);

  return text;
}

function wordArrayToArrayBuffer(wordArray: CryptoJS.LibWordArray): ArrayBuffer {
  const result = new Uint8Array(wordArray.words.length << 2);
  let offset = 0;

  for (let i = 0; i < wordArray.words.length; i++) {
    const word = wordArray.words[i];
    result[offset++] = word >> 24;
    result[offset++] = (word >> 16) & 0xff;
    result[offset++] = (word >> 8) & 0xff;
    result[offset++] = word & 0xff;
  }

  return result;
}
