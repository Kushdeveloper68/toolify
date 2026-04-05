import { useRef, useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { PenLine, Trash2, Download } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureGenerator() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [bg, setBg] = useState('white');

  const clear = () => canvasRef.current?.clear();

  const download = () => {
    const canvas = canvasRef.current?.getTrimmedCanvas();
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href=url; a.download='signature.png'; a.click();
  };

  const downloadSvg = () => {
    const canvas = canvasRef.current?.getTrimmedCanvas();
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
    const a = document.createElement('a'); a.href='data:image/svg+xml,'+encodeURIComponent(svg); a.download='signature.svg'; a.click();
  };

  return (
    <ToolLayout title="Signature Generator" description="Draw and download your digital signature" icon={PenLine}>
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <label className="label">Pen Color</label>
            <input type="color" className="h-9 w-16 rounded-lg border border-gray-200 cursor-pointer" value={color} onChange={e=>setColor(e.target.value)} />
          </div>
          <div>
            <label className="label">Pen Width: {penWidth}px</label>
            <input type="range" min={1} max={8} value={penWidth} onChange={e=>setPenWidth(Number(e.target.value))} className="w-32" />
          </div>
          <div>
            <label className="label">Background</label>
            <div className="flex gap-2">
              {['white','transparent'].map(b=>(
                <button key={b} onClick={()=>setBg(b)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${bg===b?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{b}</button>
              ))}
            </div>
          </div>
          <button onClick={clear} className="btn-ghost gap-1 ml-auto"><Trash2 size={14}/>Clear</button>
        </div>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden" style={{background:bg}}>
          <SignatureCanvas
            ref={canvasRef}
            penColor={color}
            minWidth={penWidth/2}
            maxWidth={penWidth}
            canvasProps={{ className:'w-full', height:240, style:{background:bg==='transparent'?'transparent':'white'} }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Draw your signature above</p>
      </div>
      <div className="flex gap-3">
        <button onClick={download} className="btn-primary gap-2"><Download size={16}/>Download PNG</button>
        <button onClick={downloadSvg} className="btn-secondary gap-2"><Download size={16}/>Download SVG</button>
      </div>
    </ToolLayout>
  );
}
