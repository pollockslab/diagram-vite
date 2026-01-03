
export default async function updateDiagram(ctx, { spaceId, info }) 
{
    const space = await ctx.get('space', spaceId);
    if (!space) throw new Error('space not found');

    const diagram = await ctx.get('diagram', space.diagramID);
    if (!diagram) throw new Error('diagram not found');

    diagram.info = info;
    await ctx.put('diagram', diagram);

    return true;
}
