'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SphinxConfGenerator - Generate Python Sphinx docs conf.py configuration files.
 */
export default function SphinxConfGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('My Project');
  const [author, setAuthor] = useState('Author Name');
  const [version, setVersion] = useState('1.0.0');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('alabaster');
  const [extensions, setExtensions] = useState<string[]>(['sphinx.ext.autodoc', 'sphinx.ext.viewcode']);
  const [output, setOutput] = useState('');

  const availableExtensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'sphinx.ext.todo',
    'sphinx.ext.coverage',
    'sphinx.ext.mathjax',
    'sphinx.ext.githubpages',
  ];

  const themes = ['alabaster', 'sphinx_rtd_theme', 'furo', 'pydata_sphinx_theme', 'sphinx_book_theme', 'classic', 'nature', 'bizstyle'];

  const toggleExtension = (ext: string) => {
    setExtensions((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]
    );
  };

  const generate = () => {
    const extList = extensions.map((e) => `    '${e}',`).join('\n');
    const conf = `# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = '${projectName}'
copyright = '${new Date().getFullYear()}, ${author}'
author = '${author}'
release = '${version}'

# -- General configuration ---------------------------------------------------
extensions = [
${extList}
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

language = '${language}'

# -- Options for HTML output -------------------------------------------------
html_theme = '${theme}'
html_static_path = ['_static']
`;
    setOutput(conf);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-project`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input id={`${toolId}-author`} type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="input-field" aria-label="Author name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Project version" />
          </div>
          <div>
            <label htmlFor={`${toolId}-language`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <input id={`${toolId}-language`} type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field" aria-label="Documentation language" />
          </div>
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label="Sphinx theme">
              {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Extensions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableExtensions.map((ext) => (
              <label key={ext} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={extensions.includes(ext)} onChange={() => toggleExtension(ext)} className="rounded" />
                {ext}
              </label>
            ))}
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate conf.py</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated conf.py</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
