import { useState, useMemo } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Regex } from 'lucide-react';

const EXAMPLES = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)', flags: 'g' },
  { label: 'IP Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
  { label: 'Phone (IN)', pattern: '(\\+91|0)?[6-9][0-9]{9}', flags: 'g' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('gi');
  const [testStr, setTestStr] = useState('Contact us at hello@example.com or support@toolify.app for help.\nAlso try admin@test.org');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testStr };
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      setError('');
      const matches = [...testStr.matchAll(new RegExp(pattern, 'g'))];
      return { matches, regex, valid: true };
    } catch(e) { setError(e.message); return { matches:[], valid:false }; }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!result.valid || !result.matches.length) return testStr;
    let html = testStr;
    const parts = [];
    let last = 0;
    for (const m of result.matches) {
      parts.push(testStr.slice(last, m.index));
      parts.push(`<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">${m[0]}</mark>`);
      last = m.index + m[0].length;
    }
    parts.push(testStr.slice(last));
    return parts.join('');
  }, [result, testStr]);

  return (
    <ToolLayout title="Regex Tester" description="Test and debug regular expressions with live highlighting" icon={Regex}>
      <div className="card p-4 mb-4">
        <div className="flex gap-2 mb-3">
          {EXAMPLES.map(e => (
            <button key={e.label} onClick={() => {setPattern(e.pattern);setFlags(e.flags);}} className="btn-secondary text-xs">{e.label}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="label">Pattern</label>
            <div className="flex">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg text-gray-500 font-mono">/</span>
              <input className="input rounded-none flex-1 font-mono" value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="regex pattern..." />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-lg text-gray-500 font-mono">/</span>
            </div>
          </div>
          <div className="w-24">
            <label className="label">Flags</label>
            <input className="input font-mono" value={flags} onChange={e=>setFlags(e.target.value)} placeholder="gi" />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!error && <div className="flex gap-3 text-sm">
          <span className={`badge ${result.matches.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
          </span>
        </div>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">Test String</label>
          <textarea className="textarea h-48" value={testStr} onChange={e=>setTestStr(e.target.value)} />
        </div>
        <div className="card p-4">
          <label className="label">Highlighted Matches</label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-48 overflow-y-auto font-mono text-sm bg-white dark:bg-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: highlighted}} />
        </div>
      </div>
      {result.matches.length > 0 && (
        <div className="card p-4 mt-4">
          <label className="label">Match Details</label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {result.matches.map((m,i) => (
              <div key={i} className="flex items-center gap-3 text-sm bg-gray-50 dark:bg-gray-800 rounded px-3 py-1.5">
                <span className="badge bg-blue-50 text-blue-600">#{i+1}</span>
                <code className="flex-1 font-mono">{m[0]}</code>
                <span className="text-gray-400 text-xs">index: {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
