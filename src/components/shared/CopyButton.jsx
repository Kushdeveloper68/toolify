import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/fileUtils';

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className={`btn-secondary ${className}`} title="Copy to clipboard">
      {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
