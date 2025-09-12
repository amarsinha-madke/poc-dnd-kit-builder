import React, { memo } from 'react';
import TextBlock from './blocks/TextBlock';


const BlockRenderer = ({ block, children = [], selectedBlock, onUpdate, onSelect, onDelete, isSelected, isPreviewMode = false }) => {
  const blockComponents = {
    text: TextBlock,
  };

  const Component = blockComponents[block.type];

  if (!Component) {
    return <div>Unknown block type: {block.type}</div>;
  }

  return (
    <Component 
      block={block} 
      children={children}
      selectedBlock={selectedBlock}
      onUpdate={onUpdate}
      onSelect={onSelect}
      onDelete={onDelete}
      isSelected={isSelected}
      isPreviewMode={isPreviewMode}
    />
  );
};

export default memo(BlockRenderer);