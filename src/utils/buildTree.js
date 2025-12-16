export default function buildTree(members){
    const map = {}
    const roots = []
    members.forEach(member => map[member.id]={...member, children:[]});
    members.forEach(member=>{
        if(member.parentId) map[member.parentId]?.children.push(map[member.id])
        else roots.push(map[member.id])
    })
    return roots[0]
}