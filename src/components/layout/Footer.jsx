import { Link } from 'react-router-dom';
import { Zap, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Toolify</span>
            <span className="text-gray-400 text-sm">— 60+ free browser tools</span>
          </div>
          <p className="text-sm text-gray-400">100% free · No signup · No backend · Open source</p>
        </div>
      </div>
    </footer>
  );
}
