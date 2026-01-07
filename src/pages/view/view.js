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
            dpr: 1, min: 0.1, max: 1, zoom: 1,
            width: 0, height: 0
        };

        this.layers = {};
        this.InitLayers(args.parentNode);


        window.addEventListener('resize', (e) => { this.Resize(); });
        this.Resize();

        this.diagrams = [];
        // this.LoadDiagrams();

        this.Loop();
        this.hFlag = false;
        
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
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.scope.width  = w;
        this.scope.height = h;

        this.scope.wPixel = w;
        this.scope.hPixel = h;

        // 반 화면 기준 월드 범위
        this.scope.wSpace = this.SpaceLine(w / 2);
        this.scope.hSpace = this.SpaceLine(h / 2);

        Object.values(this.layers).forEach(layer =>
        {
            _CU.SetCanvasDPR(layer.cav, layer.ctx, w, h);

            // 중앙 기준 좌표계
            layer.ctx.translate(w / 2, h / 2);
        });

        this.isResizing = true;
    }


    SpaceX(xPixel)
    {
        return this.x + xPixel / this.zoom;
    }
    SpaceY(yPixel)
    {
        return this.y + yPixel / this.zoom;
    }
    SpaceLine(pixel)
    {
        return pixel / this.zoom;
    }

    PixelX(xSpace)
    {
        return (xSpace - this.x) * this.zoom;
    }
    PixelY(ySpace)
    {
        return (ySpace - this.y) * this.zoom;
    }
    PixelLine(space)
    {
        return space * this.zoom;
    }

    Draw()
    {
        Object.values(this.layers).forEach(layer => 
        {
            const ctx = layer.ctx;

            const w = this.scope.width;
            const h = this.scope.height;

            ctx.clearRect(-w/2, -h/2, w, h);
        });

        this.DrawBackground();
        this.DrawRuler();
        
        this.DrawLine(-200, -100, 200, 100, 'orange');
        this.DrawLine(-200, 100, 200, -100, 'orange');
        this.DrawLine(-200, 0, 200, -200, 'orange');
        this.DrawLine(-200, -200, 200, 0, 'orange');
        // ctx 로 그릴때 0,0 이 화면중심이란걸 명심해

        this.DrawPoint(0, 0, 'white');

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
        const layer = this.layers.background;
        if (!layer) return;

        const ctx = layer.ctx;

        const w = this.scope.width;
        const h = this.scope.height;
        const zoom = this.zoom;

        const step = 100; // 월드 단위

        ctx.save();

        /* =========================
            Ruler 판 배경
        ========================= */

        ctx.fillStyle = 'rgba(44, 44, 54, 1)';
        ctx.fillRect(-w/2, -h/2, 70, h);        // 세로자
        ctx.fillRect(-w/2,  h/2 - 70, w, 70);   // 가로자

        ctx.strokeStyle = 'rgb(64, 104, 124)';
        ctx.fillStyle = 'silver';
        ctx.font = `${12*this.zoom}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        /* =========================
            보이는 월드 범위 계산
        ========================= */

        const minX = Math.floor(this.SpaceX(-w/2) / step) * step;
        const maxX = Math.ceil (this.SpaceX( w/2) / step) * step;

        const minY = Math.floor(this.SpaceY(-h/2) / step) * step;
        const maxY = Math.ceil (this.SpaceY( h/2) / step) * step;

        /* =========================
            세로 룰러 (Y)
        ========================= */

        ctx.beginPath();
        for (let y = minY; y <= maxY; y += step)
        {
            const py = this.PixelY(y);

            ctx.moveTo(-w/2 + 50, py);
            ctx.lineTo(-w/2 + 70, py);

            ctx.fillText(y, -w/2 + 30, py);
        }
        ctx.stroke();

        /* =========================
            가로 룰러 (X)
        ========================= */

        ctx.beginPath();
        for (let x = minX; x <= maxX; x += step)
        {
            const px = this.PixelX(x);

            ctx.moveTo(px, h/2 - 70);
            ctx.lineTo(px, h/2 - 50);

            ctx.fillText(x, px, h/2 - 30);
        }
        ctx.stroke();

        /* =========================
            원점 강조
        ========================= */

        ctx.strokeStyle = 'rgb(224, 104, 124)';
        ctx.beginPath();

        ctx.moveTo(0, -h/2);
        ctx.lineTo(0,  h/2);

        ctx.moveTo(-w/2, 0);
        ctx.lineTo( w/2, 0);

        ctx.stroke();

        ctx.restore();
    }

    DrawBackground()
    {
        const layer = this.layers.background;
        if (!layer) return;

        const ctx = layer.ctx;

        const w = this.scope.width;
        const h = this.scope.height;

        // ===== 패턴 크기 (월드 단위) =====
        const sizeX = 200;
        const sizeY = 100;

        const halfX = sizeX / 2;
        const halfY = sizeY / 2;

        // ===== 화면에 보이는 월드 범위 =====
        // 꼭지점 기준이므로 half offset 추가
        const minX = Math.floor((this.SpaceX(-w / 2) - halfX) / sizeX) * sizeX;
        const maxX = Math.ceil ((this.SpaceX( w / 2) + halfX) / sizeX) * sizeX;

        const minY = Math.floor((this.SpaceY(-h / 2) - halfY) / sizeY) * sizeY;
        const maxY = Math.ceil ((this.SpaceY( h / 2) + halfY) / sizeY) * sizeY;

        ctx.save();

        ctx.lineWidth = 1;
        if (this.zoom < 0.5) {
            ctx.restore();
            return;
        }

        ctx.strokeStyle = 'rgb(64, 64, 64)';
        ctx.beginPath();

        // ===== 다이아몬드 (꼭지점 기준) =====
        for (let x = minX; x <= maxX; x += sizeX)
        {
            for (let y = minY; y <= maxY; y += sizeY)
            {
                // ★ 꼭지점 좌표 (월드)
                const vx = x;
                const vy = y;

                const px = this.PixelX(vx);
                const py = this.PixelY(vy);

                const hx = this.PixelLine(halfX);
                const hy = this.PixelLine(halfY);

                // ◇ (vertex at 0,0)
                ctx.moveTo(px,        py);        // 위 꼭지점
                ctx.lineTo(px + hx,   py + hy);
                ctx.lineTo(px,        py + sizeY * this.zoom);
                ctx.lineTo(px - hx,   py + hy);
                ctx.closePath();
            }
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
        ctx.arc(x, y, 4, 0, Math.PI*2);
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