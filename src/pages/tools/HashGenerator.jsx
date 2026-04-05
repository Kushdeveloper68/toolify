import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Fingerprint } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('Hello, World!');
  const [hashes, setHashes] = useState({});
  const [mode, setMode] = useState('text');
  const [loading, setLoading] = useState(false);

  const algorithms = ['MD5','SHA1','SHA256','SHA512','SHA3','RIPEMD160'];

  const generate = () => {
    const result = {};
    for (const algo of algorithms) {
      try {
        result[algo] = CryptoJS[algo](input).toString();
      } catch { result[algo] = 'N/A'; }
    }
    setHashes(result);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wordArray = CryptoJS.lib.WordArray.create(ev.target.result);
      const result = {};
      for (const algo of algorithms) {
        try { result[algo] = CryptoJS[algo](wordArray).toString(); } catch { result[algo] = 'N/A'; }
      }
      setHashes(result);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <ToolLayout title="Hash Generator" description="Generate MD5, SHA-256, SHA-512 and other hashes" icon={Fingerprint}>
      <div className="card p-4 mb-4">
        <div className="flex gap-2 mb-3">
          <button onClick={()=>setMode('text')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${mode==='text'?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>Text</button>
          <button onClick={()=>setMode('file')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${mode==='file'?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>File</button>
        </div>
        {mode === 'text' ? (
          <>
            <label className="label">Input Text</label>
            <textarea className="textarea h-28 mb-3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter text to hash..." />
            <button onClick={generate} className="btn-primary">Generate Hashes</button>
          </>
        ) : (
          <div>
            <label className="label">Upload File</label>
            <input type="file" className="input" onChange={handleFile} />
            {loading && <p className="text-sm text-gray-400 mt-2">Computing hashes...</p>}
          </div>
        )}
      </div>
      {Object.keys(hashes).length > 0 && (
        <div className="card p-4 space-y-3">
          {Object.entries(hashes).map(([algo,hash]) => (
            <div key={algo} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="badge bg-blue-50 text-blue-600 text-xs w-20 text-center flex-shrink-0">{algo}</span>
              <code className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300 break-all leading-relaxed">{hash}</code>
              <CopyButton text={hash} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
