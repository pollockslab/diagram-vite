
import { _SCHEMA } from './schema.js'

export class _MAIN 
{
    constructor(args={})
    {
        // 'Live Server', 'Vite' 실행에 따라 다르게 워커생성
        const port = window.location.port;
        const workerPath = port === '5500'
            ? '/src/storage/db.worker.js' // Live Server
            : new URL('./db.worker.js', import.meta.url); // Vite chunck

        
        this.worker = new Worker(workerPath, { type: 'module' });
        
        
        this.worker.onmessage = async (e) => {
            console.log('storage onmessage', e.data);
        }
        this.worker.onerror = async (e) => {
            console.log('storage err', e.message);
        }
        
        this.worker.postMessage('storage send to db.worker');

    }
}