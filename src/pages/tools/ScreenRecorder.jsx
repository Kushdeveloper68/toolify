import { useState, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Monitor, Circle, Square, Download } from 'lucide-react';

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      mr.ondataavailable = e => { if(e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: 'video/webm' });
        setBlob(b);
        if (videoRef.current) videoRef.current.src = URL.createObjectURL(b);
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
      };
      mr.start(1000);
      mediaRecorderRef.current = mr;
      setRecording(true);
      setBlob(null);
      setError('');
      stream.getVideoTracks()[0].onended = () => mr.stop();
    } catch(e) {
      setError(e.message || 'Screen recording permission denied');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  const download = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='recording.webm'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Screen Recorder" description="Record your screen directly in the browser" icon={Monitor} badge="Browser API">
      <div className="card p-8 text-center">
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${recording ? 'bg-red-100 animate-pulse' : 'bg-blue-50'}`}>
          <Monitor size={40} className={recording ? 'text-red-500' : 'text-blue-500'} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {recording ? 'Recording in progress...' : blob ? 'Recording complete' : 'Ready to record'}
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          {recording ? 'Stop sharing to end the recording' : 'Click start to share and record your screen'}
        </p>
        <div className="flex justify-center gap-3">
          {!recording && !blob && (
            <button onClick={start} className="btn-primary gap-2">
              <Circle size={16} className="fill-current" /> Start Recording
            </button>
          )}
          {recording && (
            <button onClick={stop} className="btn-danger gap-2">
              <Square size={16} /> Stop Recording
            </button>
          )}
          {blob && !recording && (
            <>
              <button onClick={start} className="btn-secondary">Record Again</button>
              <button onClick={download} className="btn-primary gap-2">
                <Download size={16} /> Download WebM
              </button>
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
      {blob && (
        <div className="card p-4 mt-4">
          <label className="label">Preview</label>
          <video ref={videoRef} controls className="w-full rounded-lg" />
        </div>
      )}
    </ToolLayout>
  );
}
