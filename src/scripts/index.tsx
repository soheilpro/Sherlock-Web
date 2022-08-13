import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app';
import { StorageManager } from './storage';

const storages = StorageManager.getStorages();

for (const storage of storages)
  storage.init().catch(console.error);

const container = document.getElementById('app')!;
createRoot(container).render(<App storages={ storages } />);
