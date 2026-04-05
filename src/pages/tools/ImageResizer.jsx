import { useState, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Maximize2 } from 'lucide-react';
import { readFileAsDataURL } from '../../utils/fileUtils';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [origSize, setOrigSize] = useState({w:0,h:0});
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState('');

  const handleFile = async (f) => {
    setFile(f);
    const url = await readFileAsDataURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setOrigSize({w:img.width,h:img.height}); setWidth(img.width); setHeight(img.height); };
    img.src = url;
    setResult('');
  };

  const onWidthChange = (v) => {
    setWidth(v);
    if (keepAspect && origSize.w) setHeight(Math.round(v * origSize.h / origSize.w));
  };
  const onHeightChange = (v) => {
    setHeight(v);
    if (keepAspect && origSize.h) setWidth(Math.round(v * origSize.w / origSize.h));
  };

  const resize = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width); canvas.height = Number(height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, Number(width), Number(height));
      setResult(canvas.toDataURL(format));
    };
    img.src = preview;
  };

  const download = () => {
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const a = document.createElement('a');
    a.href = result; a.download = `resized.${ext}`; a.click();
  };

  return (
    <ToolLayout title="Image Resizer" description="Resize images to custom dimensions" icon={Maximize2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <FileDropzone onFile={handleFile} accept={{'image/*':[]}} label="Drop image here" file={file} />
          </div>
          {result && (
            <div className="card p-4">
              <img src={result} alt="Resized" className="max-w-full rounded-lg mb-3" />
              <button onClick={download} className="btn-primary">Download Resized Image</button>
            </div>
          )}
        </div>
        <div className="card p-4 space-y-4">
          {origSize.w > 0 && <p className="text-xs text-gray-400">Original: {origSize.w} × {origSize.h}px</p>}
          <div>
            <label className="label">Width (px)</label>
            <input type="number" className="input" value={width} onChange={e => onWidthChange(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Height (px)</label>
            <input type="number" className="input" value={height} onChange={e => onHeightChange(Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)} />
            <span className="text-sm text-gray-600">Keep aspect ratio</span>
          </label>
          <div>
            <label className="label">Output Format</label>
            <select className="select" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
          <button onClick={resize} disabled={!file} className="btn-primary w-full">Resize Image</button>
        </div>
      </div>
    </ToolLayout>
  );
}
