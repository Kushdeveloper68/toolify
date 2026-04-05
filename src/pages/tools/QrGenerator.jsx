import { useState, useEffect, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState('');
  const [errorLevel, setErrorLevel] = useState('M');

  const generate = async () => {
    if (!text) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size, margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setDataUrl(url);
    } catch(e) { console.error(e); }
  };

  useEffect(() => { generate(); }, [text, size, fgColor, bgColor, errorLevel]);

  return (
    <ToolLayout title="QR Code Generator" description="Generate QR codes from any text or URL" icon={QrCode}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Text or URL</label>
            <textarea className="textarea h-28" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text, URL, or any data..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Foreground</label>
              <input type="color" className="h-10 w-full rounded-lg border border-gray-200 cursor-pointer" value={fgColor} onChange={e => setFgColor(e.target.value)} />
            </div>
            <div>
              <label className="label">Background</label>
              <input type="color" className="h-10 w-full rounded-lg border border-gray-200 cursor-pointer" value={bgColor} onChange={e => setBgColor(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Size: {size}px</label>
            <input type="range" min={128} max={512} step={32} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="label">Error Correction</label>
            <select className="select" value={errorLevel} onChange={e => setErrorLevel(e.target.value)}>
              <option value="L">L (7%)</option>
              <option value="M">M (15%)</option>
              <option value="Q">Q (25%)</option>
              <option value="H">H (30%)</option>
            </select>
          </div>
        </div>
        <div className="card p-6 flex flex-col items-center justify-center gap-4">
          {dataUrl && (
            <>
              <img src={dataUrl} alt="QR Code" className="rounded-xl shadow-sm" style={{width:Math.min(size,300)}} />
              <a href={dataUrl} download="qrcode.png" className="btn-primary">Download PNG</a>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
