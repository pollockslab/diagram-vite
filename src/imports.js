// config
import _CONFIG from './config.json'

// diagrams
import { _MAIN as _AXIS } from './diagrams/axis.js'

// engines
import { _MAIN as _INDEXEDDB } from './engines/indexeddb.js'

// pages
import { _MAIN as _DIRECTORY } from './pages/directory/directory.js'
import { _MAIN as _FAVORITE } from './pages/favorite/favorite.js'
import { _MAIN as _MENU } from './pages/menu/menu.js'
import { _MAIN as _WINDOW } from './pages/window/window.js'


export const _IMPORT = 
{
    config: _CONFIG,
    diagrams: {
        axis: _AXIS,
    },
    engines: {
        indexeddb: _INDEXEDDB,
    },
    pages: {
        directory: _DIRECTORY,
        favorite: _FAVORITE,
        menu: _MENU,
        window: _WINDOW
    },
    
}
