import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { ArrowRightLeft } from 'lucide-react';
import { downloadFile } from '../../utils/fileUtils';

export default function CsvToJson() {
  const [input, setInput] = useState('name,age,city\nAlice,30,Mumbai\nBob,25,Delhi');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const lines = input.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
      const result = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''));
        return Object.fromEntries(headers.map((h, i) => [h, isNaN(vals[i]) ? vals[i] : Number(vals[i])]));
      });
      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch(e) { setError(e.message); }
  };

  return (
    <ToolLayout title="CSV to JSON" description="Convert CSV data to JSON array format" icon={ArrowRightLeft}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">CSV Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste CSV data here..." />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button onClick={convert} className="btn-primary mt-3 w-full">Convert to JSON</button>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">JSON Output</label>
            <div className="flex gap-2">
              {output && <CopyButton text={output} />}
              {output && <button onClick={() => downloadFile(output, 'data.json', 'application/json')} className="btn-secondary text-xs">Download</button>}
            </div>
          </div>
          <textarea className="textarea h-64" value={output} readOnly placeholder="JSON output will appear here..." />
        </div>
      </div>
    </ToolLayout>
  );
}
