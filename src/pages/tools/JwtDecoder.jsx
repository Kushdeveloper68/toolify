import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import CopyButton from '../../components/shared/CopyButton';
import { KeyRound } from 'lucide-react';

function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const decode = (str) => {
    const padded = str.replace(/-/g,'+').replace(/_/g,'/');
    const padLen = (4 - padded.length % 4) % 4;
    return JSON.parse(atob(padded + '='.repeat(padLen)));
  };
  return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
}

export default function JwtDecoder() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const decode = () => {
    try { setDecoded(decodeJWT(token)); setError(''); }
    catch(e) { setError(e.message); setDecoded(null); }
  };

  const isExpired = decoded?.payload?.exp && decoded.payload.exp < Date.now()/1000;

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JWT tokens" icon={KeyRound}>
      <div className="card p-4 mb-4">
        <label className="label">JWT Token</label>
        <textarea className="textarea h-24 mb-3" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here..." />
        <button onClick={decode} className="btn-primary">Decode JWT</button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-4">
            <label className="label">Header</label>
            <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300 overflow-auto">{JSON.stringify(decoded.header,null,2)}</pre>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Payload</label>
              {isExpired && <span className="badge bg-red-50 text-red-600 text-xs">Expired</span>}
            </div>
            <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-300 overflow-auto">{JSON.stringify(decoded.payload,null,2)}</pre>
            {decoded.payload.exp && (
              <p className="text-xs text-gray-500 mt-2">
                Expires: {new Date(decoded.payload.exp*1000).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
