import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { StorageManager } from './storage';
import { App } from './ui/components/app';

const storages = StorageManager.getStorages();

for (const storage of storages)
  storage.init().catch(console.error);

const container = document.getElementById('app')!;
createRoot(container).render(<App storages={ storages } />);
