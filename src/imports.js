
// diagrams
import { _MAIN as _AXIS } from './diagrams/axis.js'
import { _MAIN as _POINT } from './diagrams/point.js'

// engines
import { _MAIN as _ELEMENT } from './engines/element.js'
import { _MAIN as _INDEXEDDB } from './engines/indexedDB.js'
import { _CANVAS_UTILS } from './engines/canvasUtils.js'

export const _DIAGRAM = {
    axis: _AXIS,
    point: _POINT,
}
export const _ENGINE = {
    element: _ELEMENT,
    indexedDB: _INDEXEDDB,
}
export const _CU = _CANVAS_UTILS;

export const _CSS = (function()
{
    const styles = getComputedStyle(document.documentElement);
    const cssRoot = {};

    // diagrams style
    cssRoot.fontFamily = styles.getPropertyValue('font-family');
    cssRoot.fontSize = parseFloat(styles.getPropertyValue('font-size'));
    cssRoot.fontWeight = parseFloat(styles.getPropertyValue('font-weight'));
    cssRoot.textHeight = Math.round(cssRoot.fontSize*1.3);

    return cssRoot;
})();