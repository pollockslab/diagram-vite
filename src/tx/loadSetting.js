
export default async function loadSetting(ctx, {}) 
{
    // setting 조회해오기
    let setting = await ctx.get('setting', 1);

    // setting 이 없을경우 최초 접속이라 판단하고 기본정보 입력
    if (!setting) {
        await ctx.put('log', {code: 'tx', ext: 'loadSetting. first enter', timestamp: Date.now()});

        // 다이어그램 생성
        // column: ["id", "ui", "children", "parent", "timestamp"],
        const diagramID = ctx.generateUUID();
        await ctx.put('diagram', {
            id: diagramID, ui: null, 
            children: null, parent: null, timestamp: Date.now()});

        // 탭 생성
        // column: ["id", "openDiagramID", "favorites", "timestamp"],
        const tabID = ctx.generateUUID();
        await ctx.put('tab', {
            id: tabID, openDiagramID: diagramID,
            favorites: null, timestamp: Date.now()});

        await ctx.put('setting', {openTabID: tabID});
        setting = await ctx.get('setting', 1);
    }

    
    // 세팅의 탭아이디의 실제 데이터가 없을경우 새로생성(삭제되었을 경우)
    if(await ctx.get('tab', setting.openTabID) === null) {
        await ctx.put('log', {code: 'tx', ext: 'loadSetting. new tab', timestamp: Date.now()});

        // 다이어그램 생성
        // column: ["id", "ui", "children", "parent", "timestamp"],
        const diagramID = ctx.generateUUID();
        await ctx.put('diagram', {
            id: diagramID, ui: null, 
            children: null, parent: null, timestamp: Date.now()});

        // 탭 생성
        // column: ["id", "openDiagramID", "favorites", "timestamp"],
        const tabID = ctx.generateUUID();
        await ctx.put('tab', {
            id: tabID, openDiagramID: diagramID,
            favorites: null, timestamp: Date.now()});

        await ctx.put('setting', {openTabID: tabID});
        setting = await ctx.get('setting', 1);
    }

    return setting;
}
