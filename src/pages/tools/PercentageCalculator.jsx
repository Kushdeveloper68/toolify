import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Percent } from 'lucide-react';

export default function PercentageCalculator() {
  const [vals, setVals] = useState({a1:'',b1:'',a2:'',b2:'',a3:'',b3:'',a4:'',b4:'',r4:''});
  const set = (k,v) => setVals(p=>({...p,[k]:v}));

  const calc1 = vals.a1 && vals.b1 ? (parseFloat(vals.a1)/100*parseFloat(vals.b1)).toFixed(4) : '';
  const calc2 = vals.a2 && vals.b2 ? (parseFloat(vals.a2)/parseFloat(vals.b2)*100).toFixed(4)+'%' : '';
  const calc3 = vals.a3 && vals.b3 ? ((parseFloat(vals.b3)-parseFloat(vals.a3))/parseFloat(vals.a3)*100).toFixed(4)+'%' : '';
  const calc4 = vals.a4 && vals.r4 ? (parseFloat(vals.a4)*(1+parseFloat(vals.r4)/100)).toFixed(4) : '';

  const CalcRow = ({label, children, result}) => (
    <div className="card p-4">
      <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {result && <span className="text-2xl font-bold text-blue-600 ml-2">= {result}</span>}
      </div>
    </div>
  );

  return (
    <ToolLayout title="Percentage Calculator" description="Multiple percentage calculation formulas" icon={Percent}>
      <div className="space-y-3">
        <CalcRow label="What is X% of Y?" result={calc1}>
          <input className="input w-24" placeholder="X" value={vals.a1} onChange={e=>set('a1',e.target.value)} />
          <span className="text-gray-500 font-semibold">% of</span>
          <input className="input w-24" placeholder="Y" value={vals.b1} onChange={e=>set('b1',e.target.value)} />
        </CalcRow>
        <CalcRow label="X is what % of Y?" result={calc2}>
          <input className="input w-24" placeholder="X" value={vals.a2} onChange={e=>set('a2',e.target.value)} />
          <span className="text-gray-500 font-semibold">is what % of</span>
          <input className="input w-24" placeholder="Y" value={vals.b2} onChange={e=>set('b2',e.target.value)} />
        </CalcRow>
        <CalcRow label="% change from X to Y?" result={calc3}>
          <span className="text-gray-500 text-sm">From</span>
          <input className="input w-24" placeholder="X" value={vals.a3} onChange={e=>set('a3',e.target.value)} />
          <span className="text-gray-500 text-sm">to</span>
          <input className="input w-24" placeholder="Y" value={vals.b3} onChange={e=>set('b3',e.target.value)} />
        </CalcRow>
        <CalcRow label="Add X% to amount Y?" result={calc4}>
          <input className="input w-24" placeholder="Amount" value={vals.a4} onChange={e=>set('a4',e.target.value)} />
          <span className="text-gray-500 font-semibold">+</span>
          <input className="input w-24" placeholder="%" value={vals.r4} onChange={e=>set('r4',e.target.value)} />
          <span className="text-gray-500 font-semibold">%</span>
        </CalcRow>
      </div>
    </ToolLayout>
  );
}
