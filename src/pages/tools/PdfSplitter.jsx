import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../../utils/fileUtils';

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState('');
  const [mode, setMode] = useState('range');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = async (f) => {
    setFile(f);
    const ab = await readFileAsArrayBuffer(f);
    const pdf = await PDFDocument.load(ab);
    setPageCount(pdf.getPageCount());
    setMessage('');
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const ab = await readFileAsArrayBuffer(file);
      const srcPdf = await PDFDocument.load(ab);

      if (mode === 'all') {
        for (let i = 0; i < srcPdf.getPageCount(); i++) {
          const newPdf = await PDFDocument.create();
          const [p] = await newPdf.copyPages(srcPdf, [i]);
          newPdf.addPage(p);
          const bytes = await newPdf.save();
          const blob = new Blob([bytes],{type:'application/pdf'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href=url; a.download=`page_${i+1}.pdf`; a.click();
          URL.revokeObjectURL(url);
        }
        setMessage(`Split into ${srcPdf.getPageCount()} files`);
      } else {
        const nums = pages.split(',').flatMap(p => {
          const [s,e] = p.trim().split('-').map(Number);
          if (e) return Array.from({length:e-s+1},(_,i)=>s+i-1);
          return [s-1];
        }).filter(n => n>=0 && n<srcPdf.getPageCount());

        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(srcPdf, nums);
        copied.forEach(p => newPdf.addPage(p));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes],{type:'application/pdf'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='split.pdf'; a.click();
        URL.revokeObjectURL(url);
        setMessage(`Extracted ${nums.length} pages`);
      }
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="PDF Splitter" description="Split PDF files by pages or extract specific pages" icon={Scissors}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          <FileDropzone onFile={handleFile} accept={{'application/pdf':['.pdf']}} label="Drop PDF file here" file={file} />
          {pageCount > 0 && <p className="text-sm text-gray-500 mt-2">{pageCount} pages detected</p>}
        </div>
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Split Mode</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={mode==='all'} onChange={() => setMode('all')} />
                <span className="text-sm">Split all pages</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={mode==='range'} onChange={() => setMode('range')} />
                <span className="text-sm">Extract pages</span>
              </label>
            </div>
          </div>
          {mode === 'range' && (
            <div>
              <label className="label">Pages (e.g. 1,3,5-8)</label>
              <input className="input" value={pages} onChange={e => setPages(e.target.value)} placeholder="1,3,5-8" />
            </div>
          )}
          <button onClick={split} disabled={!file || loading} className="btn-primary w-full">
            {loading ? 'Splitting...' : 'Split PDF'}
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
