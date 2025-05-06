// src/services/localDB.ts
import { openDB } from 'idb';
import type { Product } from '@/store/modules/products';

const DB_NAME = 'brandk-db';
const STORE_NAME = 'offline-products';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveProductOffline(product: Product) {
  const db = await getDB();
  await db.put(STORE_NAME, product);
}

export async function getOfflineProducts(): Promise<Product[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function clearOfflineProducts() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}
