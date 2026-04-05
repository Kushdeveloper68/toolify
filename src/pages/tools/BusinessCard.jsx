import { useState, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { CreditCard, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const THEMES = [
  { name:'Classic Blue', bg:'#1e3a8a', text:'#ffffff', accent:'#60a5fa' },
  { name:'Dark', bg:'#1a1a2e', text:'#ffffff', accent:'#e94560' },
  { name:'White', bg:'#ffffff', text:'#1a1a2e', accent:'#2563eb' },
  { name:'Emerald', bg:'#065f46', text:'#ffffff', accent:'#34d399' },
  { name:'Purple', bg:'#4c1d95', text:'#ffffff', accent:'#a78bfa' },
];

export default function BusinessCard() {
  const [info, setInfo] = useState({
    name:'Your Name',company:'Company Inc.',title:'Software Engineer',
    email:'hello@example.com',phone:'+91 99999 99999',website:'www.example.com',
    address:'Mumbai, Maharashtra'
  });
  const [theme, setTheme] = useState(THEMES[0]);
  const cardRef = useRef(null);

  const set = (k,v) => setInfo(p=>({...p,[k]:v}));

  const download = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {scale:3,useCORS:true,backgroundColor:null});
    const a = document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download='business_card.png'; a.click();
  };

  return (
    <ToolLayout title="Business Card Generator" description="Design and download professional business cards" icon={CreditCard}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 space-y-3">
          {Object.entries(info).map(([k,v])=>(
            <div key={k}>
              <label className="label capitalize">{k}</label>
              <input className="input" value={v} onChange={e=>set(k,e.target.value)} />
            </div>
          ))}
          <div>
            <label className="label">Theme</label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map(t=>(
                <button key={t.name} onClick={()=>setTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${theme.name===t.name?'border-blue-500':'border-transparent'}`}
                  style={{background:t.bg,color:t.text}}>{t.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div ref={cardRef} className="rounded-2xl p-6 shadow-xl"
              style={{background:theme.bg, color:theme.text, width:'340px', minHeight:'190px', fontFamily:'Plus Jakarta Sans, sans-serif'}}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-xl font-extrabold tracking-tight">{info.name}</p>
                  <p style={{color:theme.accent}} className="text-sm font-semibold">{info.title}</p>
                  <p className="text-sm opacity-80 mt-0.5">{info.company}</p>
                </div>
                <div className="mt-4 space-y-0.5 text-xs opacity-80">
                  <p>✉ {info.email}</p>
                  <p>📞 {info.phone}</p>
                  <p>🌐 {info.website}</p>
                  <p>📍 {info.address}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={download} className="btn-primary gap-2"><Download size={16}/>Download PNG</button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
