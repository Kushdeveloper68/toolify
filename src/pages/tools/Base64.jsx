import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { Binary } from 'lucide-react';
import { readFileAsArrayBuffer } from '../../utils/fileUtils';

export default function Base64() {
  const [input, setInput] = useState('Hello, World! 🌍');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState('');

  const process = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
      setError('');
    } catch(e) { setError('Invalid input for ' + mode); }
  };

  const encodeFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ab = await readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(ab);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    const encoded = btoa(binary);
    const dataUrl = `data:${file.type};base64,${encoded}`;
    setOutput(dataUrl);
    if (file.type.startsWith('image/')) setImgSrc(dataUrl);
    else setImgSrc('');
  };

  return (
    <ToolLayout title="Base64 Encode / Decode" description="Encode and decode Base64 strings and files" icon={Binary}>
      <div className="card p-4 mb-4 flex gap-3">
        <button onClick={()=>setMode('encode')} className={`btn-${mode==='encode'?'primary':'secondary'}`}>Encode</button>
        <button onClick={()=>setMode('decode')} className={`btn-${mode==='decode'?'primary':'secondary'}`}>Decode</button>
        <div className="border-l border-gray-200 pl-3 ml-1">
          <label className="text-xs text-gray-500 mr-2">Encode file:</label>
          <input type="file" className="text-xs" onChange={encodeFile} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="label">{mode==='encode'?'Plain Text Input':'Base64 Input'}</label>
          <textarea className="textarea h-48" value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='encode'?'Enter text to encode...':'Enter Base64 to decode...'} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <button onClick={process} className="btn-primary mt-3 w-full">{mode==='encode'?'Encode to Base64':'Decode from Base64'}</button>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">{mode==='encode'?'Base64 Output':'Decoded Output'}</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea className="textarea h-48" value={output} readOnly />
          {imgSrc && <img src={imgSrc} alt="Base64 preview" className="mt-3 max-h-40 rounded-lg" />}
        </div>
      </div>
    </ToolLayout>
  );
}
