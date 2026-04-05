import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Stamp } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../../utils/fileUtils';

export default function PdfWatermark() {
  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState('#ff0000');
  const [loading, setLoading] = useState(false);

  const addWatermark = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const ab = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(ab);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const hexToRgb = h => { const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255; return rgb(r,g,b); };

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textSize = Math.min(width, height) / 10;
        const textWidth = font.widthOfTextAtSize(watermark, textSize);
        page.drawText(watermark, {
          x: (width - textWidth) / 2, y: height / 2,
          size: textSize, font, color: hexToRgb(color),
          opacity, rotate: { type: 'degrees', angle: -45 }
        });
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'watermarked.pdf'; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="PDF Watermark" description="Add text watermark to PDF pages" icon={Stamp}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          <FileDropzone onFile={setFile} accept={{'application/pdf':['.pdf']}} label="Drop PDF file here" file={file} />
        </div>
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Watermark Text</label>
            <input className="input" value={watermark} onChange={e => setWatermark(e.target.value)} />
          </div>
          <div>
            <label className="label">Color</label>
            <input type="color" className="h-10 w-full rounded-lg border border-gray-200 cursor-pointer" value={color} onChange={e => setColor(e.target.value)} />
          </div>
          <div>
            <label className="label">Opacity: {opacity}</label>
            <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full" />
          </div>
          <button onClick={addWatermark} disabled={!file || loading} className="btn-primary w-full">
            {loading ? 'Processing...' : 'Add Watermark & Download'}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
