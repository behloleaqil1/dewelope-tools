'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const ARIA_ROLES: { role: string; category: string; description: string; example: string }[] = [
  { role: 'alert', category: 'Live Region', description: 'Important message that demands user attention', example: '<div role="alert">Error: Form submission failed</div>' },
  { role: 'alertdialog', category: 'Window', description: 'Alert dialog requiring user response', example: '<div role="alertdialog" aria-labelledby="title">...</div>' },
  { role: 'button', category: 'Widget', description: 'Clickable element that triggers an action', example: '<div role="button" tabindex="0">Click me</div>' },
  { role: 'checkbox', category: 'Widget', description: 'Checkable input with true/false/mixed states', example: '<div role="checkbox" aria-checked="false">Option</div>' },
  { role: 'complementary', category: 'Landmark', description: 'Supporting content related to main content', example: '<aside role="complementary">Related links</aside>' },
  { role: 'contentinfo', category: 'Landmark', description: 'Information about the parent document', example: '<footer role="contentinfo">© 2024</footer>' },
  { role: 'dialog', category: 'Window', description: 'Dialog box or modal window', example: '<div role="dialog" aria-labelledby="title">...</div>' },
  { role: 'feed', category: 'Structure', description: 'Scrollable list of articles', example: '<div role="feed" aria-label="News feed">...</div>' },
  { role: 'form', category: 'Landmark', description: 'Region containing form elements', example: '<div role="form" aria-label="Contact form">...</div>' },
  { role: 'grid', category: 'Widget', description: 'Interactive tabular data structure', example: '<table role="grid">...</table>' },
  { role: 'heading', category: 'Structure', description: 'Heading for a section', example: '<div role="heading" aria-level="2">Title</div>' },
  { role: 'img', category: 'Structure', description: 'Container for image content', example: '<div role="img" aria-label="Chart showing growth">...</div>' },
  { role: 'link', category: 'Widget', description: 'Interactive reference to a resource', example: '<span role="link" tabindex="0">Go to page</span>' },
  { role: 'list', category: 'Structure', description: 'Group of non-interactive list items', example: '<div role="list"><div role="listitem">Item</div></div>' },
  { role: 'log', category: 'Live Region', description: 'Region where new info is added sequentially', example: '<div role="log" aria-label="Chat messages">...</div>' },
  { role: 'main', category: 'Landmark', description: 'Primary content of the document', example: '<main role="main">...</main>' },
  { role: 'menu', category: 'Widget', description: 'List of choices or actions', example: '<ul role="menu"><li role="menuitem">Save</li></ul>' },
  { role: 'navigation', category: 'Landmark', description: 'Collection of navigation links', example: '<nav role="navigation" aria-label="Main">...</nav>' },
  { role: 'progressbar', category: 'Widget', description: 'Element showing task completion progress', example: '<div role="progressbar" aria-valuenow="50">...</div>' },
  { role: 'region', category: 'Landmark', description: 'Perceivable section of the page', example: '<section role="region" aria-label="Results">...</section>' },
  { role: 'search', category: 'Landmark', description: 'Region for search functionality', example: '<form role="search" aria-label="Site search">...</form>' },
  { role: 'slider', category: 'Widget', description: 'Input for selecting a value from a range', example: '<div role="slider" aria-valuemin="0" aria-valuemax="100">...</div>' },
  { role: 'status', category: 'Live Region', description: 'Advisory info not important enough for alert', example: '<div role="status">3 results found</div>' },
  { role: 'tab', category: 'Widget', description: 'Tab in a tablist', example: '<button role="tab" aria-selected="true">Tab 1</button>' },
  { role: 'tabpanel', category: 'Widget', description: 'Container for tab content', example: '<div role="tabpanel" aria-labelledby="tab1">...</div>' },
  { role: 'timer', category: 'Live Region', description: 'Numerical counter showing elapsed time', example: '<div role="timer" aria-label="Countdown">05:00</div>' },
  { role: 'tooltip', category: 'Widget', description: 'Contextual popup with descriptive text', example: '<div role="tooltip">Helpful information</div>' },
  { role: 'tree', category: 'Widget', description: 'Hierarchical list (expandable/collapsible)', example: '<ul role="tree"><li role="treeitem">Folder</li></ul>' },
];

/**
 * AriaRoleReference - Searchable reference of ARIA roles with descriptions and examples.
 */
export default function AriaRoleReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(ARIA_ROLES.map(r => r.category)))];

  const filtered = ARIA_ROLES.filter(r => {
    const matchesSearch = r.role.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyText = filtered.map(r => `${r.role} (${r.category}): ${r.description}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">Search Roles</label>
          <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by role name..." aria-label={`Search ARIA roles for ${toolName}`} className="input-field" />
        </div>
        <div>
          <label htmlFor={`${toolId}-category`} className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id={`${toolId}-category`} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by role category" className="input-field">
            {categories.map(c => (<option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>))}
          </select>
        </div>
      </div>
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map(r => (
            <div key={r.role} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{r.role}</code>
                <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{r.category}</span>
              </div>
              <div className="text-sm text-gray-700">{r.description}</div>
              <div className="text-xs font-mono text-gray-500 mt-1 break-all">{r.example}</div>
            </div>
          ))}
        </div>
        {filtered.length > 0 && <CopyToClipboard text={copyText} />}
      </OutputArea>
    </div>
  );
}
