import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { AlignLeft } from 'lucide-react';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function genWords(n) {
  return Array.from({length:n}, (_,i) => {
    const w = WORDS[i % WORDS.length];
    return i===0 ? w.charAt(0).toUpperCase()+w.slice(1) : w;
  }).join(' ');
}

function genSentence() {
  const len = 8 + Math.floor(Math.random()*10);
  return genWords(len) + '.';
}

function genParagraph() {
  const count = 4 + Math.floor(Math.random()*4);
  return Array.from({length:count}, genSentence).join(' ');
}

export default function LoremIpsum() {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (type === 'words') setOutput(genWords(count));
    else if (type === 'sentences') setOutput(Array.from({length:count}, genSentence).join(' '));
    else setOutput(Array.from({length:count}, genParagraph).join('\n\n'));
  };

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder lorem ipsum text" icon={AlignLeft}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label">Generate</label>
          <div className="flex gap-2">
            {['words','sentences','paragraphs'].map(t => (
              <button key={t} onClick={()=>setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${type===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Count</label>
          <input type="number" className="input w-20" value={count} min={1} max={50} onChange={e=>setCount(Number(e.target.value))} />
        </div>
        <button onClick={generate} className="btn-primary">Generate</button>
      </div>
      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Output</label>
            <CopyButton text={output} />
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{output}</div>
        </div>
      )}
    </ToolLayout>
  );
}
