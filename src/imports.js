// config
// import _CONFIG from './config.json'
// import _CONFIG from './config.json' assert { type: 'json' };

// diagrams
import { _MAIN as _AXIS } from './diagrams/axis.js'

// engines
import { _MAIN as _ELEMENT } from './engines/element.js'
import { _MAIN as _INDEXEDDB } from './engines/indexeddb.js'

// import
export const _IMPORT = 
{
    // config: _CONFIG,
    diagrams: {
        axis: _AXIS,
    },
    engines: {
        element: _ELEMENT,
        indexeddb: _INDEXEDDB,
    },
}