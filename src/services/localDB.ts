// src/services/localDB.ts
import { openDB } from 'idb';
import type { Product } from '@/store/modules/products';
import type { Coupon } from '@/store/modules/coupons';
import type { Order } from '@/store/modules/orders';

const DB_NAME = 'brandk-db';
const STORE_NAME_PRODUCTS = 'offline-products';
const STORE_NAME_COUPONS = 'offline-coupons';
const STORE_NAME_SALES = 'offline-sales';
const STORE_NAME_ORDERS = 'offline-orders';

export async function getDB() {
  return openDB(DB_NAME, 4, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME_PRODUCTS)) {
        db.createObjectStore(STORE_NAME_PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_COUPONS)) {
        db.createObjectStore(STORE_NAME_COUPONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_SALES)) {
        db.createObjectStore(STORE_NAME_SALES, {keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_ORDERS)) {
        db.createObjectStore(STORE_NAME_ORDERS, { keyPath: 'id' });
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

interface Sale {
  id?: number; // جعله اختياريًا لأن الـ ID سيتولد تلقائيًا
  items: Product[];
  coupon: string | null;
  totals: any;
  timestamp: number;
}

export async function saveSaleOffline(sale: Omit<Sale, 'id'>): Promise<number | undefined> {
  const db = await getDB();
  const safeItems = JSON.parse(JSON.stringify(sale));
  try {
    const id = await db.add(STORE_NAME_SALES, {
      items: safeItems.items,
      coupon: safeItems.coupon,
      totals: safeItems.totals,
      timestamp: sale.timestamp,
    });
    return id as number;
  } catch (e) {
    console.error('❌ خطأ أثناء حفظ المنتجات:', e);
    return undefined;
  }
}

export async function getOfflineSales(): Promise<Sale[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME_SALES);
}

export async function deleteOfflineSale(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME_SALES, id);
}

export async function clearOfflineSales() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME_SALES, 'readwrite');
  await tx.objectStore(STORE_NAME_SALES).clear();
  await tx.done;
}


// دوال الطلبات
export async function saveOrderOffline(order: Order) {
  const db = await getDB();
  await db.put(STORE_NAME_ORDERS, order);
}

export async function getOfflineOrders(): Promise<Order[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME_ORDERS);
}

export async function clearOfflineOrders() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME_ORDERS, 'readwrite');
  await tx.objectStore(STORE_NAME_ORDERS).clear();
  await tx.done;
}