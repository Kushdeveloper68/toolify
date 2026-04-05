import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { FileType } from 'lucide-react';
import { marked } from 'marked';
import { downloadFile } from '../../utils/fileUtils';

export default function MarkdownToHtml() {
  const [input, setInput] = useState(`# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n- Item 1\n- Item 2\n- Item 3\n\n\`\`\`js\nconsole.log('Hello!');\n\`\`\``);
  const [view, setView] = useState('split');

  const html = marked.parse(input);

  return (
    <ToolLayout title="Markdown to HTML" description="Convert Markdown to HTML with live preview" icon={FileType}>
      <div className="card p-4 mb-4 flex gap-3 items-center">
        {['split','preview','html'].map(v => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${view===v?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
        ))}
        <div className="flex-1"/>
        <CopyButton text={html} />
        <button onClick={() => downloadFile(html,'output.html','text/html')} className="btn-secondary text-xs">Download HTML</button>
      </div>
      <div className={`grid gap-4 ${view==='split'?'grid-cols-2':'grid-cols-1'}`}>
        {view !== 'preview' && (
          <div className="card p-4">
            <label className="label">Markdown Input</label>
            <textarea className="textarea h-96" value={input} onChange={e => setInput(e.target.value)} />
          </div>
        )}
        {view !== 'html' && (
          <div className="card p-4">
            <label className="label">Preview</label>
            <div className="prose prose-sm max-w-none border border-gray-100 rounded-lg p-4 h-96 overflow-y-auto bg-white" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
        {view === 'html' && (
          <div className="card p-4">
            <label className="label">HTML Output</label>
            <textarea className="textarea h-96" value={html} readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
