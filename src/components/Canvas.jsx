import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableBlock from './SortableBlock';

const Canvas = ({ 
  blocks,
  allBlocks = [],
  getChildBlocks = () => [],
  selectedBlock, 
  setSelectedBlock, 
  updateBlock, 
  deleteBlock, 
  previewMode,
  isPreviewMode = false
}) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-full';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-100">
      <div className={`mx-auto bg-white min-h-screen shadow-lg rounded-lg ${getCanvasWidth()}`}>
        <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="p-6 min-h-screen">
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">Drop content blocks here</div>
                  <div className="text-gray-500 text-sm">Drag blocks from the sidebar to start building</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    childBlocks={block.type === 'layout' ? getChildBlocks(block.id) : []}
                    selectedBlock={selectedBlock}
                    isSelected={selectedBlock?.id === block.id}
                    onSelect={setSelectedBlock}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    isPreviewMode={isPreviewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default Canvas;