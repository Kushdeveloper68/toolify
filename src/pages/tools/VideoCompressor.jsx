import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Video } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

export default function VideoCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [crf, setCrf] = useState(28);

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    setProgress('Loading FFmpeg (~31MB first load)...');
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
      const ext = file.name.split('.').pop() || 'mp4';
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(file));
      setProgress('Compressing video...');
      await ffmpeg.exec(['-i',`input.${ext}`,'-c:v','libx264','-crf',String(crf),'-preset','fast','-c:a','aac','output.mp4']);
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      setResult({ blob, name: file.name.replace(/\.[^.]+$/, '') + '_compressed.mp4' });
      setProgress(`Done! Compressed from ${formatFileSize(file.size)} to ${formatFileSize(blob.size)}`);
    } catch(e) { setProgress('Error: ' + e.message); }
    setLoading(false);
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a'); a.href=url; a.download=result.name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Video Compressor" description="Compress video files using FFmpeg.wasm" icon={Video} badge="FFmpeg.wasm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
        ⚠️ Requires FFmpeg.wasm (~31 MB download on first use). Large files may take a while.
      </div>
      <div className="card p-4 mb-4">
        <FileDropzone onFile={setFile} accept={{'video/*':['.mp4','.mkv','.avi','.mov']}} label="Drop video file here" file={file} />
      </div>
      <div className="card p-4 mb-4">
        <label className="label">Quality (CRF): {crf} — Lower = better quality, larger file</label>
        <input type="range" min={18} max={51} value={crf} onChange={e => setCrf(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>High Quality (18)</span><span>Low Quality (51)</span>
        </div>
      </div>
      <button onClick={compress} disabled={!file || loading} className="btn-primary mb-4">
        {loading ? 'Compressing...' : 'Compress Video'}
      </button>
      {progress && <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4 text-gray-600">{progress}</p>}
      {result && !loading && (
        <div className="card p-4">
          <p className="font-medium text-sm mb-2">{result.name}</p>
          <p className="text-xs text-gray-400 mb-3">{formatFileSize(result.blob.size)}</p>
          <button onClick={download} className="btn-primary">Download Compressed Video</button>
        </div>
      )}
    </ToolLayout>
  );
}
