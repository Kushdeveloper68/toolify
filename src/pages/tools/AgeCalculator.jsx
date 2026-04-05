import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Calendar } from 'lucide-react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('1999-06-15');
  const [target, setTarget] = useState(new Date().toISOString().split('T')[0]);

  const calc = () => {
    const d1 = new Date(dob), d2 = new Date(target);
    if (isNaN(d1)||isNaN(d2)||d1>d2) return null;
    let y=d2.getFullYear()-d1.getFullYear(), m=d2.getMonth()-d1.getMonth(), d=d2.getDate()-d1.getDate();
    if(d<0){m--;const prev=new Date(d2.getFullYear(),d2.getMonth(),0);d+=prev.getDate();}
    if(m<0){y--;m+=12;}
    const totalDays=Math.floor((d2-d1)/(1000*60*60*24));
    const next=new Date(d1.getFullYear()+y+(m>0||d>0?1:0),d1.getMonth(),d1.getDate());
    const daysToNext=Math.ceil((next-d2)/(1000*60*60*24));
    return {y,m,d,totalDays,hours:totalDays*24,weeks:Math.floor(totalDays/7),daysToNext,nextBirthday:next.toDateString()};
  };

  const r = calc();

  return (
    <ToolLayout title="Age Calculator" description="Calculate exact age and statistics from birth date" icon={Calendar}>
      <div className="card p-6 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" className="input" value={dob} onChange={e=>setDob(e.target.value)} max={target} />
          </div>
          <div>
            <label className="label">Calculate age as of</label>
            <input type="date" className="input" value={target} onChange={e=>setTarget(e.target.value)} />
          </div>
        </div>
      </div>
      {r && (
        <div className="space-y-4">
          <div className="card p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
            <p className="text-blue-200 text-sm mb-1">You are</p>
            <p className="text-5xl font-extrabold">{r.y}</p>
            <p className="text-blue-200">years, {r.m} months, {r.d} days old</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:'Total Days',value:r.totalDays.toLocaleString()},
              {label:'Total Hours',value:r.hours.toLocaleString()},
              {label:'Total Weeks',value:r.weeks.toLocaleString()},
              {label:'Days to Birthday',value:r.daysToNext>0?r.daysToNext:'Today! 🎂'},
            ].map(s=>(
              <div key={s.label} className="card p-4 text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="card p-4 text-center text-sm text-gray-500">
            Next birthday: <strong className="text-gray-900 dark:text-white">{r.nextBirthday}</strong>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
