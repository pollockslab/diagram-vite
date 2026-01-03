
export const _SCHEMA = 
{
    version: 1,
    work_date: '2026-01-03 07:35',
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
                // {key:'byVersion', column:'version', options:{unique:false}},
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
            column: ["id", "openTabID"],
            options: {
                keyPath: 'id',
                autoIncrement: true
            },
            index: []
        },
        {
            name: 'tab',
            desc: '새 창 열기. json 내보내기 단위',
            column: ["id", "openDiagramID", "favorites", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: false
            },
            index: []
        },
        {
            name: 'diagram',
            desc: '도형(클래스, 함수, 메모), 라인(기본선, 점선등)',
            desc2: 'ui내용: 기본 x,y,w,h 그리고 각자 텍스트등, 라인은 연결 다이어그램등',
            column: ["id", "ui", "children", "parent", "timestamp"],
            options: {
                keyPath: 'id',
                autoIncrement: false
            },
            index: []
        },
    ]
}