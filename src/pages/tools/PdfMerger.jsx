import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Merge, X, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer, formatFileSize } from '../../utils/fileUtils';

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState('merged');

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const remove = (i) => setFiles(prev => prev.filter((_,idx) => idx !== i));
  const moveUp = (i) => { if(i===0) return; const f=[...files]; [f[i-1],f[i]]=[f[i],f[i-1]]; setFiles(f); };
  const moveDown = (i) => { if(i===files.length-1) return; const f=[...files]; [f[i],f[i+1]]=[f[i+1],f[i]]; setFiles(f); };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const ab = await readFileAsArrayBuffer(file);
        const pdf = await PDFDocument.load(ab);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes],{type:'application/pdf'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download=`${filename}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="PDF Merger" description="Merge multiple PDF files into one document" icon={Merge}>
      <div className="card p-6 mb-4">
        <label className="dropzone block cursor-pointer">
          <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFiles} />
          <p className="font-medium text-gray-600">Click to add PDF files</p>
          <p className="text-xs text-gray-400 mt-1">You can add multiple files and reorder them</p>
        </label>
      </div>
      {files.length > 0 && (
        <div className="card p-4 mb-4">
          <p className="label mb-3">{files.length} file{files.length!==1?'s':''} added</p>
          <div className="space-y-2">
            {files.map((f,i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-400 text-sm w-6 text-center">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                </div>
                <button onClick={() => moveUp(i)} disabled={i===0} className="btn-ghost p-1"><ArrowUp size={14}/></button>
                <button onClick={() => moveDown(i)} disabled={i===files.length-1} className="btn-ghost p-1"><ArrowDown size={14}/></button>
                <button onClick={() => remove(i)} className="btn-ghost p-1 text-red-500"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="label">Output filename</label>
          <input className="input" value={filename} onChange={e => setFilename(e.target.value)} />
        </div>
        <button onClick={merge} disabled={files.length < 2 || loading} className="btn-primary">
          {loading ? 'Merging...' : `Merge ${files.length} PDFs`}
        </button>
      </div>
    </ToolLayout>
  );
}
