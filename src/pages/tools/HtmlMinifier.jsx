import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Minimize2 } from 'lucide-react';

function minifyHTML(html) {
  return html.replace(/\s+/g,' ').replace(/>\s+</g,'><').replace(/\s+>/g,'>').replace(/<\s+/g,'<').trim();
}
function minifyCSS(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim();
}
function minifyJS(js) {
  return js.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim();
}

export default function HtmlMinifier() {
  const [input, setInput] = useState('<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a paragraph with   extra   spaces.</p>\n</div>');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('html');
  const [stats, setStats] = useState(null);

  const minify = () => {
    let result;
    if (type === 'html') result = minifyHTML(input);
    else if (type === 'css') result = minifyCSS(input);
    else result = minifyJS(input);
    setOutput(result);
    const saved = input.length - result.length;
    setStats({ before: input.length, after: result.length, saved, pct: ((saved/input.length)*100).toFixed(1) });
  };

  return (
    <ToolLayout title="HTML/CSS/JS Minifier" description="Minify HTML, CSS, and JavaScript code" icon={Minimize2}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {['html','css','js'].map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${type===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={minify} className="btn-primary">Minify</button>
        {stats && (
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Before: <b>{stats.before}</b> chars</span>
            <span className="text-gray-500">After: <b>{stats.after}</b> chars</span>
            <span className="text-green-600 font-semibold">Saved: {stats.pct}%</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Minified Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea className="textarea h-64" value={output} readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
