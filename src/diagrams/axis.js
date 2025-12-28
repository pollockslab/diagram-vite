/**
 * 도형의 공간을 저장하는 클래스
 */
export class _MAIN 
{
    constructor(args={})
    {
        this.type = "none";
        this._axis = {x: 0, y: 0, width: 100, height: 100};
        
        // 캡처용 캔버스
        const cav = document.createElement("canvas");
        const ctx = cav.getContext("2d");
        this._capture = {cav: cav, ctx: ctx};
        
        // 자식 도형 저장공간
        this._children = [];
        
    }

    get x()
    {
        return Math.round(this._axis.x);
    }
    set x(x)
    {
        this._axis.x = Math.round(x);
    }

    get y()
    {
        return Math.round(this._axis.y);
    }
    set y(y)
    {
        this._axis.y = Math.round(y);
    }

    get width()
    {
        return this._axis.width;
    }
    set width(width)
    {
        this._axis.width = Math.round(width);
    }
    
    get height()
    {
        return this._axis.height;
    }
    set height(height)
    {
        this._axis.height = Math.round(height);
    }

    get capture()
    {
        return this._capture.cav;
    }
    get capture()
    {
        return this._capture.ctx;
    }

    get children()
    {
        return this._children;
    }
}