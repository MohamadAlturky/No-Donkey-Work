import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import "./contextMenu.css"
export default function CustomContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onEdit,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);
  const deleteNode = useCallback(() => {
    setNodes((nodes) => {
      let newNodes = nodes.filter((node) => node.id !== id)
      newNodes = newNodes.filter((node) => node.parentId !== id)
      return newNodes
    });
    // setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <>
      <div
        style={{ top, left, right, bottom }}
        className="custom-context-menu"
        {...props}
      >
        <div onClick={duplicateNode}>Duplicate
          <span class="ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400">⌘</span>
        </div>
        <div onClick={deleteNode}>Delete
          <span class="ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400">⌘</span>
        </div>
        <div onClick={()=>{onEdit(id)}}>Edit Name
          <span class="ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400">⌘</span>
        </div>
      </div>
      
    </>
  );
}