import { useState, useEffect, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Timer, Play, Pause, Square, Plus, Trash2, Download } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function TimeTracker() {
  const [tasks, setTasks] = useLocalStorage('toolify-timertasks', []);
  const [active, setActive] = useState(null);
  const [elapsed, setElapsed] = useState({});
  const [newTask, setNewTask] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active !== null) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => ({...e, [active]: (e[active]||0)+1}));
      }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), name: newTask.trim(), logged: 0, date: new Date().toLocaleDateString() }]);
    setNewTask('');
  };

  const start = (id) => { if (active === id) { stop(); } else { stop(); setActive(id); } };
  const stop = () => {
    if (active !== null) {
      setTasks(t => t.map(task => task.id === active ? {...task, logged: task.logged + (elapsed[active]||0)} : task));
      setElapsed(e => ({...e, [active]: 0}));
      setActive(null);
    }
  };

  const remove = (id) => { if (active===id) { setActive(null); } setTasks(t=>t.filter(task=>task.id!==id)); };
  const fmt = (s) => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return `${h?h+'h ':''} ${m?m+'m ':''} ${sec}s`; };
  const totalTime = tasks.reduce((s,t)=>s+t.logged+(active===t.id?(elapsed[t.id]||0):0),0);

  const exportCsv = () => {
    const rows = [['Task','Date','Time Logged (s)','Time Logged'],...tasks.map(t=>[t.name,t.date,t.logged,fmt(t.logged)])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const a = document.createElement('a'); a.href='data:text/csv,'+encodeURIComponent(csv); a.download='time_report.csv'; a.click();
  };

  return (
    <ToolLayout title="Time Tracker" description="Track time for tasks and projects" icon={Timer}>
      <div className="card p-4 mb-4">
        <div className="flex gap-2">
          <input className="input flex-1" value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Task or project name..." />
          <button onClick={addTask} className="btn-primary gap-1"><Plus size={15}/>Add</button>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">Add a task to start tracking time</div>
      ) : (
        <div className="space-y-2 mb-4">
          {tasks.map(task => {
            const isActive = active === task.id;
            const current = task.logged + (isActive ? elapsed[task.id]||0 : 0);
            return (
              <div key={task.id} className={`card p-4 flex items-center gap-3 ${isActive?'border-2 border-blue-400':''}`}>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive?'text-blue-600':''}`}>{task.name}</p>
                  <p className="text-xs text-gray-400">{task.date}</p>
                </div>
                <div className={`font-mono font-bold text-lg min-w-20 text-right ${isActive?'text-blue-600':''}`}>
                  {fmt(current)}
                </div>
                <button onClick={()=>start(task.id)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isActive?'bg-amber-500 hover:bg-amber-600':'bg-green-500 hover:bg-green-600'} text-white`}>
                  {isActive ? <Pause size={16}/> : <Play size={16}/>}
                </button>
                {isActive && <button onClick={stop} className="w-9 h-9 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"><Square size={16}/></button>}
                <button onClick={()=>remove(task.id)} className="btn-ghost p-2 text-red-400"><Trash2 size={14}/></button>
              </div>
            );
          })}
        </div>
      )}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total logged: <strong className="text-gray-900 dark:text-white">{fmt(totalTime)}</strong></p>
          <button onClick={exportCsv} className="btn-secondary gap-2 text-xs"><Download size={13}/>Export CSV</button>
        </div>
      )}
    </ToolLayout>
  );
}
