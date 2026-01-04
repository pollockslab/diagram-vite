
export default async function loadTab(ctx, {tabID}) 
{
    // tab 조회해오기
    const tab = await ctx.get('tab', tabID);
    if (!tab) throw new Error('tab not found');

    // diagram.parentID 가 null 일 경우 최상위 다이어그램들(null 도 정상)
    const diagrams = await ctx.getByIndex('diagram', 'byParentID', tab.openDiagramID);

    return {tab: tab, diagrams: diagrams};
}
