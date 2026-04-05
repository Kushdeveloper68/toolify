import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Dices, RefreshCw } from 'lucide-react';

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [decimals, setDecimals] = useState(0);
  const [results, setResults] = useState([]);

  const generate = () => {
    const nums = [];
    const used = new Set();
    let attempts = 0;
    while (nums.length < count && attempts < 10000) {
      attempts++;
      const r = decimals > 0
        ? parseFloat((Math.random()*(max-min)+min).toFixed(decimals))
        : Math.floor(Math.random()*(max-min+1))+min;
      if (unique && used.has(r)) continue;
      used.add(r);
      nums.push(r);
    }
    setResults(nums);
  };

  return (
    <ToolLayout title="Random Number Generator" description="Generate random numbers in any range" icon={Dices}>
      <div className="card p-6 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div><label className="label">Min</label><input type="number" className="input" value={min} onChange={e=>setMin(Number(e.target.value))} /></div>
          <div><label className="label">Max</label><input type="number" className="input" value={max} onChange={e=>setMax(Number(e.target.value))} /></div>
          <div><label className="label">Count</label><input type="number" className="input" value={count} min={1} max={1000} onChange={e=>setCount(Number(e.target.value))} /></div>
          <div><label className="label">Decimal Places</label><input type="number" className="input" value={decimals} min={0} max={10} onChange={e=>setDecimals(Number(e.target.value))} /></div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={unique} onChange={e=>setUnique(e.target.checked)} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Unique numbers only</span>
          </label>
          <button onClick={generate} className="btn-primary gap-2 ml-auto"><RefreshCw size={15}/>Generate</button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{results.length} number{results.length!==1?'s':''} generated</span>
            <div className="flex gap-2">
              <CopyButton text={results.join(', ')} />
              <button onClick={generate} className="btn-ghost text-xs"><RefreshCw size={13}/>Re-roll</button>
            </div>
          </div>
          {results.length === 1 ? (
            <div className="text-center py-6">
              <p className="text-7xl font-black text-blue-600">{results[0]}</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {results.map((n,i)=>(
                <span key={i} className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg font-mono font-semibold text-sm">{n}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
