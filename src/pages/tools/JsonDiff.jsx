import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { GitCompare } from 'lucide-react';

function diffObjects(a, b, path = '') {
  const diffs = [];
  const keys = new Set([...Object.keys(a||{}), ...Object.keys(b||{})]);
  for (const key of keys) {
    const fullPath = path ? `${path}.${key}` : key;
    const av = a?.[key], bv = b?.[key];
    if (JSON.stringify(av) !== JSON.stringify(bv)) {
      diffs.push({ path: fullPath, left: JSON.stringify(av, null, 2), right: JSON.stringify(bv, null, 2) });
    }
  }
  return diffs;
}

export default function JsonDiff() {
  const [left, setLeft] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "city": "Mumbai"\n}');
  const [right, setRight] = useState('{\n  "name": "Alice",\n  "age": 31,\n  "country": "India"\n}');
  const [diffs, setDiffs] = useState([]);
  const [error, setError] = useState('');

  const compare = () => {
    try {
      const l = JSON.parse(left), r = JSON.parse(right);
      setDiffs(diffObjects(l, r));
      setError('');
    } catch(e) { setError(e.message); }
  };

  return (
    <ToolLayout title="JSON Diff" description="Compare two JSON objects and highlight differences" icon={GitCompare}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <label className="label">JSON A (Left)</label>
          <textarea className="textarea h-48" value={left} onChange={e => setLeft(e.target.value)} />
        </div>
        <div className="card p-4">
          <label className="label">JSON B (Right)</label>
          <textarea className="textarea h-48" value={right} onChange={e => setRight(e.target.value)} />
        </div>
      </div>
      <button onClick={compare} className="btn-primary mb-4">Compare JSON</button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {diffs.length === 0 && !error && (
        <div className="card p-6 text-center text-gray-400">Click Compare to see differences</div>
      )}
      {diffs.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{diffs.length} difference{diffs.length!==1?'s':''} found</p>
          {diffs.map((d, i) => (
            <div key={i} className="card p-4">
              <p className="font-mono text-sm font-bold text-blue-600 mb-3">{d.path}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-500 mb-1">Left (A)</p>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap">{d.left ?? 'undefined'}</pre>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-500 mb-1">Right (B)</p>
                  <pre className="text-xs text-green-700 whitespace-pre-wrap">{d.right ?? 'undefined'}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
