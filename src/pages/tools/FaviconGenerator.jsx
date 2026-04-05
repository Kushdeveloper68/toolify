import { useState } from 'react';
import ToolLayout from '../../components/shared/ToolLayout';
import FileDropzone from '../../components/shared/FileDropzone';
import { Star } from 'lucide-react';
import { readFileAsDataURL } from '../../utils/fileUtils';

const SIZES = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [favicons, setFavicons] = useState([]);

  const handleFile = async (f) => {
    setFile(f);
    const url = await readFileAsDataURL(f);
    setPreview(url);
    setFavicons([]);
  };

  const generate = () => {
    const img = new Image();
    img.onload = () => {
      const results = SIZES.map(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        canvas.getContext('2d').drawImage(img,0,0,size,size);
        return { size, url: canvas.toDataURL('image/png') };
      });
      setFavicons(results);
    };
    img.src = preview;
  };

  return (
    <ToolLayout title="Favicon Generator" description="Generate favicons in multiple sizes from any image" icon={Star}>
      <div className="card p-6 mb-4">
        <FileDropzone onFile={handleFile} accept={{'image/*':[]}} label="Drop image here (square image recommended)" file={file} />
      </div>
      {file && (
        <div className="flex gap-3 mb-4">
          <button onClick={generate} className="btn-primary">Generate Favicons</button>
        </div>
      )}
      {favicons.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Generated Favicons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {favicons.map(f => (
              <div key={f.size} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                  <img src={f.url} alt={`${f.size}x${f.size}`} style={{width:f.size>64?64:f.size,height:f.size>64?64:f.size}} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{f.size}×{f.size}</p>
                <a href={f.url} download={`favicon-${f.size}.png`} className="text-xs text-blue-600 hover:underline">Download</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
