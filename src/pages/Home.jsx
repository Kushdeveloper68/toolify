import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { tools, toolCategories, colorMap } from '../data/tools';
import { Search, Zap, ArrowRight, Star } from 'lucide-react';

const stats = [
  { label: 'Free Tools', value: '60+' },
  { label: 'No Signup', value: '100%' },
  { label: 'Browser-based', value: '100%' },
  { label: 'Open Source', value: 'Yes' },
];

function ToolCard({ tool }) {
  const Icon = Icons[tool.icon] || Icons.Wrench;
  const colorClass = colorMap[tool.color] || colorMap.blue;
  return (
    <Link
      to={tool.path}
      className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-start gap-3"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
          {tool.desc}
        </p>
      </div>
    </Link>
  );
}

function CategoryGroup({ category, tools: catTools }) {
  const Icon = Icons[category.icon] || Icons.Folder;
  if (catTools.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{category.label}</h2>
        <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{catTools.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {catTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </section>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return tools.filter(t => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    return toolCategories.filter(c => c.id !== 'all').map(cat => ({
      category: cat,
      tools: filtered.filter(t => t.category === cat.id),
    })).filter(g => g.tools.length > 0);
  }, [filtered]);

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white/90 text-xs font-medium mb-4">
            <Zap size={12} /> 100% Free · No backend · No signup needed
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            60+ Free Online Tools<br />
            <span className="text-blue-200">All in One Place</span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-6 max-w-xl">
            PDF, Image, Video, Data, Code, Calculator tools — everything runs 100% in your browser. No installation, no account required.
          </p>
          <div className="flex items-center gap-3 bg-white rounded-xl p-1.5 max-w-lg shadow-xl">
            <Search size={18} className="ml-3 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search 60+ tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 py-1.5 pr-3 text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none text-sm"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 px-2">✕</button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 grid grid-cols-2 gap-3 p-6 hidden md:grid">
          {stats.map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-blue-200">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {toolCategories.map(cat => {
          const Icon = Icons[cat.icon] || Icons.Grid;
          const count = cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-blue-300'
              }`}
            >
              <Icon size={14} />
              {cat.label}
              <span className={`text-xs ${activeCategory === cat.id ? 'text-blue-200' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {search ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500">No tools found for "{search}"</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {grouped.map(g => (
            <CategoryGroup key={g.category.id} category={g.category} tools={g.tools} />
          ))}
        </div>
      )}
    </div>
  );
}
