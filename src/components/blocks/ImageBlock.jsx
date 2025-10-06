import React, { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

const ImageBlock = ({ block, onUpdate, isPreviewMode = false }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate(block.id, { 
          src: e.target.result,
          alt: file.name 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const blockStyle = {
    padding: `${block.paddingY || 16}px ${block.paddingX || 16}px`,
    margin: `${block.marginY || 8}px ${block.marginX || 0}px`,
    borderRadius: `${block.borderRadius || 0}px`,
    textAlign: block.alignment || 'center',
  };

  return (
    <div style={blockStyle}>
      {block.src ? (
        <img
          src={block.src}
          alt={block.alt || 'Image'}
          className="max-w-full h-auto rounded-lg shadow-md cursor-pointer"
          style={{
            width: block.width === 'custom' ? block.customWidth : block.width || 'auto',
            height: block.height === 'custom' ? block.customHeight : block.height || 'auto',
          }}
          onClick={isPreviewMode ? undefined : () => fileInputRef.current?.click()}
        />
      ) : (
        !isPreviewMode && <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium mb-2">Click to upload image</p>
          <p className="text-gray-500 text-sm">JPG, PNG, GIF up to 10MB</p>
        </div>
      )}
      
      {!isPreviewMode && <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />}
    </div>
  );
};

export default ImageBlock;