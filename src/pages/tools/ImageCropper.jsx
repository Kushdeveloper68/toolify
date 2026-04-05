import { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Crop } from 'lucide-react';
import { readFileAsDataURL } from '../../utils/fileUtils';

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState('');
  const [crop, setCrop] = useState({ x:0, y:0, w:100, h:100, dragging:false, resizing:false, startX:0, startY:0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [result, setResult] = useState('');

  const handleFile = async (f) => {
    setFile(f);
    const url = await readFileAsDataURL(f);
    setSrc(url);
    setResult('');
    setCrop({ x:10, y:10, w:80, h:80, dragging:false, resizing:false });
  };

  const doCrop = () => {
    const img = imgRef.current;
    if (!img) return;
    const { naturalWidth: nw, naturalHeight: nh, width: dw, height: dh } = img;
    const scaleX = nw / dw, scaleY = nh / dh;
    const cont = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const relX = imgRect.left - cont.left;
    const relY = imgRect.top - cont.top;
    const px = ((crop.x / 100) * dw) * scaleX;
    const py = ((crop.y / 100) * dh) * scaleY;
    const pw = ((crop.w / 100) * dw) * scaleX;
    const ph = ((crop.h / 100) * dh) * scaleY;
    const canvas = document.createElement('canvas');
    canvas.width = pw; canvas.height = ph;
    canvas.getContext('2d').drawImage(img, px, py, pw, ph, 0, 0, pw, ph);
    setResult(canvas.toDataURL('image/png'));
  };

  return (
    <ToolLayout title="Image Cropper" description="Crop images visually in your browser" icon={Crop}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFile} accept={{'image/*':[]}} label="Drop image here to crop" file={file} />
      </div>
      {src && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-4">
            <label className="label">Adjust Crop Area</label>
            <div ref={containerRef} className="relative inline-block w-full">
              <img ref={imgRef} src={src} alt="Source" className="max-w-full rounded" />
              <div className="absolute border-2 border-blue-500 pointer-events-none" style={{
                left:`${crop.x}%`, top:`${crop.y}%`, width:`${crop.w}%`, height:`${crop.h}%`
              }}>
                <div className="absolute inset-0 bg-blue-500/10"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {['x','y','w','h'].map(k => (
                <div key={k}>
                  <label className="label text-xs">{k === 'x' ? 'X offset %' : k === 'y' ? 'Y offset %' : k === 'w' ? 'Width %' : 'Height %'}</label>
                  <input type="range" min={0} max={k==='x'||k==='y'?80:10} step={1} value={crop[k]}
                    onChange={e => setCrop(c => ({...c,[k]:Number(e.target.value)}))} className="w-full" />
                  <span className="text-xs text-gray-400">{crop[k]}%</span>
                </div>
              ))}
            </div>
            <button onClick={doCrop} className="btn-primary mt-3 w-full">Crop Image</button>
          </div>
          {result && (
            <div className="card p-4">
              <label className="label">Result</label>
              <img src={result} alt="Cropped" className="max-w-full rounded mb-3" />
              <a href={result} download="cropped.png" className="btn-primary">Download</a>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
