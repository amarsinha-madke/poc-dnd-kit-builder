import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Video, MousePointer, Layout, FileText, Mail } from 'lucide-react';

const blockTypes = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'button', label: 'Button', icon: MousePointer },
  { type: 'form', label: 'Form', icon: Mail },

];

const DraggableItem = ({ blockType, label, icon: Icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${blockType}`,
    data: {
      type: 'sidebar-item',
      blockType,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 cursor-grab hover:shadow-md transition-all duration-200 hover:border-blue-300"
    >
      <Icon size={20} className="text-blue-600" />
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-80 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Content Blocks</h2>
        
        <div className="space-y-3">
          {blockTypes.map((block) => (
            <DraggableItem
              key={block.type}
              blockType={block.type}
              label={block.label}
              icon={block.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;