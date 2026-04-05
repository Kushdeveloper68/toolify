import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function hexToHsl(hex) {
  let { r, g, b } = hexToRgb(hex);
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h, s, l=(max+min)/2;
  if(max===min) { h=s=0; } else {
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max) {
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const formats = [
    { label: 'HEX', value: color },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS var', value: `--color: ${color};` },
  ];

  const palettes = [
    '#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899',
    '#000000','#374151','#6b7280','#9ca3af','#d1d5db','#f3f4f6','#ffffff','#1e40af',
  ];

  return (
    <ToolLayout title="Color Picker" description="Pick colors and get HEX, RGB, HSL values" icon={Palette}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6 flex flex-col items-center gap-6">
          <HexColorPicker color={color} onChange={setColor} style={{width:'100%',maxWidth:'280px',height:'220px'}} />
          <div className="w-full h-20 rounded-xl shadow-inner border border-gray-100" style={{backgroundColor:color}} />
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <label className="label">Hex Input</label>
            <input className="input font-mono" value={color} onChange={e => { if(/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setColor(e.target.value); }} />
          </div>
          {formats.map(f => (
            <div key={f.label} className="card p-3 flex items-center gap-3">
              <span className="badge bg-blue-50 text-blue-600 w-16 text-center">{f.label}</span>
              <code className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300">{f.value}</code>
              <CopyButton text={f.value} />
            </div>
          ))}
          <div className="card p-4">
            <label className="label">Palette</label>
            <div className="flex flex-wrap gap-2">
              {palettes.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 shadow-sm" style={{backgroundColor:c,borderColor:color===c?'#3b82f6':'transparent'}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
