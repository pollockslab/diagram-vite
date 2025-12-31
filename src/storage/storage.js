
// import { _SCHEMA } from './schema.js'

export class _MAIN 
{
    constructor(args={})
    {
        this.worker;

        const isVite = typeof import.meta !== "undefined" && import.meta.env;
        const isLiveServer = !isVite;

        if (isLiveServer) {
            // Live Server
            this.worker = new Worker("./db.worker.js", { type: "module" });
        } else {
            // Vite dev + Vite build
            this.worker = new Worker(
                new URL("./db.worker.js", import.meta.url),
                { type: "module" }
            );
        }

        this.worker.onmessage = async (e) => {
            console.log('storage onmessage', e.data);
        }
        this.worker.onerror = async (e) => {
            console.log('storage err', e.message);
        }
        
        this.worker.postMessage('storage ==> worker');

    }
}