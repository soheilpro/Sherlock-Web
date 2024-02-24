import * as React from 'react';

type ScreenSize = 'sm' | 'wide';

export function useScreenSize(): [ ScreenSize ] {
  const screens: [ ScreenSize, MediaQueryList ][] = [
    [ 'sm', window.matchMedia('(max-width: 639px)') ],
  ];

  function getScreenSize(): ScreenSize {
    for (const screen of screens) {
      if (screen[1].matches)
        return screen[0];
    }

    return 'wide';
  }

  const [ screen_size, set_screen_size ] = React.useState<ScreenSize>(getScreenSize());

  React.useEffect(() => {
    function handleMediaWatcherChange(): void {
      set_screen_size(getScreenSize());
    }

    for (const screen of screens)
      screen[1].addEventListener('change', handleMediaWatcherChange);

    return () => {
      for (const screen of screens)
        screen[1].removeEventListener('change', handleMediaWatcherChange);
    };
  }, []);

  return [ screen_size ];
}
