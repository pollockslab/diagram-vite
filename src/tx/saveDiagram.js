
export default async function saveDiagram(ctx, { id, ui, parentID, tabID }) 
{
    // id 없으면 uuid 추가
    if(!id) id = ctx.generateUUID();
    
    await ctx.put('diagram', {id, ui, parentID, tabID});

    return id;
}