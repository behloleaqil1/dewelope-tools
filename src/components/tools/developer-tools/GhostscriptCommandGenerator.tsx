'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GhostscriptCommandGenerator - Generate Ghostscript PDF processing commands.
 * Supports compression, merging, splitting, converting, and optimizing PDFs.
 */
export default function GhostscriptCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [operation, setOperation] = useState('compress');
  const [inputFile, setInputFile] = useState('input.pdf');
  const [outputFile, setOutputFile] = useState('output.pdf');
  const [quality, setQuality] = useState('ebook');
  const [pages, setPages] = useState('');
  const [resolution, setResolution] = useState('150');
  const [output, setOutput] = useState('');

  const qualityOptions = [
    { value: 'screen', label: 'Screen (72 dpi, smallest)' },
    { value: 'ebook', label: 'eBook (150 dpi, balanced)' },
    { value: 'printer', label: 'Printer (300 dpi, high quality)' },
    { value: 'prepress', label: 'Prepress (300 dpi, max quality)' },
  ];

  const generate = () => {
    let cmd = '';

    switch (operation) {
      case 'compress':
        cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFile} ${inputFile}`;
        break;
      case 'merge':
        cmd = `gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=${outputFile} file1.pdf file2.pdf file3.pdf`;
        break;
      case 'split':
        cmd = pages
          ? `gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dFirstPage=${pages.split('-')[0] || '1'} -dLastPage=${pages.split('-')[1] || pages.split('-')[0] || '1'} -sOutputFile=${outputFile} ${inputFile}`
          : `gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dFirstPage=1 -dLastPage=1 -sOutputFile=${outputFile} ${inputFile}`;
        break;
      case 'to-images':
        cmd = `gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r${resolution} -sOutputFile=page_%03d.png ${inputFile}`;
        break;
      case 'grayscale':
        cmd = `gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dQUIET -sColorConversionStrategy=Gray -dProcessColorModel=/DeviceGray -sOutputFile=${outputFile} ${inputFile}`;
        break;
      case 'linearize':
        cmd = `gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dQUIET -dFastWebView=true -sOutputFile=${outputFile} ${inputFile}`;
        break;
      default:
        cmd = '';
    }

    setOutput(cmd);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-operation`} className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
            <select id={`${toolId}-operation`} value={operation} onChange={(e) => setOperation(e.target.value)} aria-label={`Operation for ${toolName}`} className="input-field">
              <option value="compress">Compress PDF</option>
              <option value="merge">Merge PDFs</option>
              <option value="split">Extract Pages</option>
              <option value="to-images">PDF to Images</option>
              <option value="grayscale">Convert to Grayscale</option>
              <option value="linearize">Linearize (Fast Web View)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-input-file`} className="block text-sm font-medium text-gray-700 mb-1">Input File</label>
            <input id={`${toolId}-input-file`} type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} className="input-field" aria-label="Input file name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-output-file`} className="block text-sm font-medium text-gray-700 mb-1">Output File</label>
            <input id={`${toolId}-output-file`} type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} className="input-field" aria-label="Output file name" />
          </div>
          {operation === 'compress' && (
            <div>
              <label htmlFor={`${toolId}-quality`} className="block text-sm font-medium text-gray-700 mb-1">Quality Preset</label>
              <select id={`${toolId}-quality`} value={quality} onChange={(e) => setQuality(e.target.value)} className="input-field" aria-label="Quality preset">
                {qualityOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          )}
          {operation === 'split' && (
            <div>
              <label htmlFor={`${toolId}-pages`} className="block text-sm font-medium text-gray-700 mb-1">Page Range (e.g., 1-5)</label>
              <input id={`${toolId}-pages`} type="text" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="1-5" className="input-field" aria-label="Page range" />
            </div>
          )}
          {operation === 'to-images' && (
            <div>
              <label htmlFor={`${toolId}-resolution`} className="block text-sm font-medium text-gray-700 mb-1">Resolution (DPI)</label>
              <input id={`${toolId}-resolution`} type="number" value={resolution} onChange={(e) => setResolution(e.target.value)} className="input-field" aria-label="Resolution in DPI" />
            </div>
          )}
          <button onClick={generate} className="btn-primary w-full">Generate Command</button>
        </div>
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
