// src/services/localDB.ts
import { openDB } from 'idb';
import type { Product } from '@/store/modules/products';
import type { Coupon } from '@/store/modules/coupons';

const DB_NAME = 'brandk-db';
const STORE_NAME_PRODUCTS = 'offline-products';
const STORE_NAME_COUPONS = 'offline-coupons';

export async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME_PRODUCTS)) {
        db.createObjectStore(STORE_NAME_PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_COUPONS)) {
        db.createObjectStore(STORE_NAME_COUPONS, { keyPath: 'id' });
      }
    },
  });
}

// Product-related methods
export async function saveProductOffline(product: Product) {
  const db = await getDB();
  await db.put(STORE_NAME_PRODUCTS, product);
}

export async function getOfflineProducts(): Promise<Product[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME_PRODUCTS);
}

export async function clearOfflineProducts() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME_PRODUCTS, 'readwrite');
  await tx.objectStore(STORE_NAME_PRODUCTS).clear();
  await tx.done;
}

// دوال الكوبونات
export async function saveCouponOffline(coupon: Coupon) {
  const db = await getDB();
  await db.put(STORE_NAME_COUPONS, coupon);
}

export async function getOfflineCoupons(): Promise<Coupon[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME_COUPONS);
}

export async function clearOfflineCoupons() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME_COUPONS, 'readwrite');
  await tx.objectStore(STORE_NAME_COUPONS).clear();
  await tx.done;
}
