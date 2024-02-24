import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { DatabaseManager, StorageManager } from './managers';
import { App } from './ui/components/app';

const storage_manager = new StorageManager();
const storages = storage_manager.getStorages();

for (const storage of storages)
  storage.init().catch(console.error);

const database_manager = new DatabaseManager();

const container = document.getElementById('app')!;
createRoot(container).render(<App storages={ storages } database_manager={ database_manager } />);
