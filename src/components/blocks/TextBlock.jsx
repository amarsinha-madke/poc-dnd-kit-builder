import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextBlock = ({ block, onUpdate, onSelect, isSelected, isPreviewMode = false }) => {
  const quillRef = useRef(null);
  const containerRef = useRef(null);

  const handleContentChange = (content) => {
    onUpdate(block.id, { content });
  };

  // Manage ReactQuill focus and initialization
  useEffect(() => {
    if (isSelected && !isPreviewMode && quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (quill) {
        // Delay focus to ensure proper initialization
        setTimeout(() => {
          try {
            quill.focus();
            // Preserve cursor position at the end of content
            const length = quill.getLength();
            if (length > 1) {
              quill.setSelection(length - 1, 0);
            }
          } catch (error) {
            console.warn('Quill focus error:', error);
          }
        }, 150);
      }
    }
  }, [isSelected, isPreviewMode]);

  // Prevent event bubbling for editor interactions
  const handleEditorClick = (e) => {
    e.stopPropagation();
  };

  const handleEditorKeyDown = (e) => {
    // Prevent event bubbling for all keyboard events to avoid conflicts with drag-and-drop
    e.stopPropagation();
  };

  const handleEditorMouseDown = (e) => {
    // Prevent drag operations when interacting with the editor
    e.stopPropagation();
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
    if (!isPreviewMode && onSelect && !isSelected) {
      onSelect(block);
    }
  };
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'color', 'background', 'align', 'code-block'
  ];

  const blockStyle = {
    fontSize: block.fontSize || '16px',
    fontFamily: block.fontFamily || 'inherit',
    color: block.textColor || '#000000',
    backgroundColor: block.backgroundColor || 'transparent',
    padding: `${block.paddingY || 16}px ${block.paddingX || 16}px`,
    margin: `${block.marginY || 8}px ${block.marginX || 0}px`,
    textAlign: block.textAlign || 'left',
    borderRadius: `${block.borderRadius || 0}px`,
    width: block.width === 'custom' ? block.customWidth : block.width || 'auto',
  };

  return (
    <div 
      ref={containerRef}
      style={blockStyle} 
      className="min-h-20 text-block-container"
      onClick={handleContainerClick}
    >
      {isSelected && !isPreviewMode ? (
        <div 
          className="relative z-10" 
          onClick={handleEditorClick}
          onKeyDown={handleEditorKeyDown}
          onMouseDown={handleEditorMouseDown}
        >
          <ReactQuill
            ref={quillRef}
            key={`quill-${block.id}`}
            value={block.content || ''}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing..."
            theme="snow"
            style={{ 
              position: 'relative', 
              zIndex: 10,
              isolation: 'isolate'
            }}
          />
        </div>
      ) : (
        <div 
          className="prose max-w-none cursor-pointer"
          dangerouslySetInnerHTML={{ 
            __html: block.content || '<p>Click to edit text</p>' 
          }}
        />
      )}
    </div>
  );
};

export default TextBlock;