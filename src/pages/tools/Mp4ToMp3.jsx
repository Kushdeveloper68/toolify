import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Music } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

export default function Mp4ToMp3() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);

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
      setProgress('Converting...');
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      await ffmpeg.exec(['-i','input.mp4','-vn','-acodec','libmp3lame','-q:a','2','output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
      setResult(blob);
      setProgress('Done!');
    } catch(e) {
      setProgress('Error: ' + e.message);
    }
    setLoading(false);
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url; a.download = (file.name.replace(/\.[^.]+$/,'') || 'audio') + '.mp3'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="MP4 to MP3" description="Extract audio track from video files using FFmpeg.wasm" icon={Music} badge="FFmpeg.wasm">
      <div className="card p-4 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
          ⚠️ This tool requires downloading FFmpeg.wasm (~31 MB) on first use. Please be patient.
        </div>
        <FileDropzone onFile={setFile} accept={{'video/*':['.mp4','.mkv','.avi','.mov','.webm']}} label="Drop video file here (MP4, MKV, AVI...)" file={file} />
      </div>
      <button onClick={convert} disabled={!file || loading} className="btn-primary mb-4">
        {loading ? 'Converting...' : 'Extract MP3 Audio'}
      </button>
      {progress && <p className="text-sm text-gray-500 font-mono mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{progress}</p>}
      {result && !loading && (
        <div className="card p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium text-sm">MP3 Ready</p>
            <p className="text-xs text-gray-400">{formatFileSize(result.size)}</p>
            <audio src={URL.createObjectURL(result)} controls className="mt-2 w-full" />
          </div>
          <button onClick={download} className="btn-primary text-xs">Download MP3</button>
        </div>
      )}
    </ToolLayout>
  );
}
