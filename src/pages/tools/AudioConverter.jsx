import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { AudioWaveform } from 'lucide-react';

export default function AudioConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);

  const mimeMap = { mp3:'audio/mpeg', wav:'audio/wav', ogg:'audio/ogg', aac:'audio/aac' };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setProgress('Loading FFmpeg...');
    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', ({ message }) => setProgress(message));
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      const ext = file.name.split('.').pop()||'mp3';
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      await ffmpeg.exec(['-i',`input.${ext}`,`output.${format}`]);
      const data = await ffmpeg.readFile(`output.${format}`);
      const blob = new Blob([data.buffer], { type: mimeMap[format] });
      setResult({ blob, name: file.name.replace(/\.[^.]+$/,'') + '.' + format });
      setProgress('Conversion complete!');
    } catch(e) { setProgress('Error: '+e.message); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Audio Converter" description="Convert between audio formats (MP3, WAV, OGG, AAC)" icon={AudioWaveform} badge="FFmpeg.wasm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">⚠️ Requires FFmpeg.wasm (~31MB on first load)</div>
      <div className="card p-4 mb-4"><FileDropzone onFile={setFile} accept={{'audio/*':['.mp3','.wav','.ogg','.aac','.flac']}} label="Drop audio file here" file={file} /></div>
      <div className="card p-4 mb-4">
        <label className="label">Output Format</label>
        <div className="flex gap-2">
          {['mp3','wav','ogg','aac'].map(f => (
            <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${format===f?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <button onClick={convert} disabled={!file||loading} className="btn-primary mb-4">{loading?'Converting...':'Convert Audio'}</button>
      {progress && <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">{progress}</p>}
      {result && !loading && (
        <div className="card p-4">
          <audio src={URL.createObjectURL(result.blob)} controls className="w-full mb-3" />
          <button onClick={()=>{const u=URL.createObjectURL(result.blob);const a=document.createElement('a');a.href=u;a.download=result.name;a.click();URL.revokeObjectURL(u);}} className="btn-primary">Download {format.toUpperCase()}</button>
        </div>
      )}
    </ToolLayout>
  );
}
