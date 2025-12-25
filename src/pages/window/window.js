import { _IMPORT } from '../../imports.js'

/**
 * 도형 그리는 화면
 */
export class _MAIN 
{
    constructor(args={})
    {
        
        console.log("win 실행", args.parentNode)
        console.log("win 실행2", _IMPORT.config)
    }
}

// 1. json 파일 읽어서 보여주기 -> indexeddb 저장불가고, 읽기전용임
// 2. indexeddb 파일 읽어서 보여주기