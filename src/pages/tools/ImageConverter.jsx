import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { ImagePlus } from 'lucide-react';
import { readFileAsDataURL } from '../../utils/fileUtils';

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.92);

  const handleFile = async (f) => {
    setFile(f);
    const url = await readFileAsDataURL(f);
    setPreview(url);
  };

  const convert = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img,0,0);
      const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
      const q = format === 'image/png' ? undefined : quality;
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download=`converted.${ext}`; a.click();
        URL.revokeObjectURL(url);
      }, format, q);
    };
    img.src = preview;
  };

  return (
    <ToolLayout title="Image Converter" description="Convert between PNG, JPG, and WEBP formats" icon={ImagePlus}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          <FileDropzone onFile={handleFile} accept={{'image/*':[]}} label="Drop image file (PNG, JPG, WEBP, GIF...)" file={file} />
          {preview && <img src={preview} alt="Preview" className="mt-4 max-h-64 rounded-lg mx-auto" />}
        </div>
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Convert to</label>
            <select className="select" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
          {format !== 'image/png' && (
            <div>
              <label className="label">Quality: {Math.round(quality*100)}%</label>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
            </div>
          )}
          <button onClick={convert} disabled={!file} className="btn-primary w-full">Convert & Download</button>
        </div>
      </div>
    </ToolLayout>
  );
}
