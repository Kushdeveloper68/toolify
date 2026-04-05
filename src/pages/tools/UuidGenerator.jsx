import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Hash, RefreshCw } from 'lucide-react';

function genUUID() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0;
    return (c==='x'?r:(r&0x3|0x8)).toString(16);
  });
}

function genNanoid(len=21) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
}

function genHex(len=32) {
  const arr = new Uint8Array(len/2);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => v.toString(16).padStart(2,'0')).join('');
}

export default function UuidGenerator() {
  const [type, setType] = useState('uuid');
  const [count, setCount] = useState(5);
  const [nanoidLen, setNanoidLen] = useState(21);
  const [hexLen, setHexLen] = useState(32);
  const [results, setResults] = useState([]);

  const generate = () => {
    const r = Array.from({length:count}, () => {
      if (type==='uuid') return genUUID();
      if (type==='nanoid') return genNanoid(nanoidLen);
      return genHex(hexLen);
    });
    setResults(r);
  };

  return (
    <ToolLayout title="UUID / Random String Generator" description="Generate UUIDs, NanoIDs, and random hex strings" icon={Hash}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label">Type</label>
          <select className="select w-40" value={type} onChange={e=>setType(e.target.value)}>
            <option value="uuid">UUID v4</option>
            <option value="nanoid">NanoID</option>
            <option value="hex">Hex String</option>
          </select>
        </div>
        {type === 'nanoid' && <div><label className="label">Length</label><input type="number" className="input w-20" value={nanoidLen} min={5} max={64} onChange={e=>setNanoidLen(Number(e.target.value))}/></div>}
        {type === 'hex' && <div><label className="label">Length (chars)</label><input type="number" className="input w-20" value={hexLen} min={8} max={128} step={2} onChange={e=>setHexLen(Number(e.target.value))}/></div>}
        <div><label className="label">Count</label><input type="number" className="input w-20" value={count} min={1} max={100} onChange={e=>setCount(Number(e.target.value))}/></div>
        <button onClick={generate} className="btn-primary gap-2"><RefreshCw size={15}/>Generate</button>
      </div>
      {results.length > 0 && (
        <div className="card p-4 space-y-2">
          {results.map((r,i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <code className="flex-1 text-sm font-mono text-gray-800 dark:text-gray-200 break-all">{r}</code>
              <CopyButton text={r} />
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100"><CopyButton text={results.join('\n')} /></div>
        </div>
      )}
    </ToolLayout>
  );
}
