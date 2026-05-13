'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PandocCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputFile, setInputFile] = useState('document.md');
  const [outputFile, setOutputFile] = useState('document.pdf');
  const [fromFormat, setFromFormat] = useState('markdown');
  const [toFormat, setToFormat] = useState('pdf');
  const [standalone, setStandalone] = useState(true);
  const [toc, setToc] = useState(false);
  const [numberSections, setNumberSections] = useState(false);
  const [template, setTemplate] = useState('');
  const [cssFile, setCssFile] = useState('');
  const [pdfEngine, setPdfEngine] = useState('');
  const [output, setOutput] = useState('');

  const formats = ['markdown', 'html', 'latex', 'docx', 'pdf', 'epub', 'rst', 'org', 'textile', 'mediawiki', 'odt', 'rtf', 'plain'];

  const generate = () => {
    const parts: string[] = ['pandoc'];

    parts.push(`-f ${fromFormat}`);
    parts.push(`-t ${toFormat}`);

    if (standalone) parts.push('-s');
    if (toc) parts.push('--toc');
    if (numberSections) parts.push('--number-sections');
    if (template) parts.push(`--template=${template}`);
    if (cssFile) parts.push(`--css=${cssFile}`);
    if (pdfEngine) parts.push(`--pdf-engine=${pdfEngine}`);

    parts.push(`-o ${outputFile}`);
    parts.push(inputFile);

    setOutput(parts.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input File</label>
            <input type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} className="input-field" aria-label={`Input file for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output File</label>
            <input type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} className="input-field" aria-label="Output file" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Format</label>
            <select value={fromFormat} onChange={(e) => setFromFormat(e.target.value)} className="input-field" aria-label="Source format">
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Format</label>
            <select value={toFormat} onChange={(e) => setToFormat(e.target.value)} className="input-field" aria-label="Target format">
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={standalone} onChange={(e) => setStandalone(e.target.checked)} />
            <span className="text-sm text-gray-700">Standalone (-s)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={toc} onChange={(e) => setToc(e.target.checked)} />
            <span className="text-sm text-gray-700">Table of Contents</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={numberSections} onChange={(e) => setNumberSections(e.target.checked)} />
            <span className="text-sm text-gray-700">Number Sections</span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <input type="text" value={template} onChange={(e) => setTemplate(e.target.value)} className="input-field" placeholder="optional" aria-label="Template file" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CSS File</label>
            <input type="text" value={cssFile} onChange={(e) => setCssFile(e.target.value)} className="input-field" placeholder="optional" aria-label="CSS file" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PDF Engine</label>
            <input type="text" value={pdfEngine} onChange={(e) => setPdfEngine(e.target.value)} className="input-field" placeholder="e.g. xelatex" aria-label="PDF engine" />
          </div>
        </div>

        <button onClick={generate} className="btn-primary">Generate Command</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
