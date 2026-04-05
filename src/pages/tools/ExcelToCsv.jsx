import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Table } from 'lucide-react';
import { downloadFile } from '../../utils/fileUtils';
import * as XLSX from 'xlsx';

export default function ExcelToCsv() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [workbook, setWorkbook] = useState(null);

  const handleFile = async (f) => {
    setFile(f);
    const ab = await f.arrayBuffer();
    const wb = XLSX.read(ab, { type: 'array' });
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    convertSheet(wb, wb.SheetNames[0]);
  };

  const convertSheet = (wb, sheetName) => {
    const ws = wb.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(ws);
    setOutput(csv);
  };

  const handleSheetChange = (idx) => {
    setSelectedSheet(idx);
    if (workbook) convertSheet(workbook, sheets[idx]);
  };

  return (
    <ToolLayout title="Excel to CSV" description="Convert Excel (.xlsx, .xls) files to CSV format" icon={Table}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFile} accept={{'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls']}} label="Drop Excel file here" file={file} />
      </div>
      {sheets.length > 1 && (
        <div className="card p-4 mb-4">
          <label className="label">Select Sheet</label>
          <div className="flex gap-2 flex-wrap">
            {sheets.map((s, i) => (
              <button key={s} onClick={() => handleSheetChange(i)} className={`px-3 py-1 rounded-lg text-sm font-medium ${i === selectedSheet ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">CSV Output</label>
            <button onClick={() => downloadFile(output, 'output.csv', 'text/csv')} className="btn-primary text-xs">Download CSV</button>
          </div>
          <textarea className="textarea h-64" value={output} readOnly />
        </div>
      )}
    </ToolLayout>
  );
}
