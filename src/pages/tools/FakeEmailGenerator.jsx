import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Mail, RefreshCw } from 'lucide-react';

const firstNames = ['alice','bob','charlie','diana','eve','frank','grace','henry','iris','jack','kate','liam','mia','noah','olivia','peter','quinn','rose','sam','tina','umar','vera','will','xena','yara','zoe'];
const lastNames = ['smith','jones','wilson','taylor','brown','davis','miller','moore','anderson','jackson','white','harris','martin','garcia','martinez','robinson','clark','rodriguez','lewis','lee'];
const domains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','protonmail.com','icloud.com','live.com','aol.com','mail.com'];

function gen() {
  const fn = firstNames[Math.floor(Math.random()*firstNames.length)];
  const ln = lastNames[Math.floor(Math.random()*lastNames.length)];
  const dom = domains[Math.floor(Math.random()*domains.length)];
  const sep = Math.random() > 0.5 ? '.' : '_';
  const num = Math.random() > 0.6 ? Math.floor(Math.random()*99) : '';
  return `${fn}${sep}${ln}${num}@${dom}`;
}

export default function FakeEmailGenerator() {
  const [emails, setEmails] = useState([gen(),gen(),gen(),gen(),gen()]);
  const [count, setCount] = useState(5);

  const generate = () => setEmails(Array.from({length: count}, gen));

  return (
    <ToolLayout title="Fake Email Generator" description="Generate realistic fake email addresses" icon={Mail}>
      <div className="card p-4 mb-4 flex items-end gap-3">
        <div>
          <label className="label">Count</label>
          <input type="number" className="input w-24" value={count} min={1} max={50} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <button onClick={generate} className="btn-primary gap-2"><RefreshCw size={15}/>Generate</button>
      </div>
      <div className="card p-4 space-y-2">
        {emails.map((e,i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail size={15} className="text-blue-500 flex-shrink-0" />
            <code className="flex-1 text-sm text-gray-800 dark:text-gray-200">{e}</code>
            <CopyButton text={e} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton text={emails.join('\n')} />
        <button onClick={() => {const a=document.createElement('a');a.href='data:text/plain,'+encodeURIComponent(emails.join('\n'));a.download='emails.txt';a.click();}} className="btn-secondary text-xs">Export TXT</button>
      </div>
    </ToolLayout>
  );
}
