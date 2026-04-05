import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Code2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function HtmlToPdf() {
  const [html, setHtml] = useState(`<div style="font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">My Report</h1>
  <p>This is a <strong>sample HTML document</strong> that will be converted to PDF.</p>
  <h2>Features</h2>
  <ul>
    <li>Supports all HTML elements</li>
    <li>Preserves CSS styles</li>
    <li>Downloads as PDF</li>
  </ul>
</div>`);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '794px';
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p','mm','a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData,'PNG',0,0,pdfW,pdfH);
      pdf.save('output.pdf');
    } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="HTML to PDF" description="Convert HTML content to a downloadable PDF" icon={Code2}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">HTML Input</label>
          <textarea className="textarea h-80" value={html} onChange={e => setHtml(e.target.value)} />
          <button onClick={generate} disabled={loading} className="btn-primary mt-3 w-full">
            {loading ? 'Generating PDF...' : 'Convert to PDF'}
          </button>
        </div>
        <div className="card p-4">
          <label className="label">Preview</label>
          <div className="border border-gray-100 rounded-lg h-80 overflow-y-auto bg-white p-2" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </ToolLayout>
  );
}
