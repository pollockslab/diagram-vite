
export const _SCHEMA = 
{
    version: 2,
    work_date: '2025-12-31 00:33',
    tables: [
        {
            name: 'version_history',
            desc: '업로드한 버전정보 기록',
            column: ["id", "version", "versionPrev", "workDate", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: true
            },
            index: [
                {key:'byVersion', column:'version', options:{unique:false}},
                // {key:'byTime', column:'timestamp', options:{unique:false}},
            ]
        },
        {   
            name: 'log',
            desc: '오류정보, 탭 불러오기, 가져오기 기록',
            column: ["id", "code", "ext", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: true
            },
            index: [
                {key:'byCode', column:'code', options:{unique:false}},
            ]
        },
        {
            name: 'setting',
            desc: '설정',
            column: ["id", "tab"],
            options: {
                keyPath: 'id',
                autoIncrement: true
            },
            index: []
        },
        {
            name: 'tab',
            desc: '새 창 열기. json 내보내기 단위',
            column: ["id", "space", "favorites", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: false
            },
            index: []
        },
        {
            name: 'space',
            desc: '도형, 라인들을 품은 공간. 상자 하나당 가지고 있는 공간',
            column: ["id", "info", "directory", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: false
            },
            index: []
        },
        {
            name: 'diagram',
            desc: '도형(클래스, 함수, 메모), 라인(기본선, 점선등)',
            column: ["id", "info", "parent", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: false
            },
            index: []
        },
    ]
}