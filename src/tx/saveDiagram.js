
export default async function saveDiagram(ctx, { nodes }) 
{
    await ctx.delAll('nodes', nodes.map(n => n.id));
    await ctx.putAll('nodes', nodes);

    return true;
}