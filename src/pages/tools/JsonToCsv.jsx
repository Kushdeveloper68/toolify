import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { ArrowRightLeft } from 'lucide-react';
import { downloadFile } from '../../utils/fileUtils';

export default function JsonToCsv() {
  const [input, setInput] = useState('[\n  {"name":"Alice","age":30,"city":"Mumbai"},\n  {"name":"Bob","age":25,"city":"Delhi"}\n]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (!arr.length) return setOutput('');
      const keys = [...new Set(arr.flatMap(Object.keys))];
      const csv = [keys.join(','), ...arr.map(row =>
        keys.map(k => {
          const v = row[k] ?? '';
          const s = String(v);
          return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s;
        }).join(',')
      )].join('\n');
      setOutput(csv);
      setError('');
    } catch(e) { setError(e.message); }
  };

  return (
    <ToolLayout title="JSON to CSV" description="Convert JSON arrays to CSV format" icon={ArrowRightLeft}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">JSON Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON array here..." />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button onClick={convert} className="btn-primary mt-3 w-full">Convert to CSV</button>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">CSV Output</label>
            <div className="flex gap-2">
              {output && <CopyButton text={output} />}
              {output && <button onClick={() => downloadFile(output, 'data.csv', 'text/csv')} className="btn-secondary text-xs">Download CSV</button>}
            </div>
          </div>
          <textarea className="textarea h-64" value={output} readOnly placeholder="CSV output will appear here..." />
        </div>
      </div>
    </ToolLayout>
  );
}
