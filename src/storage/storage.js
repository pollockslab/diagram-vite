import { _DB_ERR_MSG } from './errorMsg.js';

export class _MAIN {
    constructor(args = {}) {
        this.worker = null;
        this.seq = 0;
        this.pending = new Map();

        const isVite = typeof import.meta !== "undefined" && import.meta.env;
        const isLiveServer = !isVite;

        this.worker = isLiveServer
            ? new Worker("./src/storage/db.worker.js", { type: "module" })
            : new Worker(new URL("./db.worker.js", import.meta.url), { type: "module" });

        // 초기화 메시지
        this.Call('init');
        
        
        /* ------------------------
           Worker response handler
        ------------------------ */

        this.worker.onmessage = (e) => {
            const { id, ok, result, error } = e.data;

            const pending = this.pending.get(id);
            if (!pending) return;

            this.pending.delete(id);

            if (ok) {
                pending.resolve(result);
            } else {
                pending.reject(error);

                console.warn(e.data);

                const errMsg = _DB_ERR_MSG(error?.name ?? error);
                alert(
                    `오류: ${errMsg.title}\n` +
                    `코드: ${errMsg.code}\n` +
                    `설명: ${errMsg.message}`
                );
            }
        };

        this.worker.onerror = (e) => {
            console.error("worker error:", e.message);
        };
    }

    /**
     * Worker에 "업무 의도"를 전달하는 유일한 통로
     * @param {string} command - worker command 이름
     * @param {object} payload - command 데이터
     */
    Call(command, payload) {
        return new Promise((resolve, reject) => {
            const id = ++this.seq;
            this.pending.set(id, { resolve, reject });
            this.worker.postMessage({
                id,
                type: command,
                payload
            });
        });
    }
}
