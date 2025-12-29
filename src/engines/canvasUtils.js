
const _DPR = Math.round(window.devicePixelRatio) || 1;

export const _CANVAS_UTILS = {
    SetCanvasDPR(cav, ctx, width, height)
    {
        cav.width = width * _DPR;
        cav.height = height * _DPR;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // 기존 transform 초기화 후 scale 적용
        ctx.scale(_DPR, _DPR);
    },
} 
