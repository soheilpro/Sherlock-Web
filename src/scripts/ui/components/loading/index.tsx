import * as React from 'react';
import { DownloadCloudLineIcon } from '../images/icons';

interface ILoadingProps {
  message: string;
}

export function Loading(props: ILoadingProps): JSX.Element {
  return (
    <div className="mt-[10vh] flex flex-col items-center">
      <DownloadCloudLineIcon className="w-10 h-10 fill-gray-400" />
      <div className="h-4"></div>
      <span className="font-semibold text-md text-gray-400">{ props.message }</span>
    </div>
  );
}
