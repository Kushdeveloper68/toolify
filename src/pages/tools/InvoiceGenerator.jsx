import { useState, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { FileSpreadsheet, Plus, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function InvoiceGenerator() {
  const [inv, setInv] = useState({
    from: { name: 'Your Company', email: 'hello@company.com', address: '123 Business St, Mumbai, Maharashtra 400001', phone: '+91 99999 99999' },
    to: { name: 'Client Name', email: 'client@example.com', address: '456 Client Ave, Delhi, Delhi 110001', phone: '+91 88888 88888' },
    number: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now()+30*86400000).toISOString().split('T')[0],
    items: [{ desc: 'Web Development', qty: 1, rate: 50000 }],
    tax: 18,
    notes: 'Thank you for your business!',
    currency: '₹',
  });

  const updateField = (section, key, val) => setInv(p=>({...p,[section]:{...p[section],[key]:val}}));
  const updateItem = (i, k, v) => setInv(p=>({...p,items:p.items.map((it,idx)=>idx===i?{...it,[k]:v}:it)}));
  const addItem = () => setInv(p=>({...p,items:[...p.items,{desc:'',qty:1,rate:0}]}));
  const removeItem = i => setInv(p=>({...p,items:p.items.filter((_,idx)=>idx!==i)}));

  const subtotal = inv.items.reduce((s,it)=>s+Number(it.qty)*Number(it.rate),0);
  const taxAmt = subtotal * inv.tax / 100;
  const total = subtotal + taxAmt;

  const fmt = n => inv.currency + parseFloat(n.toFixed(2)).toLocaleString('en-IN');

  const generatePdf = () => {
    const pdf = new jsPDF('p','mm','a4');
    let y = 20;
    pdf.setFontSize(28); pdf.setFont('helvetica','bold');
    pdf.setTextColor(37,99,235);
    pdf.text('INVOICE', 15, y); y+=10;
    pdf.setFontSize(10); pdf.setFont('helvetica','normal'); pdf.setTextColor(100,100,100);
    pdf.text(`Invoice #: ${inv.number}`, 15, y);
    pdf.text(`Date: ${inv.date}`, 120, y); y+=5;
    pdf.text(`Due: ${inv.dueDate}`, 120, y); y+=10;
    pdf.setDrawColor(200,200,200); pdf.line(15,y,195,y); y+=8;
    pdf.setFontSize(11); pdf.setFont('helvetica','bold'); pdf.setTextColor(50,50,50);
    pdf.text('FROM', 15, y); pdf.text('TO', 110, y); y+=6;
    pdf.setFont('helvetica','normal'); pdf.setFontSize(10);
    pdf.text(inv.from.name,15,y); pdf.text(inv.to.name,110,y); y+=5;
    pdf.text(inv.from.address,15,y,{maxWidth:80}); pdf.text(inv.to.address,110,y,{maxWidth:80}); y+=15;
    pdf.setFillColor(37,99,235); pdf.rect(15,y,180,8,'F');
    pdf.setTextColor(255,255,255); pdf.setFont('helvetica','bold');
    pdf.text('Description',17,y+5.5); pdf.text('Qty',120,y+5.5); pdf.text('Rate',145,y+5.5); pdf.text('Amount',170,y+5.5);
    y+=10; pdf.setTextColor(50,50,50); pdf.setFont('helvetica','normal');
    inv.items.forEach((it,i)=>{
      if(i%2===0){pdf.setFillColor(248,250,252);pdf.rect(15,y-2,180,8,'F');}
      pdf.text(it.desc||'',17,y+3.5);
      pdf.text(String(it.qty),122,y+3.5);
      pdf.text(fmt(it.rate),145,y+3.5);
      pdf.text(fmt(it.qty*it.rate),170,y+3.5);
      y+=8;
    });
    y+=5; pdf.line(15,y,195,y); y+=7;
    pdf.text(`Subtotal:`,145,y); pdf.text(fmt(subtotal),170,y); y+=6;
    pdf.text(`Tax (${inv.tax}%):`,145,y); pdf.text(fmt(taxAmt),170,y); y+=6;
    pdf.setFont('helvetica','bold'); pdf.setFontSize(12);
    pdf.text('TOTAL:',140,y); pdf.text(fmt(total),170,y); y+=10;
    if(inv.notes){pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.setTextColor(100,100,100);pdf.text('Notes: '+inv.notes,15,y);}
    pdf.save(`Invoice_${inv.number}.pdf`);
  };

  const LI = ({label,value,onChange,type='text',full}) => (
    <div className={full?'col-span-2':''}>
      <label className="text-xs font-semibold text-gray-500 mb-0.5 block">{label}</label>
      <input type={type} className="input text-sm" value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  );

  return (
    <ToolLayout title="Invoice Generator" description="Create professional invoices and download as PDF" icon={FileSpreadsheet}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">From (Your Details)</h3>
          <div className="grid grid-cols-2 gap-2">
            <LI label="Company Name" value={inv.from.name} onChange={v=>updateField('from','name',v)} full />
            <LI label="Email" value={inv.from.email} onChange={v=>updateField('from','email',v)} />
            <LI label="Phone" value={inv.from.phone} onChange={v=>updateField('from','phone',v)} />
            <LI label="Address" value={inv.from.address} onChange={v=>updateField('from','address',v)} full />
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">To (Client Details)</h3>
          <div className="grid grid-cols-2 gap-2">
            <LI label="Client Name" value={inv.to.name} onChange={v=>updateField('to','name',v)} full />
            <LI label="Email" value={inv.to.email} onChange={v=>updateField('to','email',v)} />
            <LI label="Phone" value={inv.to.phone} onChange={v=>updateField('to','phone',v)} />
            <LI label="Address" value={inv.to.address} onChange={v=>updateField('to','address',v)} full />
          </div>
        </div>
      </div>
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div><label className="label text-xs">Invoice #</label><input className="input" value={inv.number} onChange={e=>setInv(p=>({...p,number:e.target.value}))}/></div>
          <div><label className="label text-xs">Date</label><input type="date" className="input" value={inv.date} onChange={e=>setInv(p=>({...p,date:e.target.value}))}/></div>
          <div><label className="label text-xs">Due Date</label><input type="date" className="input" value={inv.dueDate} onChange={e=>setInv(p=>({...p,dueDate:e.target.value}))}/></div>
          <div><label className="label text-xs">Tax %</label><input type="number" className="input" value={inv.tax} onChange={e=>setInv(p=>({...p,tax:Number(e.target.value)}))}/></div>
        </div>
        <table className="w-full text-sm mb-3">
          <thead><tr className="bg-gray-50 dark:bg-gray-800">{['Description','Qty','Rate','Amount',''].map(h=><th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr></thead>
          <tbody>
            {inv.items.map((it,i)=>(
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-2 py-1"><input className="input text-sm" value={it.desc} onChange={e=>updateItem(i,'desc',e.target.value)} placeholder="Item description"/></td>
                <td className="px-2 py-1 w-16"><input type="number" className="input text-sm w-full" value={it.qty} onChange={e=>updateItem(i,'qty',Number(e.target.value))}/></td>
                <td className="px-2 py-1 w-28"><input type="number" className="input text-sm" value={it.rate} onChange={e=>updateItem(i,'rate',Number(e.target.value))}/></td>
                <td className="px-3 py-1 font-semibold whitespace-nowrap">{fmt(it.qty*it.rate)}</td>
                <td className="px-2"><button onClick={()=>removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItem} className="btn-secondary text-xs gap-1"><Plus size={13}/>Add Item</button>
        <div className="mt-4 text-right space-y-1">
          <p className="text-sm text-gray-500">Subtotal: <span className="font-semibold text-gray-900 dark:text-white">{fmt(subtotal)}</span></p>
          <p className="text-sm text-gray-500">Tax ({inv.tax}%): <span className="font-semibold text-gray-900 dark:text-white">{fmt(taxAmt)}</span></p>
          <p className="text-lg font-bold text-blue-600">Total: {fmt(total)}</p>
        </div>
      </div>
      <div className="card p-4 mb-4">
        <label className="label">Notes</label>
        <textarea className="textarea h-20" value={inv.notes} onChange={e=>setInv(p=>({...p,notes:e.target.value}))} />
      </div>
      <button onClick={generatePdf} className="btn-primary gap-2 w-full sm:w-auto"><Download size={16}/>Download Invoice PDF</button>
    </ToolLayout>
  );
}
