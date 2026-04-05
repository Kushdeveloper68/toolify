import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Zap, Search } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useState } from 'react';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [darkMode, setDarkMode] = useDarkMode();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14">
      <div className="flex items-center gap-3 h-full px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-ghost p-2 lg:hidden"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-ghost p-2 hidden lg:flex"
          title="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span>Toolify</span>
        </Link>

        <div className="flex-1" />

        <Link to="/" className="btn-ghost hidden sm:flex" title="Search all tools">
          <Search size={16} />
          <span className="text-sm">Search tools</span>
        </Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn-ghost p-2"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Link
          to="/"
          className="hidden md:inline-flex btn-primary py-1.5 text-xs"
        >
          All Tools
        </Link>
      </div>
    </header>
  );
}
