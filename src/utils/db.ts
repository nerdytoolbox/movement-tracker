import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { MovementLog } from '../types';

interface MovementDB extends DBSchema {
  'movement-logs': {
    key: string;
    value: MovementLog;
    indexes: { 'by-date': string };
  };
  'app-state': {
    key: string;
    value: unknown;
  };
}

let db: IDBPDatabase<MovementDB>;

export async function getDB() {
  if (!db) {
    db = await openDB<MovementDB>('movement-tracker', 1, {
      upgrade(db) {
        const logStore = db.createObjectStore('movement-logs', { keyPath: 'date' });
        logStore.createIndex('by-date', 'date');
        db.createObjectStore('app-state');
      },
    });
  }
  return db;
}

export async function saveMovementLog(log: MovementLog) {
  const database = await getDB();
  await database.put('movement-logs', log);
}

export async function getAllLogs(): Promise<MovementLog[]> {
  const database = await getDB();
  return database.getAll('movement-logs');
}

export async function getStateValue<T>(key: string, defaultValue: T): Promise<T> {
  const database = await getDB();
  const val = await database.get('app-state', key);
  return val !== undefined ? (val as T) : defaultValue;
}

export async function setStateValue(key: string, value: unknown) {
  const database = await getDB();
  await database.put('app-state', value, key);
}
