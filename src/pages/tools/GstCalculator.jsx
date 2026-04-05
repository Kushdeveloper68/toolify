import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Receipt } from 'lucide-react';

const GST_RATES = [0, 0.1, 0.25, 3, 5, 12, 18, 28];

export default function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState('exclusive');

  const fmt = n => '₹' + parseFloat(n.toFixed(2)).toLocaleString('en-IN');

  let base, gst, total;
  if (mode === 'exclusive') {
    base = amount;
    gst = amount * rate / 100;
    total = base + gst;
  } else {
    total = amount;
    base = amount * 100 / (100 + rate);
    gst = total - base;
  }
  const cgst = gst / 2, sgst = gst / 2;

  return (
    <ToolLayout title="GST Calculator" description="Calculate GST amounts (exclusive/inclusive)" icon={Receipt}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6 space-y-4">
          <div>
            <label className="label">Amount (₹)</label>
            <input type="number" className="input" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">GST Rate</label>
            <select className="select" value={rate} onChange={e=>setRate(Number(e.target.value))}>
              {GST_RATES.map(r=><option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <div>
            <label className="label">Calculation Mode</label>
            <div className="flex gap-2">
              <button onClick={()=>setMode('exclusive')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode==='exclusive'?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>GST Exclusive</button>
              <button onClick={()=>setMode('inclusive')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${mode==='inclusive'?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>GST Inclusive</button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {label:'Original Amount', value:fmt(amount), highlight:false},
            {label:`GST (${rate}%)`, value:fmt(gst), highlight:false},
            {label:'CGST', value:fmt(cgst), highlight:false},
            {label:'SGST/UTGST', value:fmt(sgst), highlight:false},
            {label:'Total Amount', value:fmt(total), highlight:true},
          ].map(r=>(
            <div key={r.label} className={`card p-4 flex justify-between items-center ${r.highlight?'border-2 border-blue-300 bg-blue-50 dark:bg-blue-950':''}`}>
              <span className={`text-sm ${r.highlight?'font-bold text-blue-700 dark:text-blue-300':'text-gray-600 dark:text-gray-400'}`}>{r.label}</span>
              <span className={`font-bold ${r.highlight?'text-blue-700 dark:text-blue-300 text-xl':'text-gray-900 dark:text-white'}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
