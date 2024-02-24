import * as React from 'react';

interface ILayoutProps {
  children: React.ReactNode;
}

export function Layout(props: ILayoutProps): JSX.Element {
  return (
    <div className="mx-auto p-8 max-w-5xl sm:p-4 xl:max-w-none">
      { props.children }
    </div>
  );
}
