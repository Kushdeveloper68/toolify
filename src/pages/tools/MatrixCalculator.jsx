import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Grid2X2 } from 'lucide-react';

function MatrixInput({ label, matrix, onChange, rows, cols }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="inline-block">
        {Array.from({length:rows}).map((_,r) => (
          <div key={r} className="flex gap-1 mb-1">
            {Array.from({length:cols}).map((_,c) => (
              <input key={c} type="number" className="w-14 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-center text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={matrix[r]?.[c]??0}
                onChange={e => {
                  const m = matrix.map(row=>[...row]);
                  if (!m[r]) m[r] = [];
                  m[r][c] = parseFloat(e.target.value)||0;
                  onChange(m);
                }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function makeMatrix(r,c,v=0) { return Array.from({length:r},()=>Array.from({length:c},()=>v)); }
function addMatrix(a,b) { return a.map((row,i)=>row.map((v,j)=>v+b[i][j])); }
function mulMatrix(a,b) {
  const r=a.length,c=b[0].length,n=b.length;
  const result = makeMatrix(r,c);
  for(let i=0;i<r;i++) for(let j=0;j<c;j++) for(let k=0;k<n;k++) result[i][j]+=a[i][k]*b[k][j];
  return result;
}
function transpose(m) { return m[0].map((_,i)=>m.map(row=>row[i])); }
function det2(m) { return m[0][0]*m[1][1]-m[0][1]*m[1][0]; }
function det(m) {
  if(m.length===1) return m[0][0];
  if(m.length===2) return det2(m);
  return m[0].reduce((s,v,j)=>s+v*Math.pow(-1,j)*det(m.slice(1).map(r=>[...r.slice(0,j),...r.slice(j+1)])),0);
}

export default function MatrixCalculator() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matA, setMatA] = useState([[1,2],[3,4]]);
  const [matB, setMatB] = useState([[5,6],[7,8]]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [op, setOp] = useState('add');

  const compute = () => {
    try {
      setError('');
      if (op==='add') setResult(addMatrix(matA,matB));
      else if (op==='mul') setResult(mulMatrix(matA,matB));
      else if (op==='transA') setResult(transpose(matA));
      else if (op==='detA') setResult([[det(matA)]]);
    } catch(e) { setError(e.message); }
  };

  const ops = [{k:'add',l:'A + B'},{k:'mul',l:'A × B'},{k:'transA',l:'Transpose A'},{k:'detA',l:'Det(A)'}];

  return (
    <ToolLayout title="Matrix Calculator" description="Perform matrix operations: add, multiply, transpose, determinant" icon={Grid2X2}>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label">Rows</label>
          <input type="number" className="input w-16" value={rows} min={1} max={5} onChange={e=>{const n=Number(e.target.value);setRows(n);setMatA(makeMatrix(n,cols));setMatB(makeMatrix(n,cols));}} />
        </div>
        <div>
          <label className="label">Cols</label>
          <input type="number" className="input w-16" value={cols} min={1} max={5} onChange={e=>{const n=Number(e.target.value);setCols(n);setMatA(makeMatrix(rows,n));setMatB(makeMatrix(rows,n));}} />
        </div>
        <div>
          <label className="label">Operation</label>
          <select className="select" value={op} onChange={e=>setOp(e.target.value)}>
            {ops.map(o=><option key={o.k} value={o.k}>{o.l}</option>)}
          </select>
        </div>
        <button onClick={compute} className="btn-primary">Calculate</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 overflow-x-auto">
        <div className="card p-4"><MatrixInput label="Matrix A" matrix={matA} onChange={setMatA} rows={rows} cols={cols} /></div>
        {['add','mul'].includes(op) && <div className="card p-4"><MatrixInput label="Matrix B" matrix={matB} onChange={setMatB} rows={rows} cols={cols} /></div>}
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {result && (
        <div className="card p-4">
          <label className="label">Result</label>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <tbody>
                {result.map((row,i)=>(
                  <tr key={i}>
                    {row.map((v,j)=>(
                      <td key={j} className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-mono text-sm bg-blue-50 dark:bg-blue-950">
                        {parseFloat(v.toFixed(4))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
