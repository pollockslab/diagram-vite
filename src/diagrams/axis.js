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
        this.InitChildren();
    }
     
    InitChildren()
    {
        this.children = {
            none: [],
            point: [],
            square: [],
            line: [],
            button: [],
        };
    }

    SetData(args={})
    {
        Object.entries(args).forEach(([key, value]) => {
            this[key] = value;
        });
    }

    FindByID(diagramID)
    {
        for(const listKey in (this.children ?? {})) {
            for(const item of (this.children[listKey] ?? [])) {
                if(item.id === diagramID) return item;
            }
        }
        return null;
    }

    AddChild(diagram)
    {
        // 이미 존재하는 id면 종료
        if(this.FindByID(diagram.id)) return;

        this.children[diagram.type].push(diagram);
    }

    MoveChildLast(diagram)
    { 
        const list = this.children[diagram.type];
        if(!list) return;
        
        for(let i=0; i<list.length; i++) {
            if(list[i].id === diagram.id) {
                const [item,] = list.splice(i, 1);
                list.push(item);
                return;
            } 
        }
    }

    DeleteChild(diagram)
    {
        const list = this.children[diagram.type];
        if(!list) return;

        for(let i=0; i<list.length; i++) {
            if(list[i].id === diagram.id) {
                list.splice(i, 1);
                return true;
            } 
        }
    }

}