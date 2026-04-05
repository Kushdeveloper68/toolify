import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { ScanLine } from 'lucide-react';
import * as Exifr from 'exifr';

export default function ExifReader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (f) => {
    setFile(f);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
    try {
      const exif = await Exifr.parse(f, true);
      setData(exif);
    } catch(e) {
      setData({ error: 'No EXIF data found or unsupported file' });
    }
    setLoading(false);
  };

  const formatValue = (v) => {
    if (v === null || v === undefined) return 'N/A';
    if (typeof v === 'object' && !(v instanceof Array)) return JSON.stringify(v);
    if (Array.isArray(v)) return v.join(', ');
    return String(v);
  };

  return (
    <ToolLayout title="EXIF Reader" description="Read EXIF metadata from photo files" icon={ScanLine}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFile} accept={{'image/jpeg':['.jpg','.jpeg'],'image/tiff':['.tiff']}} label="Drop JPEG/TIFF image here" file={file} />
      </div>
      {loading && <p className="text-gray-400 text-sm">Reading EXIF data...</p>}
      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {preview && (
            <div className="card p-4">
              <img src={preview} alt="Preview" className="rounded-lg w-full object-cover max-h-64" />
            </div>
          )}
          <div className={`${preview ? 'lg:col-span-2' : 'lg:col-span-3'} card p-4`}>
            {data.error ? <p className="text-gray-500">{data.error}</p> : (
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(data).map(([k,v]) => (
                      <tr key={k} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-4 font-medium text-gray-600 dark:text-gray-400 w-1/3">{k}</td>
                        <td className="py-1.5 text-gray-900 dark:text-gray-100 font-mono text-xs break-all">{formatValue(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
