import { _MAIN as _AXIS } from './axis.js'
import { _CSS, _CU } from '../imports.js'

export class _MAIN extends _AXIS
{
    constructor(args={})
    {
        super();
        this.type = "point";
        this.x = args.x ?? 0;
        this.y = args.y ?? 0;
        this.w = 301;
        this.h = 301;
        this.cx = 151;
        this.cy = 151;
        this.color = args.color ?? 'white';

        // draw 초기화
        this._draw = {
            ctx: args.ctxDraw ?? null
        };

        // css 초기화
        const cav = this._capture.cav;
        const ctx = this._capture.ctx;
        _CU.SetCanvasDPR(cav, ctx, this.w, this.h);

        ctx.font = `${_CSS.fontWeight} ${_CSS.fontSize}px ${_CSS.fontFamily}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.Render();
    }

    Render()
    {
        const cav = this._capture.cav;
        const ctx = this._capture.ctx;
        const radius = 4;

        ctx.clearRect(0,0,cav.width,cav.height);
        ctx.fillText(`( ${this.x}, ${this.y} )`, this.w/2, this.h/2+_CSS.textHeight);
        ctx.beginPath();
        ctx.arc(this.w/2, this.h/2, radius, Math.PI*2, false);
        ctx.fill();
    }

    Draw(parent)
    {
        if(this._draw.ctx == null) return;
        
        const x = parent.PixelX(this.x)-this.cx;
        const y = parent.PixelY(this.y)-this.cy;
        const w = this.w;
        const h = this.h;

        this._draw.ctx.drawImage(
            this._capture.cav, 
            0, 0, this._capture.cav.width, this._capture.cav.height,
            x, y, w, h);
    }
}