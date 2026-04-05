import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Sunset } from 'lucide-react';

export default function GradientGenerator() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([{color:'#6366f1',pos:0},{color:'#ec4899',pos:100}]);

  const addStop = () => setStops(s => [...s, {color:'#06b6d4',pos:50}]);
  const removeStop = (i) => setStops(s => s.filter((_,idx)=>idx!==i));
  const updateStop = (i,key,val) => setStops(s => s.map((s2,idx)=>idx===i?{...s2,[key]:val}:s2));

  const sorted = [...stops].sort((a,b)=>a.pos-b.pos);
  const stopsStr = sorted.map(s=>`${s.color} ${s.pos}%`).join(', ');
  const css = type==='linear' ? `linear-gradient(${angle}deg, ${stopsStr})` : `radial-gradient(circle, ${stopsStr})`;
  const fullCss = `background: ${css};`;

  const presets = [
    ['#ff6b6b','#feca57'],['#48dbfb','#ff9ff3'],['#54a0ff','#5f27cd'],
    ['#00d2d3','#ff9f43'],['#1dd1a1','#10ac84'],['#f368e0','#ff6b6b'],
  ];

  return (
    <ToolLayout title="Gradient Generator" description="Create beautiful CSS gradients visually" icon={Sunset}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div className="flex gap-2">
              {['linear','radial'].map(t => (
                <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${type===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
            {type==='linear' && (
              <div>
                <label className="label">Angle: {angle}°</label>
                <input type="range" min={0} max={360} value={angle} onChange={e=>setAngle(Number(e.target.value))} className="w-full" />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Color Stops</label>
                <button onClick={addStop} className="btn-secondary text-xs">+ Add Stop</button>
              </div>
              {stops.map((s,i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input type="color" value={s.color} onChange={e=>updateStop(i,'color',e.target.value)} className="h-8 w-12 rounded cursor-pointer border border-gray-200" />
                  <span className="text-xs text-gray-500 w-6">{s.pos}%</span>
                  <input type="range" min={0} max={100} value={s.pos} onChange={e=>updateStop(i,'pos',Number(e.target.value))} className="flex-1" />
                  {stops.length > 2 && <button onClick={()=>removeStop(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <label className="label">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map(([c1,c2],i) => (
                <button key={i} onClick={() => setStops([{color:c1,pos:0},{color:c2,pos:100}])}
                  className="h-12 rounded-lg border-2 border-transparent hover:border-blue-400 transition-all"
                  style={{background:`linear-gradient(135deg,${c1},${c2})`}} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="h-64 w-full" style={{background:css}} />
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">CSS Code</label>
              <CopyButton text={fullCss} />
            </div>
            <code className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm font-mono text-gray-700 dark:text-gray-300 break-all">{fullCss}</code>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
