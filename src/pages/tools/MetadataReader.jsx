import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Info } from 'lucide-react';

export default function MetadataReader() {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState(null);
  const [preview, setPreview] = useState('');

  const handleFile = (f) => {
    setFile(f);
    const data = {
      'File Name': f.name,
      'File Size': (f.size / 1024).toFixed(2) + ' KB',
      'MIME Type': f.type || 'Unknown',
      'Last Modified': new Date(f.lastModified).toLocaleString(),
    };
    if (f.type.startsWith('video/') || f.type.startsWith('audio/')) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      const el = f.type.startsWith('video/') ? document.createElement('video') : document.createElement('audio');
      el.src = url;
      el.onloadedmetadata = () => {
        const d = Math.floor(el.duration);
        data['Duration'] = `${Math.floor(d/60)}:${String(d%60).padStart(2,'0')}`;
        if (el.videoWidth) { data['Resolution'] = `${el.videoWidth} × ${el.videoHeight}`; }
        setMeta({...data});
      };
    } else {
      setMeta(data);
    }
  };

  return (
    <ToolLayout title="Media Metadata Reader" description="Read metadata from media files" icon={Info}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFile} accept={{'video/*':[],'audio/*':[],'image/*':[]}} label="Drop any media file here" file={file} />
      </div>
      {meta && (
        <div className="card p-4">
          <h3 className="font-semibold mb-3">File Metadata</h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(meta).map(([k,v]) => (
                <tr key={k} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 font-medium text-gray-500 w-1/3">{k}</td>
                  <td className="py-2 text-gray-900 dark:text-gray-100">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview && file?.type.startsWith('video/') && (
            <video src={preview} controls className="mt-4 w-full max-h-64 rounded-lg" />
          )}
          {preview && file?.type.startsWith('audio/') && (
            <audio src={preview} controls className="mt-4 w-full" />
          )}
        </div>
      )}
    </ToolLayout>
  );
}
