export interface IDatabase {
  root_folder: IFolder;
}

export interface IFolder {
  parent: IFolder | undefined;
  name: string;
  folders: IFolder[];
  items: IItem[];
}

export interface IItem {
  parent: IFolder;
  name: string;
  value: string;
  is_secret: boolean;
}
