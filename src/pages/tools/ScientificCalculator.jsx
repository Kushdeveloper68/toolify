import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Calculator } from 'lucide-react';

const buttons = [
  ['C','±','%','÷'],
  ['7','8','9','×'],
  ['4','5','6','−'],
  ['1','2','3','+'],
  ['sin','cos','tan','√'],
  ['log','ln','π','e'],
  ['(',')','^','!'],
  ['0','.','=',''],
];

function factorial(n) {
  if (n < 0) throw new Error('Invalid');
  if (n <= 1) return 1;
  return n * factorial(n-1);
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const press = (btn) => {
    if (btn === 'C') { setDisplay('0'); setExpr(''); setHasResult(false); return; }
    if (btn === '±') { setDisplay(d => d.startsWith('-') ? d.slice(1) : '-'+d); return; }
    if (btn === '%') { setDisplay(d => String(parseFloat(d)/100)); return; }
    if (btn === '=') {
      try {
        let e = expr + display;
        e = e.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,String(Math.PI)).replace(/e/g,String(Math.E));
        e = e.replace(/sin\(([^)]+)\)/g,(_,x)=>Math.sin(parseFloat(x)*Math.PI/180));
        e = e.replace(/cos\(([^)]+)\)/g,(_,x)=>Math.cos(parseFloat(x)*Math.PI/180));
        e = e.replace(/tan\(([^)]+)\)/g,(_,x)=>Math.tan(parseFloat(x)*Math.PI/180));
        e = e.replace(/√(\d+\.?\d*)/g,(_,x)=>Math.sqrt(parseFloat(x)));
        e = e.replace(/log\(([^)]+)\)/g,(_,x)=>Math.log10(parseFloat(x)));
        e = e.replace(/ln\(([^)]+)\)/g,(_,x)=>Math.log(parseFloat(x)));
        e = e.replace(/(\d+)!/g,(_,x)=>factorial(parseInt(x)));
        e = e.replace(/\^/g,'**');
        const result = Function('"use strict"; return ('+e+')')();
        setDisplay(String(parseFloat(result.toFixed(10))));
        setExpr('');
        setHasResult(true);
      } catch { setDisplay('Error'); }
      return;
    }
    const fns = ['sin','cos','tan','log','ln','√'];
    if (fns.includes(btn)) {
      if (hasResult) { setExpr(btn+'('+display+')'); setDisplay(''); setHasResult(false); }
      else { setExpr(e => e+btn+'('); }
      return;
    }
    const ops = ['÷','×','−','+','^','(',')'];
    if (ops.includes(btn)) {
      setExpr(e => e+display+btn);
      setDisplay('');
      setHasResult(false);
      return;
    }
    const specials = ['π','e'];
    if (specials.includes(btn)) {
      setDisplay(btn === 'π' ? String(Math.PI) : String(Math.E));
      setHasResult(false);
      return;
    }
    if (hasResult && !ops.includes(btn)) { setDisplay(btn === '.' ? '0.' : btn); setHasResult(false); return; }
    setDisplay(d => {
      if (btn === '.') return d.includes('.') ? d : d+'.';
      if (d === '0') return btn;
      return d+btn;
    });
  };

  const btnStyle = (btn) => {
    if (['÷','×','−','+','='].includes(btn)) return 'bg-blue-500 hover:bg-blue-600 text-white font-bold';
    if (['C','±','%'].includes(btn)) return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold';
    if (['sin','cos','tan','√','log','ln','^','!','π','e'].includes(btn)) return 'bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-medium text-xs';
    return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-semibold';
  };

  return (
    <ToolLayout title="Scientific Calculator" description="Full-featured scientific calculator" icon={Calculator}>
      <div className="max-w-sm mx-auto card overflow-hidden shadow-xl">
        <div className="bg-gray-900 p-4">
          <p className="text-gray-400 text-sm text-right h-5">{expr}</p>
          <p className="text-white text-4xl font-light text-right truncate">{display || '0'}</p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-900 grid grid-cols-4 gap-1.5">
          {buttons.flat().map((btn, i) => btn ? (
            <button key={i} onClick={()=>press(btn)}
              className={`rounded-xl py-3 text-sm transition-all active:scale-95 ${btnStyle(btn)}`}>
              {btn}
            </button>
          ) : <div key={i}/>)}
        </div>
      </div>
    </ToolLayout>
  );
}
