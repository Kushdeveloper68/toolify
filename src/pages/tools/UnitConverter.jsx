import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { ArrowRightLeft } from 'lucide-react';

const categories = {
  Length: {
    units: ['meter','kilometer','centimeter','millimeter','mile','yard','foot','inch','nautical mile'],
    toBase: { meter:1, kilometer:1000, centimeter:0.01, millimeter:0.001, mile:1609.344, yard:0.9144, foot:0.3048, inch:0.0254, 'nautical mile':1852 }
  },
  Weight: {
    units: ['kilogram','gram','milligram','pound','ounce','ton','stone'],
    toBase: { kilogram:1, gram:0.001, milligram:0.000001, pound:0.453592, ounce:0.0283495, ton:1000, stone:6.35029 }
  },
  Temperature: {
    units: ['Celsius','Fahrenheit','Kelvin'],
    special: true
  },
  Area: {
    units: ['square meter','square kilometer','square foot','square inch','acre','hectare'],
    toBase: { 'square meter':1, 'square kilometer':1e6, 'square foot':0.092903, 'square inch':0.00064516, acre:4046.86, hectare:10000 }
  },
  Volume: {
    units: ['liter','milliliter','cubic meter','gallon','quart','pint','cup','fluid ounce'],
    toBase: { liter:1, milliliter:0.001, 'cubic meter':1000, gallon:3.78541, quart:0.946353, pint:0.473176, cup:0.236588, 'fluid ounce':0.0295735 }
  },
  Speed: {
    units: ['m/s','km/h','mph','knot','ft/s'],
    toBase: { 'm/s':1, 'km/h':0.277778, mph:0.44704, knot:0.514444, 'ft/s':0.3048 }
  },
  Time: {
    units: ['second','minute','hour','day','week','month','year'],
    toBase: { second:1, minute:60, hour:3600, day:86400, week:604800, month:2628000, year:31536000 }
  },
};

function convertTemp(v, from, to) {
  let c;
  if (from==='Celsius') c=v;
  else if (from==='Fahrenheit') c=(v-32)*5/9;
  else c=v-273.15;
  if (to==='Celsius') return c;
  if (to==='Fahrenheit') return c*9/5+32;
  return c+273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('meter');
  const [to, setTo] = useState('kilometer');

  const cat = categories[category];

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return 'Invalid';
    if (cat.special) return parseFloat(convertTemp(v,from,to).toFixed(6));
    const base = v * cat.toBase[from];
    return parseFloat((base / cat.toBase[to]).toFixed(8));
  };

  return (
    <ToolLayout title="Unit Converter" description="Convert between hundreds of measurement units" icon={ArrowRightLeft}>
      <div className="card p-4 mb-4">
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categories).map(c => (
            <button key={c} onClick={()=>{setCategory(c);setFrom(categories[c].units[0]);setTo(categories[c].units[1]);}} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${category===c?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="label">Value</label>
            <input type="number" className="input text-lg" value={value} onChange={e=>setValue(e.target.value)} />
            <label className="label mt-2">From</label>
            <select className="select" value={from} onChange={e=>setFrom(e.target.value)}>
              {cat.units.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="text-center">
            <button onClick={()=>{const tmp=from;setFrom(to);setTo(tmp);}} className="btn-secondary gap-2">
              <ArrowRightLeft size={16}/> Swap
            </button>
          </div>
          <div>
            <label className="label">Result</label>
            <div className="input text-lg font-semibold text-blue-600 flex items-center">{convert()}</div>
            <label className="label mt-2">To</label>
            <select className="select" value={to} onChange={e=>setTo(e.target.value)}>
              {cat.units.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
