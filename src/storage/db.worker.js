import { _SCHEMA } from './schema.js';
import * as transactions from '../tx/TRAN_LIST.js';

let db = null;

/* ---------------------------
   message handler
---------------------------- */

self.onmessage = async (e) => {
    const { id, type, payload } = e.data;

    try {
        /* ---------- system ---------- */

        if (type === 'init') {
            if (!db) db = await openDB();
            self.postMessage({ id, ok: true });
            return;
        }

        if (!db) {
            throw new Error('DB not initialized');
        }

        /* ---------- transaction ---------- */

        const txFn = transactions[type];
        if (!txFn) {
            throw new Error(`Unknown transaction: ${type}`);
        }
        
        const ctx = createCtx(db);
        const result = await txFn(ctx, payload);

        self.postMessage({ id, ok: true, result });
    }
    catch (err) {
        self.postMessage({
            id,
            ok: false,
            error: err?.message ?? String(err),
        });
    }
};

/* ---------------------------
   Context
---------------------------- */

function createCtx(db) {
    return {
        /* ---------- read ---------- */

        get(table, key) {
            const store = getStore(db, table);
            return req(store.get(key));
        },

        /* ---------- write ---------- */

        put(table, value) {
            const tx = db.transaction(table, 'readwrite');
            const store = tx.objectStore(table);
            store.put(value);

            return txDone(tx);
        },

        putAll(table, list) {
            const tx = db.transaction(table, 'readwrite');
            const store = tx.objectStore(table);

            for (const item of list) {
                store.put(item);
            }

            return txDone(tx);
        },

        del(table, key) {
            const tx = db.transaction(table, 'readwrite');
            const store = tx.objectStore(table);
            store.delete(key);

            return txDone(tx);
        },

        delAll(table, keys) {
            const tx = db.transaction(table, 'readwrite');
            const store = tx.objectStore(table);

            for (const key of keys) {
                store.delete(key);
            }

            return txDone(tx);
        },

        clear(table) {
            const tx = db.transaction(table, 'readwrite');
            const store = tx.objectStore(table);
            store.clear();

            return txDone(tx);
        },
         
        generateUUID
    };
}

/* ---------------------------
   Helpers
---------------------------- */

const TABLES = new Set(_SCHEMA.tables.map(t => t.name));

function assertTable(table) {
    if (!TABLES.has(table)) {
        throw new Error(`Invalid table: ${table}`);
    }
}

function getStore(db, table, mode = 'readonly') {
    assertTable(table);
    return db.transaction(table, mode).objectStore(table);
}

function req(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function txDone(tx) {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

/* ---------------------------
   DB open
---------------------------- */

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('diagramDB', _SCHEMA.version);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const tx = event.target.transaction;

            _SCHEMA.tables.forEach(table => {
                let store;

                if (!db.objectStoreNames.contains(table.name)) {
                    store = db.createObjectStore(table.name, table.options);
                } else {
                    store = tx.objectStore(table.name);
                }

                table.index?.forEach(idx => {
                    if (!store.indexNames.contains(idx.key)) {
                        store.createIndex(idx.key, idx.column, idx.options);
                    }
                });

                if (table.name === 'version_history') {
                    store.put({
                        version: event.newVersion,
                        versionPrev: event.oldVersion || null,
                        workDate: _SCHEMA.work_date,
                        timestamp: Date.now()
                    });
                }
            });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function generateUUID() 
{
  // 1. 최신 환경 (가장 빠르고 안전)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 2. fallback: RFC 4122 v4
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);

    // version (4)
    buf[6] = (buf[6] & 0x0f) | 0x40;
    // variant (RFC 4122)
    buf[8] = (buf[8] & 0x3f) | 0x80;

    let i = 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const v = buf[i++] & 0x0f;
      return (c === 'x' ? v : (v & 0x3) | 0x8).toString(16);
    });
  }

  // 3. 최후의 보루 (거의 안 타지만)
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}