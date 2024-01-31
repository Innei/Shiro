import { visit } from 'unist-util-visit'

export function attacher() {
  return transformer

  function transformer(tree) {
    console.log('tree', tree)
    visit(tree, 'text', (node, index, parent) => {
      console.log('texdt', node)
      const value = node.value
      const matches = value.match(/~~(.*?)~~/)
      if (matches) {
        const before = value.slice(0, matches.index)
        const after = value.slice(matches.index + matches[0].length)
        const strikethrough = {
          type: 'delete',
          children: [{ type: 'text', value: matches[1] }],
        }

        // Replace current node with multiple nodes if necessary
        const nodes = []
        if (before) {
          nodes.push({ type: 'text', value: before })
        }
        nodes.push(strikethrough)
        if (after) {
          nodes.push({ type: 'text', value: after })
        }
        parent.children.splice(index, 1, ...nodes)
      }
    })
  }
}
