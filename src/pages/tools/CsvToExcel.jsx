import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Table } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function CsvToExcel() {
  const [input, setInput] = useState('Name,Age,City\nAlice,30,Mumbai\nBob,25,Delhi');
  const [filename, setFilename] = useState('output');

  const convert = () => {
    const lines = input.trim().split('\n');
    const data = lines.map(line => line.split(',').map(v => v.trim().replace(/^"|"$/g,'')));
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <ToolLayout title="CSV to Excel" description="Convert CSV data to Excel (.xlsx) spreadsheet" icon={Table}>
      <div className="card p-6">
        <label className="label">CSV Input</label>
        <textarea className="textarea h-48 mb-4" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste CSV data here..." />
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="label">Output filename</label>
            <input className="input" value={filename} onChange={e => setFilename(e.target.value)} />
          </div>
          <button onClick={convert} className="btn-primary">Download Excel</button>
        </div>
      </div>
    </ToolLayout>
  );
}
