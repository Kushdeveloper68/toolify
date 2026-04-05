import { useState, useRef, useEffect } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { BarChart2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';

const FORMATS = ['CODE128','CODE39','EAN13','EAN8','UPC','ITF14','MSI'];

export default function BarcodeGenerator() {
  const svgRef = useRef(null);
  const [text, setText] = useState('1234567890');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [error, setError] = useState('');

  const generate = () => {
    if (!text || !svgRef.current) return;
    try {
      JsBarcode(svgRef.current, text, {
        format, lineColor, background: bgColor,
        width, height, displayValue: true,
      });
      setError('');
    } catch(e) { setError(e.message); }
  };

  useEffect(() => { generate(); }, [text, format, lineColor, bgColor, width, height]);

  const download = () => {
    const svg = svgRef.current;
    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      const a = document.createElement('a'); a.href=canvas.toDataURL(); a.download='barcode.png'; a.click();
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  };

  return (
    <ToolLayout title="Barcode Generator" description="Create barcodes in multiple formats" icon={BarChart2}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Data</label>
            <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Enter barcode data..." />
          </div>
          <div>
            <label className="label">Format</label>
            <select className="select" value={format} onChange={e => setFormat(e.target.value)}>
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Bar Color</label>
              <input type="color" className="h-10 w-full rounded-lg border border-gray-200 cursor-pointer" value={lineColor} onChange={e => setLineColor(e.target.value)} />
            </div>
            <div>
              <label className="label">Background</label>
              <input type="color" className="h-10 w-full rounded-lg border border-gray-200 cursor-pointer" value={bgColor} onChange={e => setBgColor(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Bar Width: {width}</label>
            <input type="range" min={1} max={5} value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="label">Height: {height}px</label>
            <input type="range" min={30} max={200} value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full" />
          </div>
        </div>
        <div className="card p-6 flex flex-col items-center justify-center gap-4">
          {error ? <p className="text-red-500 text-sm">{error}</p> : null}
          <svg ref={svgRef} className="max-w-full" />
          <button onClick={download} className="btn-primary">Download PNG</button>
        </div>
      </div>
    </ToolLayout>
  );
}
