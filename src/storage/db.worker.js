
import { _SCHEMA } from './schema.js'
console.log('worker alive')

// db.worker.js
let db = null;

// 메시지 ID로 요청/응답 매칭
self.onmessage = async (e) => {
    console.log('worker onmessage:', e.data);
    self.postMessage(`db.worker --> storage: ${e.data}`);
}
 
//   const { id, type, payload } = e.data;
    
//   try {
//     if (type === 'init') {
//       if (!db) db = await openDB();
//       self.postMessage({ id, ok: true });
//       return;
//     }

//     if (!db) throw new Error('DB not initialized');

//     if (type === 'getNode') {
//       const tx = db.transaction('nodes', 'readonly');
//       const store = tx.objectStore('nodes');
//       const result = await store.get(payload.id);
//       self.postMessage({ id, ok: true, result });
//     }

//     if (type === 'putNode') {
//       const tx = db.transaction('nodes', 'readwrite');
//       tx.objectStore('nodes').put(payload);
//       await tx.done;
//       self.postMessage({ id, ok: true });
//     }

//   } catch (err) {
//     self.postMessage({ id, ok: false, error: err.message });
//   }
// };

// // DB 열기 함수
// async function openDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open('diagramDB', 1);

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains('nodes')) {
//         db.createObjectStore('nodes', { keyPath: 'id' });
//       }
//     };

//     request.onsuccess = (event) => resolve(event.target.result);
//     request.onerror = (event) => reject(event.target.error);
//   });
// }
