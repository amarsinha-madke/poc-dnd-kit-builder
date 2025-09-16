import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BlockRenderer from './BlockRenderer';
import { GripVertical, Trash2 } from 'lucide-react';

const SortableBlock = ({ block, childBlocks = [], selectedBlock, isSelected, onSelect, onUpdate, onDelete, isPreviewMode = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e) => {
    // Always stop propagation to prevent parent layout from being selected
    e.stopPropagation();
    
    // Don't re-select if already selected and clicking on interactive elements
    const target = e.target;
    const isInteractiveElement = target.matches('input, textarea, select, button, a, [contenteditable="true"], .ql-editor, .ql-toolbar, .ql-container, .ql-container *, .ql-picker, .ql-picker *, .ql-formats, .ql-formats *');
    
    if (isSelected && isInteractiveElement) {
      return;
    }
    
    onSelect(block);
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isSelected && !isPreviewMode ? 'ring-2 ring-blue-500' : ''
      } rounded-lg`}
      onClick={isPreviewMode ? undefined : handleClick}
      onKeyDown={isPreviewMode ? undefined : (e) => {
        // Don't interfere with text editing
        const target = e.target;
        if (target.matches('.ql-editor, .ql-editor *')) {
          return;
        }
        e.stopPropagation();
      }}
    >
      {/* Block Controls */}
      <div className={`absolute -top-10 left-0 flex items-center space-x-2 z-10 ${
        isPreviewMode ? 'hidden' : 
        isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity`}>
        <button
          {...attributes}
          {...listeners}
          className="p-1 bg-gray-600 text-white rounded cursor-grab hover:bg-gray-700"
        >
          <GripVertical size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <BlockRenderer 
        block={block} 
        children={childBlocks}
        selectedBlock={selectedBlock}
        onUpdate={onUpdate}
        onSelect={onSelect}
        onDelete={onDelete}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
      />
    </div>
  );
};

export default memo(SortableBlock);
