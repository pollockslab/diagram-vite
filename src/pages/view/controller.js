import { _VIEW } from '../../main.js'

export class _MAIN
{
    constructor(args={})
    {
        const div = args.parentNode;

        div.addEventListener('contextmenu', async (e) =>
        {
            e.preventDefault();
        });
        div.addEventListener('wheel', async (e) =>
        {
            if     (e.deltaY > 0) _VIEW.zoom += 0.1;
            else if(e.deltaY < 0) _VIEW.zoom -= 0.1;
            else return;

            _VIEW.Draw();
        }, {passive: true});
        div.addEventListener('mousedown', (e) =>
        {
            this.down = {};
            this.down.offsetX = e.offsetX;
            this.down.offsetY = e.offsetY;
            this.down.xView = _VIEW.x;
            this.down.yView = _VIEW.y;
        });
        div.addEventListener('mousemove', (e) =>
        {
            if(!this.down) return;

            const xRange = _VIEW.SpaceLine(e.offsetX-this.down.offsetX);
            const yRange = _VIEW.SpaceLine(e.offsetY-this.down.offsetY);
            
            _VIEW.x = this.down.xView - xRange;
            _VIEW.y = this.down.yView - yRange;
            
            _VIEW.Draw();
        });
        div.addEventListener('mouseup', (e) =>
        {
            if(!this.down) return;
            this.down = null;
        });
        div.addEventListener('mouseleave', (e) =>
        {
            if(!this.down) return;
            this.down = null;
        });
    }
}