import { _DIAGRAM, _ENGINE, _CSS, _CU } from '../../imports.js'
import { _CTRL, _STOR } from '../../main.js'
// import './view.css'

/**
 * 도형 그리는 화면
 */
export class _MAIN extends _DIAGRAM.axis
{
    constructor(args={})
    {
        super(args);
        
        this.scope = {
            dpr: 1, min: 1, max: 6, zoom: 1,
            width: 0, height: 0
        };

        this.layers = {};
        this.InitLayers(args.parentNode);


        window.addEventListener('resize', (e) => { this.Resize(); });
        this.Resize();

        this.diagrams = [];
        // this.LoadDiagrams();

        this.Loop();

        
        /**
         *  카피본으로 그리는 상황
         *  다시 그리는 상황: 스크롤, 이동시
         * 
         *  [백그라운드]
         *  1. 룰러: 마-캡처복사, 스-다시그리고 복사
         *  2. 영점표시: 마-캡처복사, 스-캡처복사(원래 큰걸로 캡처)
         * 
         *  [보드]
         *  1. 도형: 마, 스- 원본크기로 캡처복사
         *  2. 선: 생각을 해봐야되는데
         *  
         *  [효과]
         *  1. 도형 하이라이트: 마,스 - 원본크기로 캡처복사
         */
    }

    Loop = () =>
    {
        if(this.isDataUpdate) {
            this.DataUpdate();
            this.isDataUpdate = false;
        }
        if(this.isLogUpdate) {
            this.LogUpdate();
            this.isLogUpdate = false;
        }

        if(this.isDragging || this.isResizing || this.isLoading) {
            this.Draw();
            this.isDragging = false;
            this.isResizing = false;
            this.isLoading  = false;
        }
        requestAnimationFrame(this.Loop);
    }

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

    async LoadDiagrams(tabID)
    {
        this.tabID = tabID;
        this.InitChildren();
        
        const loadTab = await _STOR.Call('loadTab', {tabID: tabID});
        if(!loadTab) return;
        const diagrams = loadTab.diagrams;
        if(!diagrams) return;
        this.id = loadTab.tab.openDiagramID;
        
        for(const dInfo of diagrams) {
            
            if(!dInfo.ui || !_DIAGRAM[dInfo.ui.type]) continue;

            const item = new _DIAGRAM[dInfo.ui.type]({
                // x:0, y:0, color: 'white', 
            });
            item.SetData(dInfo);
            item.Render();

            this.AddChild(item);
        }
        // console.log(this.children)
        // 중심점 생성
        // const p1 = new _DIAGRAM.point({
        //     x:-100, y:-100, color: 'red',
        // });
        // await p1.Save({parentID: this.id, tabID: this.tabID});

        // this.AddChild(p1);
        // console.log(p1);

        this.isLoading = true;
    }

    InitLayers(parentNode)
    {
        this.layers = {};
        ['background', 'board', 'effect'].forEach((value) =>
        {
            this.layers[value] = {};
            this.layers[value].cav = new _ENGINE.element({
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

    Resize()
    {
        this.scope.width = window.innerWidth;
        this.scope.height = window.innerHeight;

        Object.values(this.layers).forEach(layer => 
        {
            _CU.SetCanvasDPR(layer.cav, layer.ctx, 
                window.innerWidth, window.innerHeight);
            // canvas 중심을 0점으로 적용
            layer.ctx.translate(window.innerWidth/2, window.innerHeight/2);
        });

        this.isResizing = true;
    }

    SpaceX(xPixel)
    {
        return this.x + Math.round((xPixel-this.scope.width/2)*this.zoom);
    }
    SpaceY(yPixel)
    {
        return this.y + Math.round((yPixel-this.scope.height/2)*this.zoom);
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

        ['none', 'point'].forEach((value) => 
        {
            const list = this.children[value];
            for(const item of list) {
                item.Draw(this, this.layers.board.ctx);
            }
        });
    }

    DrawRuler()
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        
        const x = -this.scope.width/2 + 10;
        const y = -this.scope.height/2 + 10;
        const w = 100;
        const h = this.scope.height - 20;
        const r = 8;
        ctx.fillStyle = 'rgba(44, 44, 54, 1)';
        // ctx.beginPath();
        // ctx.roundRect(x, y, w, h, Math.min(r, w/2, h/2));
        ctx.fillRect(x, y, w, h);
        // ctx.fill();
    }

    DrawBackground()
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const cav = this.layers.background.cav;

        const xStep = 100;
        const xStart = -this.x % xStep;
        if(xStart > 0) {xStart - xStep}

        const yStep = 200;
        const yStart = -this.y % yStep;
        if(yStart > 0) {yStart - yStep}
         
        ctx.save();
        ctx.strokeStyle = 'rgba(64, 64, 64, 1)';
        // ctx.lineWidth = 4;
        ctx.beginPath();
        // const w = this.scope.width/2;
        const h = this.scope.height;

        for(let i=xStart-this.scope.width; i<=this.scope.width; i+=xStep) {
            
            const iPixel = this.PixelLine(i);
            // console.log(iPixel, h);
            ctx.moveTo(iPixel -h, yStart-h);
            ctx.lineTo(iPixel +h, yStart+h);

            ctx.moveTo(iPixel -h, yStart+h);
            ctx.lineTo(iPixel +h, yStart-h);
        }
        ctx.stroke();
        ctx.restore();
    }

    DrawPoint(xSpace, ySpace, color)
    {
        if(!this.layers.background) return;
        const ctx = this.layers.background.ctx;
        const x = this.PixelX(xSpace);
        const y = this.PixelY(ySpace);

        ctx.save();
        ctx.font = `${_CSS.fontWeight} ${_CSS.fontSize}px ${_CSS.fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`( ${xSpace}, ${ySpace} )`, x, y+_CSS.textHeight);
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