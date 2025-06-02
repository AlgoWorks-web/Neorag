// src/components/Common/FileUpload.js
import React, { useState, useRef } from 'react';
import { FaUpload, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const FileUpload = ({ 
  onFileSelect, 
  accept = "*", 
  multiple = false,
  label = "",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = multiple ? e.dataTransfer.files : e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = multiple ? e.target.files : e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (multiple) {
      setFileName(`${file.length} files selected`);
    } else {
      setFileName(file.name);
    }
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFileName('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptText = () => {
    if (accept === 'image/*') return 'Images (JPG, PNG, GIF)';
    if (accept === 'video/*') return 'Videos (MP4, MOV, AVI)';
    if (accept === 'audio/*') return 'Audio (MP3, WAV)';
    if (accept.includes('.pdf')) return 'PDF Documents';
    return 'Any file type';
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        `}
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <FaCloudUploadAlt className={`text-4xl mb-2 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <div className="mt-2 w-full">
            {fileName ? (
              <div className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                <span className="truncate text-sm text-gray-700 flex-grow mr-2 text-left">
                  {fileName}
                </span>
                <button 
                  type="button" 
                  onClick={clearFile}
                  className="text-gray-500 hover:text-red-500 flex-shrink-0"
                  aria-label="Clear file"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getAcceptText()}
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={handleButtonClick}
          >
            <FaUpload className="mr-1.5" />
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;