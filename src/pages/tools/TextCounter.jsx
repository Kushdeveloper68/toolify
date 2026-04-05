import { useState, useMemo } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Text } from 'lucide-react';

export default function TextCounter() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g,'').length;
    const readTime = Math.ceil(words / 200);
    const freq = {};
    text.toLowerCase().replace(/[^a-z]/g,'').split('').forEach(c => freq[c] = (freq[c]||0)+1);
    const topChars = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { words, sentences, paragraphs, chars, charsNoSpace, readTime, topChars };
  }, [text]);

  const statCards = [
    {label:'Characters',value:stats.chars},
    {label:'No Spaces',value:stats.charsNoSpace},
    {label:'Words',value:stats.words},
    {label:'Sentences',value:stats.sentences},
    {label:'Paragraphs',value:stats.paragraphs},
    {label:'Read Time',value:`${stats.readTime} min`},
  ];

  return (
    <ToolLayout title="Text Counter" description="Count characters, words, sentences, and more" icon={Text}>
      <div className="card p-4 mb-4">
        <label className="label">Your Text</label>
        <textarea className="textarea h-48" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste or type your text here..." />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {statCards.map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {stats.topChars.length > 0 && (
        <div className="card p-4">
          <label className="label">Top Characters</label>
          <div className="flex gap-3 flex-wrap">
            {stats.topChars.map(([c,n]) => (
              <div key={c} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <code className="text-blue-600 font-bold text-lg">'{c}'</code>
                <span className="text-gray-500 text-sm">×{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
