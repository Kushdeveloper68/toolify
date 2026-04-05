import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Database } from 'lucide-react';
import { format } from 'sql-formatter';

export default function SqlBeautifier() {
  const [input, setInput] = useState("SELECT u.name,u.email,o.total FROM users u INNER JOIN orders o ON u.id=o.user_id WHERE o.total>100 ORDER BY o.total DESC LIMIT 10;");
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');

  const formatSQL = () => {
    try {
      const result = format(input, { language: dialect, tabWidth: 2, keywordCase: 'upper' });
      setOutput(result);
    } catch(e) { setOutput('Error: ' + e.message); }
  };

  const dialects = ['sql','mysql','postgresql','sqlite','tsql','plsql'];

  return (
    <ToolLayout title="SQL Beautifier" description="Format and beautify SQL queries" icon={Database}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <label className="label mb-0">Dialect:</label>
        <select className="select w-auto" value={dialect} onChange={e => setDialect(e.target.value)}>
          {dialects.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
        </select>
        <button onClick={formatSQL} className="btn-primary">Format SQL</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">SQL Input</label>
          <textarea className="textarea h-64" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste SQL query..." />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Formatted SQL</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea className="textarea h-64" value={output} readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
