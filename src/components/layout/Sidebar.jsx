import { NavLink } from 'react-router-dom';
import { tools, toolCategories } from '../../data/tools';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const CategorySection = ({ category, tools: catTools, collapsed }) => {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = Icons[category.icon] || Icons.Folder;
  if (category.id === 'all') return null;
  if (catTools.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
      >
        {!collapsed && <Icon size={12} />}
        {!collapsed && <span className="flex-1 text-left">{category.label}</span>}
        {!collapsed && (isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
        {collapsed && <Icon size={16} className="mx-auto" />}
      </button>
      {isOpen && !collapsed && (
        <div className="space-y-0.5">
          {catTools.map(tool => {
            const TIcon = Icons[tool.icon] || Icons.Tool;
            return (
              <NavLink
                key={tool.id}
                to={tool.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={collapsed ? tool.name : ''}
              >
                <TIcon size={15} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{tool.name}</span>}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ open, setOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 z-40
          bg-white dark:bg-gray-950
          border-r border-gray-100 dark:border-gray-800
          transition-all duration-300 overflow-y-auto overflow-x-hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-14' : 'w-[240px]'}
        `}
      >
        <div className="hidden lg:flex items-center justify-between px-2 py-2 border-b border-gray-100 dark:border-gray-800">
          {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Tools</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-ghost p-1.5"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          </button>
        </div>
        <div className="py-3 px-2">
          {toolCategories.filter(c => c.id !== 'all').map(cat => {
            const catTools = tools.filter(t => t.category === cat.id);
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                tools={catTools}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
}
