import { useState, useMemo } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Banknote } from 'lucide-react';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = tenure;
    if (r === 0) return { emi: principal/n, total: principal, interest: 0 };
    const emi = principal * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
    const total = emi * n;
    const interest = total - principal;
    return { emi, total, interest };
  }, [principal, rate, tenure]);

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  const schedule = useMemo(() => {
    const r = rate/100/12;
    let bal = principal;
    return Array.from({length:Math.min(tenure,12)},(_,i)=>{
      const int = bal*r;
      const pri = result.emi-int;
      bal -= pri;
      return { month:i+1, emi:result.emi, principal:pri, interest:int, balance:Math.max(0,bal) };
    });
  }, [principal, rate, tenure, result.emi]);

  return (
    <ToolLayout title="EMI Calculator" description="Calculate loan EMI with amortization schedule" icon={Banknote}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-6 space-y-5">
          <div>
            <label className="label">Loan Amount: {fmt(principal)}</label>
            <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={e=>setPrincipal(Number(e.target.value))} className="w-full"/>
            <input type="number" className="input mt-2" value={principal} onChange={e=>setPrincipal(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Interest Rate: {rate}% p.a.</label>
            <input type="range" min={1} max={30} step={0.1} value={rate} onChange={e=>setRate(Number(e.target.value))} className="w-full"/>
            <input type="number" className="input mt-2" value={rate} step={0.1} onChange={e=>setRate(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Tenure: {tenure} months ({(tenure/12).toFixed(1)} years)</label>
            <input type="range" min={6} max={360} step={6} value={tenure} onChange={e=>setTenure(Number(e.target.value))} className="w-full"/>
            <input type="number" className="input mt-2" value={tenure} onChange={e=>setTenure(Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="card p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <p className="text-blue-200 text-sm">Monthly EMI</p>
            <p className="text-4xl font-bold mt-1">{fmt(result.emi)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-gray-500 text-xs">Principal</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{fmt(principal)}</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-500 text-xs">Total Interest</p>
              <p className="font-bold text-lg text-red-500">{fmt(result.interest)}</p>
            </div>
            <div className="card p-4 col-span-2">
              <p className="text-gray-500 text-xs">Total Amount Payable</p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">{fmt(result.total)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-3 text-sm">Amortization (first 12 months)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 dark:bg-gray-800">{['Month','EMI','Principal','Interest','Balance'].map(h=><th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">{h}</th>)}</tr></thead>
            <tbody>
              {schedule.map(row=>(
                <tr key={row.month} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2">{row.month}</td>
                  <td className="px-3 py-2">{fmt(row.emi)}</td>
                  <td className="px-3 py-2 text-green-600">{fmt(row.principal)}</td>
                  <td className="px-3 py-2 text-red-500">{fmt(row.interest)}</td>
                  <td className="px-3 py-2">{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
