import React from 'react';

const ButtonBlock = ({ block, onUpdate, isSelected, isPreviewMode = false }) => {
  const handleTextChange = (e) => {
    onUpdate(block.id, { text: e.target.value });
  };

  const blockStyle = {
    padding: `${block.paddingY || 16}px ${block.paddingX || 16}px`,
    margin: `${block.marginY || 8}px ${block.marginX || 0}px`,
    textAlign: block.alignment || 'center',
  };

  const buttonStyle = {
    backgroundColor: block.backgroundColor || '#3B82F6',
    color: block.textColor || '#FFFFFF',
    padding: `${block.buttonPaddingY || 12}px ${block.buttonPaddingX || 24}px`,
    borderRadius: `${block.borderRadius || 6}px`,
    fontSize: block.fontSize || '16px',
    fontWeight: block.fontWeight || '600',
    width: block.width === 'custom' ? block.customWidth : block.width || 'auto',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={blockStyle}>
      {isSelected && !isPreviewMode ? (
        <input
          type="text"
          value={block.text || ''}
          onChange={handleTextChange}
          className="text-center border border-gray-300 rounded px-4 py-2"
          placeholder="Button text..."
          style={{
            ...buttonStyle,
            border: '2px dashed #3B82F6',
            backgroundColor: 'transparent',
            color: '#3B82F6',
          }}
        />
      ) : (
        <a
          href={block.url || '#'}
          target={block.url ? '_blank' : '_self'}
          rel={block.url ? 'noopener noreferrer' : ''}
          style={buttonStyle}
          className="hover:opacity-90 transition-opacity inline-block text-center no-underline"
          onClick={(e) => isPreviewMode ? undefined : e.preventDefault()}
        >
          {block.text || 'Click Me'}
        </a>
      )}
    </div>
  );
};

export default ButtonBlock;