import * as CryptoJS from 'crypto-js';
import { IDatabase, IFolder, IItem } from './types';

export class DatabaseManager {
  public static loadDatabase(data: ArrayBuffer, password: string): IDatabase | undefined {
    if (password)
      data = decrypt(data, password);

    const text_decoder = new TextDecoder('utf-8');
    const text = text_decoder.decode(data);

    const dom_parser = new DOMParser();
    const document = dom_parser.parseFromString(text, 'text/xml').documentElement;

    if (document.tagName !== 'data')
      return undefined;

    const database = {
      root_folder: readFolder(document, undefined),
    };

    return database;
  }
}

function readFolder(element: Element, parent: IFolder | undefined): IFolder {
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
    name: element.getAttribute('name')!,
    value: element.textContent!,
    is_secret: element.getAttribute('type') === 'password',
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
    text = text.substring(0, length);

  return text;
}

function wordArrayToArrayBuffer(wordArray: CryptoJS.LibWordArray): ArrayBuffer {
  const result = new Uint8Array(wordArray.words.length << 2);
  let offset = 0;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < wordArray.words.length; i++) {
    const word = wordArray.words[i];
    result[offset++] = word >> 24;
    result[offset++] = (word >> 16) & 0xff;
    result[offset++] = (word >> 8) & 0xff;
    result[offset++] = word & 0xff;
  }

  return result;
}
