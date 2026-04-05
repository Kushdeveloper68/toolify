import { useState, useCallback } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Minimize2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { formatFileSize } from '../../utils/fileUtils';

export default function ImageCompressor() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFiles = useCallback(async (accepted) => {
    const fileArr = Array.isArray(accepted) ? accepted : [accepted];
    setFiles(fileArr);
    setResults([]);
  }, []);

  const compress = async () => {
    setLoading(true);
    const out = [];
    for (const file of files) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          initialQuality: quality,
        });
        out.push({ name: file.name, original: file.size, compressed: compressed.size, blob: compressed });
      } catch(e) { out.push({ name: file.name, error: e.message }); }
    }
    setResults(out);
    setLoading(false);
  };

  const download = (result) => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compressed_' + result.name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Image Compressor" description="Compress images without significant quality loss" icon={Minimize2}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFiles} accept={{'image/*':[]}} label="Drop images here (JPG, PNG, WEBP)" file={files[0]} multiple />
        {files.length > 1 && <p className="text-sm text-gray-500 mt-2">{files.length} files selected</p>}
      </div>
      <div className="card p-4 mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="label">Quality: {Math.round(quality*100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="label">Max Size: {maxSizeMB} MB</label>
          <input type="range" min={0.1} max={10} step={0.1} value={maxSizeMB} onChange={e => setMaxSizeMB(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <button onClick={compress} disabled={!files.length || loading} className="btn-primary mb-4">
        {loading ? 'Compressing...' : 'Compress Images'}
      </button>
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm">{r.name}</p>
                {r.error ? <p className="text-red-500 text-xs">{r.error}</p> : (
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-gray-500">Before: {formatFileSize(r.original)}</span>
                    <span className="text-xs text-gray-500">After: {formatFileSize(r.compressed)}</span>
                    <span className="text-xs text-green-600 font-semibold">
                      Saved: {(((r.original-r.compressed)/r.original)*100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              {!r.error && <button onClick={() => download(r)} className="btn-primary text-xs">Download</button>}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
