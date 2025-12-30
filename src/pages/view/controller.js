import { _DIAGRAM, _ENGINE, _CSS, _CU, _TU } from '../../imports.js'
import { _VIEW } from '../../main.js'

export class _MAIN
{
    constructor(args={})
    {
        const div = args.parentNode;
        
        // Mouse Event
        div.addEventListener('contextmenu', async (e) =>
        {
            e.preventDefault();
        });
        div.addEventListener('wheel', async (e) =>
        {
            if     (e.deltaY > 0) _VIEW.zoom += 0.1;
            else if(e.deltaY < 0) _VIEW.zoom -= 0.1;
            else return;

            _VIEW.isDragging = true;
        }, {passive: true});
        div.addEventListener('mousedown', e => {
            this.PanStart(e.offsetX, e.offsetY);
        });

        div.addEventListener('mousemove', e => {
            this.PanMove(e.offsetX, e.offsetY);
        });

        div.addEventListener('mouseup', () => {
            this.PanEnd();
        });

        div.addEventListener('mouseleave', () => {
            this.PanEnd();
        });



        // Touch Event
        div.addEventListener('touchstart', (e) =>
        {
            if (e.touches.length === 1) {
                // === pan 시작 ===
                const t = e.touches[0];
                this.PanStart(t.clientX, t.clientY);
            }
            if (e.touches.length === 2) {
                // === pinch 시작 ===
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;

                this.pinch = {
                    dist: Math.hypot(dx, dy)
                };
            }
        }, {passive: false});
        div.addEventListener('touchmove', (e) =>
        {
            // === pan ===
            if (e.touches.length === 1) {
                const t = e.touches[0];
                this.PanMove(t.clientX, t.clientY);
                e.preventDefault(); // 스크롤 방지
            }
            // === pinch zoom ===
            if (e.touches.length === 2 && this.pinch) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;
                const dist = Math.hypot(dx, dy);

                const delta = this.pinch.dist - dist; // wheel delta처럼 사용
                this.pinch.dist = dist;

                // === wheel과 동일한 방식으로 처리 ===
                if (delta > 0) _VIEW.zoom += 0.05;
                else if (delta < 0) _VIEW.zoom -= 0.05;

                _VIEW.isDragging = true;
                e.preventDefault();
            }
        }, {passive: false});
        div.addEventListener('touchend', (e) =>
        {
            if (e.touches.length === 0) {
                this.panEnd();
                this.pinch = null;
            }

            if (e.touches.length === 1) {
                // pinch → pan 전환 대비
                this.pinch = null;
            }
        });
    }

    PanStart(screenX, screenY) {
        this.down = {
            offsetX: screenX,
            offsetY: screenY,
            xView: _VIEW.x,
            yView: _VIEW.y
        };

        _VIEW.isDragging = true;
    }

    PanMove(screenX, screenY) {
        if (!this.down) return;

        const xRange = _VIEW.SpaceLine(screenX - this.down.offsetX);
        const yRange = _VIEW.SpaceLine(screenY - this.down.offsetY);

        _VIEW.x = this.down.xView - xRange;
        _VIEW.y = this.down.yView - yRange;

        _VIEW.isDragging = true;
    }

    PanEnd() {
        this.down = null;
    }
}