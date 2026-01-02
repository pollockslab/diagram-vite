import { _ENGINE } from './imports.js'
import { _MAIN as _PAGE_DIRECTORY } from './pages/directory/directory.js'
import { _MAIN as _PAGE_FAVORITE } from './pages/favorite/favorite.js'
import { _MAIN as _PAGE_MENU } from './pages/menu/menu.js'
import { _MAIN as _PAGE_VIEW } from './pages/view/view.js'
import { _MAIN as _PAGE_CONTROLLER } from './pages/view/controller.js'
import { _MAIN as _STORAGE } from './storage/storage.js'


const divApp = document.querySelector('#app');


export const _STOR = new _STORAGE();

export const _MENU = LoadPage(_PAGE_MENU, "menu");
export const _FAVO = LoadPage(_PAGE_FAVORITE, "favorite");

export const _DIRC = LoadPage(_PAGE_DIRECTORY, "directory");
export const _VIEW = LoadPage(_PAGE_VIEW, "view");
export const _CTRL = LoadPage(_PAGE_CONTROLLER, "controller");


// [초기화]
// 1. 엔진로드
// 2. 화면구성
// 3. DB로드
// 4. 화면에 작업물 입력
const Init = async () => {
    
    
};
Init();


/**
 * 페이지 객체 생성
 * @param {class} page
 * @param {string} id
 * @returns pageObject
 */
function LoadPage(page, id)
{
    const div = document.createElement('div');
    div.id = id;
    divApp.appendChild(div);
    const pageObject = new page({parentNode: div});
    
    return pageObject;
}