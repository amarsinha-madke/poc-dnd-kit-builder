import React, { memo } from 'react';
import TextBlock from './blocks/TextBlock';
import ButtonBlock from './blocks/ButtonBlock';
import FormBlock from './blocks/FormBlock';
import ImageBlock from './blocks/ImageBlock';


const BlockRenderer = ({ block, children = [], selectedBlock, onUpdate, onSelect, onDelete, isSelected, isPreviewMode = false }) => {
  const blockComponents = {
    text: TextBlock,
    button: ButtonBlock,
    form: FormBlock,
    image: ImageBlock,
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