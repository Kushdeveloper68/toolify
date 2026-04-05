import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { FileText } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function TextToPdf() {
  const [text, setText] = useState('Hello World!\n\nThis is a sample document created by Toolify.\n\nYou can type any text here and convert it to PDF.');
  const [title, setTitle] = useState('My Document');
  const [fontSize, setFontSize] = useState(12);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage([595, 842]);
      const { height } = page.getSize();
      const margin = 50;
      const lineHeight = fontSize * 1.5;
      const maxWidth = 595 - margin * 2;

      const lines = text.split('\n');
      let y = height - margin - fontSize;

      for (const rawLine of lines) {
        const words = rawLine.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const w = font.widthOfTextAtSize(testLine, fontSize);
          if (w > maxWidth && currentLine) {
            if (y < margin) { pdfDoc.addPage([595,842]); y = 842 - margin - fontSize; }
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) });
            y -= lineHeight;
            currentLine = word;
          } else { currentLine = testLine; }
        }
        if (y < margin) { pdfDoc.addPage([595,842]); y = 842 - margin - fontSize; }
        if (currentLine) page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) });
        y -= lineHeight;
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${title || 'document'}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Text to PDF" description="Convert plain text to a downloadable PDF file" icon={FileText}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4">
          <label className="label">Text Content</label>
          <textarea className="textarea h-80" value={text} onChange={e => setText(e.target.value)} placeholder="Type your text here..." />
        </div>
        <div className="card p-4 space-y-4">
          <div>
            <label className="label">Document Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Font Size: {fontSize}px</label>
            <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
          <button onClick={generate} disabled={loading || !text} className="btn-primary w-full mt-4">
            {loading ? 'Generating...' : 'Generate & Download PDF'}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
