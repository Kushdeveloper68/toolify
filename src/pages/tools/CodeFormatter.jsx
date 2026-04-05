import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Code } from 'lucide-react';

function formatCode(code, lang) {
  if (lang === 'json') {
    try { return JSON.stringify(JSON.parse(code), null, 2); } catch { return code; }
  }
  if (lang === 'html') {
    let result = code, depth = 0;
    result = result.replace(/>\s*</g, '>\n<').split('\n').map(line => {
      line = line.trim();
      if (!line) return '';
      if (line.match(/^<\//)) depth--;
      const padded = '  '.repeat(Math.max(0,depth)) + line;
      if (line.match(/^<[^/!]/) && !line.match(/\/>$/) && !line.match(/<\/[^>]+>$/)) depth++;
      return padded;
    }).join('\n');
    return result;
  }
  if (lang === 'css') {
    return code.replace(/\{/g,' {\n').replace(/;/g,';\n').replace(/\}/g,'}\n').split('\n').map(l => l.trim() ? (l.trim().endsWith('{') ? l.trim() : '  ' + l.trim()) : '').join('\n').replace(/\n{3,}/g,'\n\n');
  }
  return code;
}

export default function CodeFormatter() {
  const [input, setInput] = useState('<div><h1>Hello</h1><p>World</p></div>');
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState('html');

  const format = () => setOutput(formatCode(input, lang));

  return (
    <ToolLayout title="Code Formatter" description="Format HTML, CSS, JSON, and more" icon={Code}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {['html','css','json'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${lang===l?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={format} className="btn-primary">Format Code</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">Input Code</label>
          <textarea className="textarea h-80" value={input} onChange={e => setInput(e.target.value)} />
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
