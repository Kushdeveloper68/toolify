import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Film } from 'lucide-react';

export default function VideoToGif() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [fps, setFps] = useState(10);
  const [scale, setScale] = useState(320);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);

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
      const ext = file.name.split('.').pop()||'mp4';
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      setProgress('Generating GIF...');
      await ffmpeg.exec(['-ss',String(startTime),'-t',String(duration),'-i',`input.${ext}`,'-vf',`fps=${fps},scale=${scale}:-1:flags=lanczos`,'-loop','0','output.gif']);
      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data.buffer],{type:'image/gif'});
      setResult(blob);
      setProgress('Done!');
    } catch(e) { setProgress('Error: '+e.message); }
    setLoading(false);
  };

  return (
    <ToolLayout title="Video to GIF" description="Convert video clips to animated GIF" icon={Film} badge="FFmpeg.wasm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">⚠️ Requires FFmpeg.wasm. Keep duration short (≤10s) for best results.</div>
      <div className="card p-4 mb-4"><FileDropzone onFile={setFile} accept={{'video/*':['.mp4','.webm','.mov','.avi']}} label="Drop video file here" file={file} /></div>
      <div className="card p-4 mb-4 grid grid-cols-2 gap-4">
        <div><label className="label">Start Time (s): {startTime}</label><input type="range" min={0} max={60} value={startTime} onChange={e=>setStartTime(Number(e.target.value))} className="w-full"/></div>
        <div><label className="label">Duration (s): {duration}</label><input type="range" min={1} max={15} value={duration} onChange={e=>setDuration(Number(e.target.value))} className="w-full"/></div>
        <div><label className="label">FPS: {fps}</label><input type="range" min={5} max={30} value={fps} onChange={e=>setFps(Number(e.target.value))} className="w-full"/></div>
        <div><label className="label">Width: {scale}px</label><input type="range" min={160} max={640} step={32} value={scale} onChange={e=>setScale(Number(e.target.value))} className="w-full"/></div>
      </div>
      <button onClick={convert} disabled={!file||loading} className="btn-primary mb-4">{loading?'Converting...':'Convert to GIF'}</button>
      {progress && <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">{progress}</p>}
      {result && !loading && (
        <div className="card p-4">
          <img src={URL.createObjectURL(result)} alt="GIF preview" className="rounded-lg max-w-full mb-3" />
          <button onClick={()=>{const u=URL.createObjectURL(result);const a=document.createElement('a');a.href=u;a.download='output.gif';a.click();URL.revokeObjectURL(u);}} className="btn-primary">Download GIF</button>
        </div>
      )}
    </ToolLayout>
  );
}
