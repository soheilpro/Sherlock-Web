import * as React from 'react';
import { IFile } from '../../storage';

require('./index.less');

interface IFileListProps {
  files: IFile[];
  onSelect(file: IFile): void;
  onCancel(): void;
}

interface IFileListState {
}

export class FileList extends React.PureComponent<IFileListProps, IFileListState> {
  private sortFiles(files: IFile[]): IFile[] {
    files = [...this.props.files];
    files.sort((file1, file2) => file1.name.localeCompare(file2.name));

    return files;
  }

  private async handleButtonClick(file: IFile, event: React.MouseEvent<HTMLElement>): Promise<void> {
    event.preventDefault();

    this.props.onSelect(file);
  }

  private handleCancel(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();

    this.props.onCancel();
  }

  render(): JSX.Element {
    return (
      <div className="file-list-component">
        <div className="title">Database?</div>
        {
          this.sortFiles(this.props.files).map(file => {
            return (
              <button className="file" onClick={this.handleButtonClick.bind(this, file)} key={file.name}>{ file.name }</button>
            );
          })
        }
        <a className="cancel" href="" onClick={this.handleCancel.bind(this)}>Cancel</a>
      </div>
    );
  }
}
