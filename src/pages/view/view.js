import { _IMPORT } from '../../imports.js'
import { _CTRL } from '../../main.js'
// import './view.css'

/**
 * 도형 그리는 화면
 */
export class _MAIN
{
    constructor(args={})
    {
        this.x = 0;
        this.y = 0;
        this.scope = {
            dpr: 1, min: 1, max: 6, zoom: 2
        };
        this.layers = {};
        this.InitLayers(args.parentNode);

        this.cssRoot = {};
        this.CaptureRootCSS();

        window.addEventListener('resize', (e) => { this.Resize(); });
        this.Resize();

        // this.Loop();
    }

    // Loop = () =>
    // {
    //     this.Resize();
    //     requestAnimationFrame(this.Loop);
    // }

    get zoom()
    {
        return this.scope.zoom;
    }
    set zoom(size)
    {
        if(size >= this.scope.min && size <= this.scope.max) {
            this.scope.zoom = size;
        }
    }

    InitLayers(parentNode)
    {
        this.layers = {};
        ['background', 'board', 'effect'].forEach((value) =>
        {
            this.layers[value] = {};
            this.layers[value].cav = new _IMPORT.engines.element({
                type: 'canvas',
                parentNode: parentNode,
                class: `window ${value}`
            });
            this.layers[value].cav.style.position = 'absolute';
            this.layers[value].cav.style.width = '100%';
            this.layers[value].cav.style.height = '100%';
            this.layers[value].ctx = this.layers[value].cav.getContext('2d');
        });
    }

    CaptureRootCSS()
    {
        const styles = getComputedStyle(document.documentElement);
        this.cssRoot = {};
        this.cssRoot.fontFamily = styles.getPropertyValue('font-family');
        this.cssRoot.fontSize = parseFloat(styles.getPropertyValue('font-size'));
        this.cssRoot.fontWeight = parseFloat(styles.getPropertyValue('font-weight'));
        this.cssRoot.textHeight = Math.round(this.cssRoot.fontSize*1.3);
    }

    Resize()
    {
       
        const dpr =  window.devicePixelRatio || 1;
        this.scope.dpr = dpr;

        Object.values(this.layers).forEach(layer => 
        {
            layer.cav.width = window.innerWidth * dpr;
            layer.cav.height = window.innerHeight * dpr;
            layer.ctx.setTransform(1, 0, 0, 1, 0, 0);
            layer.ctx.scale(dpr, dpr);
            layer.ctx.translate(window.innerWidth/2, window.innerHeight/2);
        });
        this.Draw();
    }

    SpaceX(xPixel)
    {
        return this.x + Math.round(xPixel*this.zoom);
    }
    SpaceY(yPixel)
    {
        return this.y + Math.round(yPixel*this.zoom);
    }
    SpaceLine(pixel)
    {
        return Math.round(pixel*this.zoom);
    }

    PixelX(xSpace)
    {
        return Math.round((xSpace - this.x)/this.zoom);
    }
    PixelY(ySpace)
    {
        return Math.round((ySpace - this.y)/this.zoom);
    }
    PixelLine(space)
    {
        return Math.round(space/this.zoom);
    }

    Draw()
    {
        Object.values(this.layers).forEach(layer => 
        {
            const width = layer.cav.width;
            const height = layer.cav.height;
            layer.ctx.clearRect(-width/2, -height/2, width, height);
        });


        this.DrawBackground();
        
        this.DrawLine(100, 200, 200, 100, 'orange');
        this.DrawLine(0, 0, 200, 100, 'orange');
        this.DrawLine(0, 0, 100, 200, 'orange');

        this.DrawPoint(100, 200, 'green');
        this.DrawPoint(0, 0, 'yellow');
        this.DrawPoint(200, 100, 'blue');
        this.DrawPoint(50, 50, 'white');
        this.DrawPoint(100, 100, 'white');
        

    }

    DrawBackground()
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const cav = this.layers.background.cav;

        // xxxxx 모양으로 그린다
        // height/2 기준으로 피타고라스 정리로 알수 있자나
        // 100, 100 기준일 경우에 현재 중심점에서 -100 한걸로 더할값 구하자
        // -x좌표에서 시작해서 x를 100마다 그리는거지 width 넘길때까지
        const wSize = 100;
        const xStart = this.x % wSize;
        if(xStart > 0) {xStart - wSize}
         
        ctx.save();
        for(let i=xStart; i<=cav.width; i+=wSize) {
            // console.log(i)
        }
        ctx.restore();
    }

    DrawPoint(xSpace, ySpace, color)
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const x = this.PixelX(xSpace);
        const y = this.PixelY(ySpace);

        ctx.save();
        ctx.font = `${this.cssRoot.fontWeight} ${this.cssRoot.fontSize}px ${this.cssRoot.fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`( ${xSpace}, ${ySpace} )`, x, y+this.cssRoot.textHeight);
        ctx.beginPath();
        ctx.arc(x, y, 4, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    }

    DrawLine(xSpace1, ySpace1, xSpace2, ySpace2, color)
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const x1 = this.PixelX(xSpace1);
        const y1 = this.PixelY(ySpace1);
        const x2 = this.PixelX(xSpace2);
        const y2 = this.PixelY(ySpace2); 

        ctx.save();
        ctx.strokeStyle = color;
        // ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
}

// 1. json 파일 읽어서 보여주기 -> indexeddb 저장불가고, 읽기전용임
// 2. indexeddb 파일 읽어서 보여주기