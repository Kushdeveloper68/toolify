import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Braces, CheckCircle, XCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Alice","age":30,"hobbies":["reading","coding"]}');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [status, setStatus] = useState(null);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus('valid');
    } catch(e) { setStatus('invalid'); setOutput(''); }
  };
  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus('valid');
    } catch(e) { setStatus('invalid'); }
  };

  return (
    <ToolLayout title="JSON Formatter" description="Format, validate, and beautify JSON data" icon={Braces}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="label mb-0 text-xs">Indent:</label>
          {[2,4].map(n => (
            <button key={n} onClick={() => setIndent(n)} className={`px-3 py-1 rounded text-sm ${indent===n?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{n} spaces</button>
          ))}
        </div>
        <button onClick={format} className="btn-primary">Format / Beautify</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
        {status && (
          <span className={`flex items-center gap-1 text-sm font-medium ${status==='valid'?'text-green-600':'text-red-600'}`}>
            {status==='valid' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
            {status==='valid' ? 'Valid JSON' : 'Invalid JSON'}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">Input JSON</label>
          <textarea className="textarea h-80" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste JSON here..." />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Formatted Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea className="textarea h-80" value={output} readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
