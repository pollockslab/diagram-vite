
export default async function loadSetting(ctx, {}) 
{
    // setting 조회해오기
    let setting = await ctx.get('setting', 1);

    // setting 이 없을경우 최초 접속이라 판단하고 기본정보 입력
    if (!setting || !await ctx.get('tab', setting.openTabID)) {
        await ctx.put('log', {code: 'tx', ext: 'loadSetting. first enter', timestamp: Date.now()});

        // 탭 생성
        const tabID = ctx.generateUUID();
        await ctx.put('tab', {
            id: tabID, openDiagramID: null,
            favorites: null, timestamp: Date.now()});

        await ctx.put('setting', {openTabID: tabID});
        setting = await ctx.get('setting', 1);
    }

    return setting;
}
