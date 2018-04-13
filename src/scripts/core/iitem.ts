import { IFolder } from './ifolder';

export interface IItem {
  parent: IFolder;
  name: string;
  value: string;
  isSecret: boolean;
}
