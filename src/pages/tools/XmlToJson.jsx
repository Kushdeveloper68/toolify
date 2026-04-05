import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { FileCode } from 'lucide-react';
import { downloadFile } from '../../utils/fileUtils';

function xmlToObj(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error('Invalid XML');
  function nodeToObj(node) {
    if (node.nodeType === 3) return node.textContent.trim();
    const obj = {};
    for (const attr of node.attributes || []) obj[`@${attr.name}`] = attr.value;
    for (const child of node.childNodes) {
      if (child.nodeType === 3 && child.textContent.trim()) {
        obj['#text'] = child.textContent.trim();
      } else if (child.nodeType === 1) {
        const key = child.tagName;
        const val = nodeToObj(child);
        if (obj[key] !== undefined) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
          obj[key].push(val);
        } else { obj[key] = val; }
      }
    }
    return obj;
  }
  return { [doc.documentElement.tagName]: nodeToObj(doc.documentElement) };
}

export default function XmlToJson() {
  const [input, setInput] = useState(`<users>\n  <user id="1">\n    <name>Alice</name>\n    <age>30</age>\n  </user>\n  <user id="2">\n    <name>Bob</name>\n    <age>25</age>\n  </user>\n</users>`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const result = xmlToObj(input);
      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch(e) { setError(e.message); setOutput(''); }
  };

  return (
    <ToolLayout title="XML to JSON" description="Convert XML documents to JSON format" icon={FileCode}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">XML Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button onClick={convert} className="btn-primary mt-3 w-full">Convert to JSON</button>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">JSON Output</label>
            {output && <div className="flex gap-2"><CopyButton text={output} /><button onClick={() => downloadFile(output,'output.json','application/json')} className="btn-secondary text-xs">Download</button></div>}
          </div>
          <textarea className="textarea h-64" value={output} readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
