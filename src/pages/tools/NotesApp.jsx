import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { StickyNote, Plus, Trash2, Download } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function NotesApp() {
  const [notes, setNotes] = useLocalStorage('toolify-notes', [{ id: 1, title: 'Welcome Note', content: 'Start typing your notes here...', date: new Date().toISOString() }]);
  const [active, setActive] = useState(0);
  const [title, setTitle] = useState('');

  const current = notes[active] || notes[0];

  const addNote = () => {
    const note = { id: Date.now(), title: 'New Note', content: '', date: new Date().toISOString() };
    setNotes(n => [...n, note]);
    setActive(notes.length);
  };

  const updateNote = (field, val) => {
    setNotes(n => n.map((note, i) => i === active ? {...note, [field]: val, date: new Date().toISOString()} : note));
  };

  const deleteNote = (i) => {
    setNotes(n => n.filter((_, idx) => idx !== i));
    setActive(Math.max(0, i-1));
  };

  const exportTxt = () => {
    const text = notes.map(n => `=== ${n.title} ===\n${n.content}`).join('\n\n');
    const a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(text);
    a.download = 'notes.txt'; a.click();
  };

  const exportPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    for (const note of notes) {
      const page = pdfDoc.addPage([595, 842]);
      let y = 800;
      page.drawText(note.title, { x:50, y, size:16, font:boldFont, color:rgb(0.15,0.4,0.9) });
      y -= 30;
      const lines = note.content.split('\n');
      for (const line of lines) {
        if (y < 50) { break; }
        page.drawText(line.slice(0,90), { x:50, y, size:11, font, color:rgb(0.1,0.1,0.1) });
        y -= 16;
      }
    }
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], {type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='notes.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Notes App" description="Quick notes with export to PDF or TXT" icon={StickyNote}>
      <div className="flex gap-4" style={{height:'70vh',minHeight:'500px'}}>
        <div className="w-56 flex-shrink-0 card p-2 flex flex-col overflow-hidden">
          <button onClick={addNote} className="btn-primary w-full mb-2 text-xs gap-1"><Plus size={13}/>New Note</button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {notes.map((n, i) => (
              <div key={n.id} onClick={() => setActive(i)}
                className={`p-2 rounded-lg cursor-pointer group relative ${i===active?'bg-blue-50 dark:bg-blue-950':'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <p className={`text-xs font-medium truncate ${i===active?'text-blue-700':'text-gray-700 dark:text-gray-300'}`}>{n.title || 'Untitled'}</p>
                <p className="text-xs text-gray-400 truncate">{n.content?.slice(0,30)||'Empty'}</p>
                <button onClick={e=>{e.stopPropagation();deleteNote(i);}} className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                  <Trash2 size={11}/>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 border-t border-gray-100 pt-2">
            <button onClick={exportTxt} className="btn-secondary w-full text-xs gap-1"><Download size={11}/>Export TXT</button>
            <button onClick={exportPdf} className="btn-secondary w-full text-xs gap-1"><Download size={11}/>Export PDF</button>
          </div>
        </div>
        {current && (
          <div className="flex-1 card p-4 flex flex-col overflow-hidden">
            <input className="input font-semibold text-base mb-3 border-0 border-b border-gray-200 rounded-none focus:ring-0 px-0" value={current.title} onChange={e=>updateNote('title',e.target.value)} placeholder="Note title..." />
            <textarea className="flex-1 resize-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 font-sans" value={current.content} onChange={e=>updateNote('content',e.target.value)} placeholder="Start typing..." />
            <p className="text-xs text-gray-400 mt-2">Last saved: {new Date(current.date).toLocaleString()} · {current.content?.length || 0} chars</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
