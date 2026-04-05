import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const GRADE_MAP = {
  'O':10,'A+':9,'A':8,'B+':7,'B':6,'C':5,'P':4,'F':0,
  'A+*':10,'A*':9,
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState([
    {name:'Mathematics',credits:4,grade:'O'},
    {name:'Physics',credits:3,grade:'A+'},
    {name:'Chemistry',credits:3,grade:'A'},
    {name:'English',credits:2,grade:'B+'},
  ]);
  const [scale, setScale] = useState('10');

  const addCourse = () => setCourses(c=>[...c,{name:'',credits:3,grade:'A'}]);
  const remove = i => setCourses(c=>c.filter((_,idx)=>idx!==i));
  const update = (i,k,v) => setCourses(c=>c.map((c2,idx)=>idx===i?{...c2,[k]:v}:c2));

  const totalCredits = courses.reduce((s,c)=>s+Number(c.credits),0);
  const weightedSum = courses.reduce((s,c)=>s+Number(c.credits)*(GRADE_MAP[c.grade]??0),0);
  const cgpa = totalCredits ? (weightedSum/totalCredits).toFixed(2) : '0.00';
  const gpa4 = (parseFloat(cgpa)*4/10).toFixed(2);
  const pct = (parseFloat(cgpa)*9.5).toFixed(1);

  return (
    <ToolLayout title="GPA / CGPA Calculator" description="Calculate GPA and CGPA for students" icon={GraduationCap}>
      <div className="card p-4 mb-4 space-y-2">
        {courses.map((c,i)=>(
          <div key={i} className="flex gap-2 items-center">
            <input className="input flex-1" placeholder="Course name" value={c.name} onChange={e=>update(i,'name',e.target.value)} />
            <input type="number" className="input w-16 text-center" placeholder="Credits" value={c.credits} min={1} max={10} onChange={e=>update(i,'credits',Number(e.target.value))} />
            <select className="select w-20" value={c.grade} onChange={e=>update(i,'grade',e.target.value)}>
              {Object.keys(GRADE_MAP).map(g=><option key={g} value={g}>{g} ({GRADE_MAP[g]})</option>)}
            </select>
            <button onClick={()=>remove(i)} className="btn-ghost p-2 text-red-400"><Trash2 size={14}/></button>
          </div>
        ))}
        <button onClick={addCourse} className="btn-secondary gap-2 text-xs"><Plus size={13}/>Add Course</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:'CGPA (10-scale)',value:cgpa,big:true},
          {label:'GPA (4-scale)',value:gpa4},
          {label:'Percentage',value:pct+'%'},
          {label:'Total Credits',value:totalCredits},
        ].map(r=>(
          <div key={r.label} className={`card p-4 text-center ${r.big?'border-2 border-blue-300 bg-blue-50 dark:bg-blue-950':''}`}>
            <p className={`font-bold ${r.big?'text-4xl text-blue-600':'text-2xl text-gray-900 dark:text-white'}`}>{r.value}</p>
            <p className="text-xs text-gray-500 mt-1">{r.label}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
