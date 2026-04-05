import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ToolLayout({ title, description, icon: Icon, children, badge }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={24} className="text-blue-600" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {badge && <span className="badge bg-green-50 text-green-700 text-xs">{badge}</span>}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
