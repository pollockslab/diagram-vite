import { _SCHEMA } from './schema.js';

let db = null;

/* ---------------------------
   Handlers (업무 / DB 명령)
---------------------------- */

const handlers = 
{
    /* ---------- transaction ---------- */

    

    /* ---------- system ---------- */

    async init() {
        if (!db) db = await openDB();
        return true;
    },

    /* ---------- CRUD ---------- */

    async get({ table, key }) {
        assertTable(table);
        const store = getStore(table);
        return await idbGet(store, key);
    },

    async put({ table, data }) {
        assertTable(table);
        const store = getStore(table, 'readwrite');
        await idbPut(store, data);
        return true;
    },

    async putList({ table, list }) {
        assertTable(table);
        const store = getStore(table, 'readwrite');

        for (const item of list) {
            await idbPut(store, item);
        }

        return true;
    },

    async del({ table, key }) {
        assertTable(table);
        const store = getStore(table, 'readwrite');
        await idbDelete(store, key);
        return true;
    },

    async delList({ table, list }) {
        assertTable(table);
        const store = getStore(table, 'readwrite');

        for (const key of list) {
            await idbDelete(store, key);
        }

        return true;
    },

    async clear({ table }) {
        assertTable(table);
        const store = getStore(table, 'readwrite');
        store.clear();
        return true;
    },
};

self.onmessage = async (e) => {
    const { id, type, payload } = e.data;

    try {
        if (!handlers[type]) {
            throw new Error(`Unknown command: ${type}`);
        }

        const result = await handlers[type](payload);
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
   Helpers
---------------------------- */

function assertTable(table) {
    if (!TABLES.has(table)) {
        throw new Error(`Invalid table: ${table}`);
    }
}

function getStore(table, mode = 'readonly') {
    const tx = db.transaction(table, mode);
    return tx.objectStore(table);
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

/* ---------------------------
   IndexedDB helper functions
---------------------------- */

function idbGet(store, key) {
    return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function idbPut(store, value) {
    return new Promise((resolve, reject) => {
        const req = store.put(value);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

function idbDelete(store, key) {
    return new Promise((resolve, reject) => {
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

