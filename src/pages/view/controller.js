import { _DIAGRAM, _ENGINE, _CSS, _CU } from '../../imports.js'
import { _VIEW, _STOR } from '../../main.js'

const WHEEL_ZOOM_FACTOR = 0.001;
const PINCH_ZOOM_FACTOR = 0.002;

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
        div.addEventListener('wheel', (e) =>
        {
            _VIEW.zoom -= e.deltaY * WHEEL_ZOOM_FACTOR;
            _VIEW.isDragging = true;
        }, { passive: true });
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
            // this.PanEnd();
            this.down = null;
        });

        // Touch Event
        div.addEventListener('touchstart', (e) =>
        {
            // === pan 시작 ===
            if (e.touches.length === 1 && this.touchMode !== 'pinch') {
                const t = e.touches[0];
                this.touchMode = 'pan';
                this.PanStart(t.clientX, t.clientY);
            }

            // === pinch 시작 ===
            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;

                this.touchMode = 'pinch';
                this.pinch = {
                    dist: Math.hypot(dx, dy)
                };
            }
        }, { passive: false });

        div.addEventListener('touchmove', (e) =>
        {
            // === pan ===
            if (this.touchMode === 'pan' && e.touches.length === 1) {
                const t = e.touches[0];
                this.PanMove(t.clientX, t.clientY);
                e.preventDefault();
            }

            // === pinch zoom ===
            if (this.touchMode === 'pinch' && e.touches.length === 2 && this.pinch) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];

                const dx = t1.clientX - t2.clientX;
                const dy = t1.clientY - t2.clientY;
                const dist = Math.hypot(dx, dy);

                const delta = this.pinch.dist - dist;
                this.pinch.dist = dist;

                _VIEW.zoom += delta * PINCH_ZOOM_FACTOR;

                _VIEW.isDragging = true;
                e.preventDefault();
            }
        }, { passive: false });

        div.addEventListener('touchend', (e) =>
        {
            // === pinch 중 손가락 하나라도 떨어지면 종료 ===
            if (this.touchMode === 'pinch' && e.touches.length < 2) {
                this.touchMode = null;
                this.pinch = null;
                return;
            }

            // === pan 종료 ===
            if (this.touchMode === 'pan' && e.touches.length === 0) {
                this.touchMode = null;
                this.panEnd();
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

    async PanEnd() {
        this.down = null;

        // const sto_init = await _STOR.putNode({id:"node-1", kimchi:1, tomato:2});
        // const node = await _STOR.getNode("node-1");
        // console.log("클릭", node);
    }
}