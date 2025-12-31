
// import { _SCHEMA } from './schema.js'

export class _MAIN 
{
    constructor(args={})
    {
        // Vite 배포시 하나의 스크립트로 묶기위해 Blob 형태로 Worker 생성
        const workerCode = `
            self.onmessage = (e) => {
                self.postMessage('Worker received: ' + e.data);
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));

        this.worker.onmessage = async (e) => {
            console.log('storage onmessage', e.data);
        }
        this.worker.onerror = async (e) => {
            console.log('storage err', e.message);
        }
        
        this.worker.postMessage('storage ==> worker');

    }
}