import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { FileCode2 } from 'lucide-react';
import yaml from 'js-yaml';

export default function YamlToJson() {
  const [input, setInput] = useState(`name: Alice\nage: 30\ncity: Mumbai\nhobbies:\n  - reading\n  - coding`);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('yaml-json');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      if (mode === 'yaml-json') {
        const obj = yaml.load(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(input);
        setOutput(yaml.dump(obj));
      }
      setError('');
    } catch(e) { setError(e.message); }
  };

  return (
    <ToolLayout title="YAML ↔ JSON Converter" description="Convert between YAML and JSON formats" icon={FileCode2}>
      <div className="card p-4 mb-4 flex gap-3">
        <button onClick={() => setMode('yaml-json')} className={`btn-${mode==='yaml-json'?'primary':'secondary'}`}>YAML → JSON</button>
        <button onClick={() => setMode('json-yaml')} className={`btn-${mode==='json-yaml'?'primary':'secondary'}`}>JSON → YAML</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">{mode === 'yaml-json' ? 'YAML' : 'JSON'} Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button onClick={convert} className="btn-primary mt-3 w-full">Convert</button>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">{mode === 'yaml-json' ? 'JSON' : 'YAML'} Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea className="textarea h-64" value={output} readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
