import { useState, useMemo } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Lock, Eye, EyeOff } from 'lucide-react';

function analyze(pwd) {
  const checks = {
    length: pwd.length >= 8,
    longLength: pwd.length >= 12,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    digits: /[0-9]/.test(pwd),
    symbols: /[^A-Za-z0-9]/.test(pwd),
    noCommon: !['password','123456','qwerty','admin','letmein','welcome'].some(w=>pwd.toLowerCase().includes(w)),
  };
  const score = Object.values(checks).filter(Boolean).length;
  let strength, color;
  if (score <= 2) { strength='Very Weak'; color='red'; }
  else if (score <= 3) { strength='Weak'; color='orange'; }
  else if (score <= 5) { strength='Moderate'; color='yellow'; }
  else if (score <= 6) { strength='Strong'; color='green'; }
  else { strength='Very Strong'; color='emerald'; }
  return { checks, score, strength, color, pct: Math.round((score/7)*100) };
}

const colorMap = { red:'bg-red-500', orange:'bg-orange-500', yellow:'bg-yellow-500', green:'bg-green-500', emerald:'bg-emerald-500' };
const textMap = { red:'text-red-600', orange:'text-orange-600', yellow:'text-yellow-600', green:'text-green-600', emerald:'text-emerald-600' };

export default function PasswordStrength() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const result = useMemo(() => pwd ? analyze(pwd) : null, [pwd]);

  const checkLabels = {
    length: 'At least 8 characters',
    longLength: 'At least 12 characters',
    uppercase: 'Contains uppercase letter',
    lowercase: 'Contains lowercase letter',
    digits: 'Contains number',
    symbols: 'Contains special character',
    noCommon: 'Not a common password',
  };

  return (
    <ToolLayout title="Password Strength Checker" description="Check your password strength with detailed feedback" icon={Lock}>
      <div className="card p-6 mb-4">
        <label className="label">Enter Password</label>
        <div className="relative">
          <input type={show?'text':'password'} className="input pr-10 text-base" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Type your password..." />
          <button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold text-lg ${textMap[result.color]}`}>{result.strength}</span>
              <span className="text-sm text-gray-500">{result.pct}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
              <div className={`${colorMap[result.color]} h-3 rounded-full transition-all duration-500`} style={{width:`${result.pct}%`}} />
            </div>
          </div>
          <div className="card p-4">
            <label className="label">Security Checks</label>
            <div className="space-y-2">
              {Object.entries(result.checks).map(([k,v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${v?'bg-green-100 text-green-600':'bg-red-100 text-red-500'}`}>{v?'✓':'✗'}</span>
                  <span className={`text-sm ${v?'text-gray-700 dark:text-gray-300':'text-gray-400'}`}>{checkLabels[k]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <label className="label">Tips</label>
            <ul className="text-sm text-gray-500 space-y-1">
              {!result.checks.length && <li>• Use at least 8 characters</li>}
              {!result.checks.symbols && <li>• Add symbols like !@#$%^&*</li>}
              {!result.checks.digits && <li>• Include numbers</li>}
              {!result.checks.uppercase && <li>• Add uppercase letters</li>}
              {!result.checks.noCommon && <li>• Avoid common passwords</li>}
              {result.score >= 6 && <li className="text-green-600">✓ This is a strong password!</li>}
            </ul>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
