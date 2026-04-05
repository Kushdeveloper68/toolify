import { useState, useRef } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import { Mic, Square, Download, Play, Pause } from 'lucide-react';

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(r => [...r, { url, blob, name: `Recording ${r.length+1}`, date: new Date().toLocaleTimeString() }]);
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
        setSeconds(0);
        clearInterval(timerRef.current);
      };
      mr.start();
      mrRef.current = mr;
      setRecording(true);
      setError('');
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s+1), 1000);
    } catch(e) { setError(e.message || 'Microphone access denied'); }
  };

  const stop = () => { if (mrRef.current) mrRef.current.stop(); };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <ToolLayout title="Voice Recorder" description="Record audio from your microphone" icon={Mic} badge="Browser API">
      <div className="card p-8 text-center mb-4">
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${recording ? 'bg-red-100 animate-pulse' : 'bg-blue-50'}`}>
          <Mic size={40} className={recording ? 'text-red-500' : 'text-blue-500'} />
        </div>
        {recording && <p className="text-2xl font-mono font-bold text-red-500 mb-4">{fmt(seconds)}</p>}
        <div className="flex justify-center gap-3">
          {!recording && <button onClick={start} className="btn-primary"><Circle size={16} className="fill-current mr-2" />Start Recording</button>}
          {recording && <button onClick={stop} className="btn-danger"><Square size={16} className="mr-2" />Stop</button>}
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
      {recordings.length > 0 && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Recordings</h3>
          {recordings.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-gray-400">{r.date}</p>
                <audio src={r.url} controls className="mt-2 w-full h-8" />
              </div>
              <a href={r.url} download={`${r.name}.webm`} className="btn-primary text-xs">
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}

function Circle(props) { return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>; }
