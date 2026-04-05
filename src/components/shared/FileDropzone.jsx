import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

export default function FileDropzone({ onFile, accept, label, file, multiple = false }) {
  const onDrop = useCallback(files => {
    if (multiple) onFile(files);
    else if (files[0]) onFile(files[0]);
  }, [onFile, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, multiple
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center gap-3 justify-center">
          <File size={20} className="text-blue-500" />
          <div className="text-left">
            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{Array.isArray(file) ? `${file.length} files selected` : file.name}</p>
            {!Array.isArray(file) && <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>}
          </div>
        </div>
      ) : (
        <div>
          <Upload size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">{label || 'Drop file here or click to upload'}</p>
          <p className="text-xs text-gray-400 mt-1">Click to browse files</p>
        </div>
      )}
    </div>
  );
}
