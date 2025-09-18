import React, { useState } from 'react';

const FormBlock = ({ block, onUpdate, isSelected, isPreviewMode = false, onSelect }) => {
  const [emailValue, setEmailValue] = useState('');
  const handleTitleChange = (e) => {
    onUpdate(block.id, { title: e.target.value });
  };
  const handleEmailPlaceholderChange = (e) => {
    onUpdate(block.id, { emailPlaceholder: e.target.value });
  };
  const handleButtonTextChange = (e) => {
    onUpdate(block.id, { buttonText: e.target.value });
  };
  const handleSubmit = (e) => {
    if (!isPreviewMode) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    alert(`Submitted email: ${emailValue}`);
    setEmailValue('');
  };
  const blockStyle = {
    padding: `${block.paddingY || 16}px ${block.paddingX || 16}px`,
    margin: `${block.marginY || 8}px ${block.marginX || 0}px`,
    textAlign: block.textAlign || 'left',
    backgroundColor: block.backgroundColor || 'transparent',
    borderRadius: `${block.borderRadius || 0}px`,
    width: block.width === 'custom' ? block.customWidth : block.width || 'auto',
  };

  return (
    <div style={blockStyle} onClick={(e) => { e.stopPropagation(); if (!isPreviewMode && onSelect && !isSelected) onSelect(block); }}>
      {}
      {isSelected && !isPreviewMode ? (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-600">Form Title</label>
          <input
            type="text"
            value={block.title || ''}
            onChange={handleTitleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Form title..."
          />
          <label className="block text-xs font-medium text-gray-600">Email placeholder</label>
          <input
            type="text"
            value={block.emailPlaceholder || 'Enter your email'}
            onChange={handleEmailPlaceholderChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Email placeholder..."
          />
          <label className="block text-xs font-medium text-gray-600">Submit button text</label>
          <input
            type="text"
            value={block.buttonText || 'Submit'}
            onChange={handleButtonTextChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Button text..."
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {block.title ? <h3 className="text-lg font-semibold">{block.title}</h3> : null}
          <div>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder={block.emailPlaceholder || 'Email address'}
              required
              className="w-full border rounded px-3 py-2"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 rounded shadow inline-block"
              onClick={(e) => { }}
            >
              {block.buttonText || 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FormBlock;
