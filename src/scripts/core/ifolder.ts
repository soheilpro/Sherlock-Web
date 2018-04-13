import { IItem } from './iitem';

export interface IFolder {
  parent: IFolder;
  name: string;
  folders: IFolder[];
  items: IItem[];
}
