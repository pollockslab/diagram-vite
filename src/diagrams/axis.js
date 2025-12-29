/**
 * 도형의 공간을 저장하는 클래스
 */
export class _MAIN 
{
    constructor(args={})
    {
        this.type = "none";
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        
        // 캡처용 캔버스
        const cav = document.createElement("canvas");
        const ctx = cav.getContext("2d");
        this._capture = {cav: cav, ctx: ctx};
        
        // 자식 도형 저장공간
        this._children = [];
    }

    SetData(args={})
    {
        Object.entries(args).forEach(([key, value]) => {
            this[key] = value;
        });
    }

}