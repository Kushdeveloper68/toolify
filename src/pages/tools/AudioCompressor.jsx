import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { AudioLines } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

export default function AudioCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [bitrate, setBitrate] = useState(128);

  const compress = async () => {
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
      const ext = file.name.split('.').pop() || 'mp3';
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      setProgress('Compressing...');
      await ffmpeg.exec(['-i',`input.${ext}`,'-b:a',`${bitrate}k`,'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([data.buffer],{type:'audio/mpeg'});
      setResult(blob);
      setProgress(`Done! ${formatFileSize(file.size)} → ${formatFileSize(blob.size)}`);
    } catch(e) { setProgress('Error: '+e.message); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Audio Compressor" description="Compress audio files using FFmpeg.wasm" icon={AudioLines} badge="FFmpeg.wasm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">⚠️ Requires FFmpeg.wasm (~31MB on first load)</div>
      <div className="card p-4 mb-4"><FileDropzone onFile={setFile} accept={{'audio/*':['.mp3','.wav','.aac','.flac','.ogg']}} label="Drop audio file here" file={file} /></div>
      <div className="card p-4 mb-4">
        <label className="label">Target Bitrate: {bitrate} kbps</label>
        <input type="range" min={32} max={320} step={32} value={bitrate} onChange={e => setBitrate(Number(e.target.value))} className="w-full" />
      </div>
      <button onClick={compress} disabled={!file||loading} className="btn-primary mb-4">{loading?'Compressing...':'Compress Audio'}</button>
      {progress && <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">{progress}</p>}
      {result && !loading && (
        <div className="card p-4">
          <audio src={URL.createObjectURL(result)} controls className="w-full mb-3" />
          <button onClick={()=>{const u=URL.createObjectURL(result);const a=document.createElement('a');a.href=u;a.download='compressed.mp3';a.click();URL.revokeObjectURL(u);}} className="btn-primary">Download MP3</button>
        </div>
      )}
    </ToolLayout>
  );
}
