import './main.css'
import { _IMPORT } from './imports.js'


// import 
new _IMPORT.pages.window({parentNode: document.querySelector('#app')});
new _IMPORT.pages.directory();
new _IMPORT.pages.menu();
// 초기화

// 1. 엔진로드
// 2. 화면구성
// 3. DB로드
// 4. 화면에 작업물 입력
