import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { generateId } from '../utils/helpers';

const PageBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [pageName, setPageName] = useState('Untitled Page');

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      return;
    }

    // Handle adding new blocks from sidebar
    if (active.data.current?.type === 'sidebar-item') {
      const blockType = active.data.current.blockType;
      const newBlock = {
        id: generateId(),
        type: blockType,
        ...blockTypes[blockType].defaultProps,
      };
      
      // Check if dropping into a layout column
      if (over.data.current?.type === 'layout-column') {
        newBlock.parentId = over.data.current.layoutId;
        newBlock.columnIndex = over.data.current.columnIndex;
      }
      
      setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      return;
    }

    // Handle reordering existing blocks
    if (active.id !== over.id) {
      // Handle dropping into layout columns
      if (over.data.current?.type === 'layout-column') {
        setBlocks((prevBlocks) => {
          return prevBlocks.map(item => {
            if (item.id === active.id) {
              return {
                ...item,
                parentId: over.data.current.layoutId,
                columnIndex: over.data.current.columnIndex,
              };
            }
            return item;
          });
        });
        return;
      }
      
      setBlocks((prevBlocks) => {
        const oldIndex = prevBlocks.findIndex((item) => item.id === active.id);
        const newIndex = prevBlocks.findIndex((item) => item.id === over.id);
        return arrayMove(prevBlocks, oldIndex, newIndex);
      });
    }

    requestAnimationFrame(() => setActiveId(null));
  }, []);

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(prevBlocks => prevBlocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, []);

  const deleteBlock = useCallback((blockId) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  const handleSelectBlock = useCallback((block) => {
    setSelectedBlock(block);
  }, []);

  // Get main blocks (not in layout columns) and child blocks for layouts
  const mainBlocks = blocks.filter(block => !block.parentId);
  const getChildBlocks = useCallback((parentId) => blocks.filter(block => block.parentId === parentId), [blocks]);

  const exportAsHTML = () => {
    const renderBlockToHTML = (block) => {
      const getBlockStyle = (block) => {
        const styles = [];
        if (block.paddingY || block.paddingX) {
          styles.push(`padding: ${block.paddingY || 16}px ${block.paddingX || 16}px`);
        }
        if (block.marginY || block.marginX) {
          styles.push(`margin: ${block.marginY || 8}px ${block.marginX || 0}px`);
        }
        if (block.borderRadius) {
          styles.push(`border-radius: ${block.borderRadius}px`);
        }
        if (block.backgroundColor && block.backgroundColor !== 'transparent') {
          styles.push(`background-color: ${block.backgroundColor}`);
        }
        if (block.textColor) {
          styles.push(`color: ${block.textColor}`);
        }
        if (block.fontSize) {
          styles.push(`font-size: ${block.fontSize}`);
        }
        if (block.fontFamily && block.fontFamily !== 'inherit') {
          styles.push(`font-family: ${block.fontFamily}`);
        }
        if (block.textAlign) {
          styles.push(`text-align: ${block.textAlign}`);
        }
        return styles.join('; ');
      };

      const style = getBlockStyle(block);

      switch (block.type) {
        case 'text':
          const textContent = block.content || '<p>Text content</p>';
          return `<div${style ? ` style="${style}"` : ''}>${textContent}</div>`;
        case 'image':
          if (!block.src) return '';
          const imgStyle = [];
          if (block.width && block.width !== 'auto') {
            imgStyle.push(`width: ${block.width === 'custom' ? block.customWidth : block.width}`);
          }
          if (block.height && block.height !== 'auto') {
            imgStyle.push(`height: ${block.height === 'custom' ? block.customHeight : block.height}`);
          }
          imgStyle.push('max-width: 100%', 'height: auto');
          return `<div${style ? ` style="${style}"` : ''}><img src="${block.src}" alt="${block.alt || 'Image'}" style="${imgStyle.join('; ')}" /></div>`;
        case 'video':
          if (!block.src) return '';
          return `<div${style ? ` style="${style}"` : ''}><video controls style="max-width: 100%; height: auto;"><source src="${block.src}" type="video/mp4">Your browser does not support the video tag.</video></div>`;
        case 'button':
          const buttonStyle = `
            background-color: ${block.backgroundColor || '#3B82F6'};
            color: ${block.textColor || '#FFFFFF'};
            padding: ${block.buttonPaddingY || 12}px ${block.buttonPaddingX || 24}px;
            border-radius: ${block.borderRadius || 6}px;
            font-size: ${block.fontSize || '16px'};
            font-weight: ${block.fontWeight || '600'};
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          `;
          const buttonElement = block.url ? 
            `<a href="${block.url}" style="${buttonStyle}">${block.text || 'Click Me'}</a>` :
            `<button style="${buttonStyle}">${block.text || 'Click Me'}</button>`;
          return `<div${style ? ` style="${style}"` : ''}>${buttonElement}</div>`;
        case 'form':
          return `<div${style ? ` style="${style}"` : ''}>
            <form>
              <h3>${block.title || 'Contact Form'}</h3>
              <input type="text" placeholder="Name" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;" />
              <input type="email" placeholder="Email" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;" />
              <textarea placeholder="Message" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px; height: 100px;"></textarea>
              <button type="submit" style="background-color: #3B82F6; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
            </form>
          </div>`;
        case 'layout':
          const columns = block.columns || 2;
          const columnWidth = `${(100 / columns).toFixed(2)}%`;
          const childBlocks = blocks.filter(b => b.parentId === block.id);
          const columnHTML = Array.from({ length: columns }).map((_, index) => {
            const columnBlocks = childBlocks.filter(b => b.columnIndex === index);
            const columnContent = columnBlocks.map(renderBlockToHTML).join('');
            return `<div style="width: ${columnWidth}; float: left; padding: 0 ${(block.columnGap || 24) / 2}px; box-sizing: border-box;">${columnContent}</div>`;
          }).join('');
          return `<div${style ? ` style="${style}"` : ''}><div style="overflow: hidden; display: block;">${columnHTML}<div style="clear: both;"></div></div></div>`;
        default:
          return `<div${style ? ` style="${style}"` : ''}>Unknown block type</div>`;
      }
    };

    const mainBlocks = blocks.filter(block => !block.parentId);
    const bodyContent = mainBlocks.map(renderBlockToHTML).join('\n');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName}</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
        }
        * { 
            box-sizing: border-box; 
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        video {
            max-width: 100%;
            height: auto;
        }
        form {
            max-width: 600px;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: inherit;
        }
        button {
            cursor: pointer;
            font-family: inherit;
        }
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            body {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
${bodyContent}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pageName.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Visual Page Builder</h1>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Page Name:</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  placeholder="Enter page name"
                />
              </div>
            </div>
            
          </div>
          
          {/* Canvas */}
          <Canvas
            blocks={mainBlocks}
            allBlocks={blocks}
            getChildBlocks={getChildBlocks}
            selectedBlock={selectedBlock}
            setSelectedBlock={handleSelectBlock}
            updateBlock={updateBlock}
            deleteBlock={deleteBlock}
          />
        </div>
        
        {/* Properties Panel */}
        {selectedBlock && (
          <PropertiesPanel
            selectedBlock={selectedBlock}
            updateBlock={updateBlock}
            onClose={() => setSelectedBlock(null)}
          />
        )}
      </div>
      
      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 shadow-lg">
            <div className="text-blue-800 font-medium">
              {activeId.includes('sidebar') ? 'New Block' : 'Moving Block'}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PageBuilder;