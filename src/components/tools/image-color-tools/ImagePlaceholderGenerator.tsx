'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImagePlaceholderGenerator - Generates placeholder image URLs from popular services.
 */
export default function ImagePlaceholderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [bgColor, setBgColor] = useState('#cccccc');
  const [textColor, setTextColor] = useState('#333333');
  const [text, setText] = useState('');
  const [urls, setUrls] = useState<{ service: string; url: string }[]>([]);

  function generate() {
    const w = parseInt(width) || 800;
    const h = parseInt(height) || 600;
    const bg = bgColor.replace('#', '');
    const fg = textColor.replace('#', '');
    const label = text || `${w}x${h}`;

    const generated = [
      { service: 'placehold.co', url: `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}` },
      { service: 'via.placeholder.com', url: `https://via.placeholder.com/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}` },
      { service: 'dummyimage.com', url: `https://dummyimage.com/${w}x${h}/${bg}/${fg}&text=${encodeURIComponent(label)}` },
      { service: 'fakeimg.pl', url: `https://fakeimg.pl/${w}x${h}/${bg}/${fg}/?text=${encodeURIComponent(label)}` },
    ];

    setUrls(generated);
  }

  const copyText = urls.map((u) => `${u.service}: ${u.url}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Configure placeholder image for {toolName}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-labelledby={`${toolId}-label`}>
          <div>
            <label htmlFor={`${toolId}-w`} className="block text-xs text-gray-500 mb-1">Width (px)</label>
            <input id={`${toolId}-w`} type="number" min="1" max="4000" value={width} onChange={(e) => setWidth(e.target.value)} aria-label="Image width" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-h`} className="block text-xs text-gray-500 mb-1">Height (px)</label>
            <input id={`${toolId}-h`} type="number" min="1" max="4000" value={height} onChange={(e) => setHeight(e.target.value)} aria-label="Image height" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-xs text-gray-500 mb-1">Background</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="w-full h-9 rounded cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-fg`} className="block text-xs text-gray-500 mb-1">Text Color</label>
            <input id={`${toolId}-fg`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="w-full h-9 rounded cursor-pointer" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-text`} className="block text-xs text-gray-500 mb-1">Custom Text (optional)</label>
          <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Leave empty for WxH" aria-label="Custom text" className="input-field text-sm" />
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate placeholder URLs" className="btn-primary">Generate URLs</button>

      <OutputArea hasContent={urls.length > 0}>
        {urls.length > 0 && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urls[0].url} alt="Placeholder preview" className="max-w-full max-h-48 rounded border border-gray-200" />
            </div>
            <div className="space-y-2">
              {urls.map((u) => (
                <div key={u.service} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">{u.service}</div>
                  <code className="text-xs font-mono text-blue-600 break-all">{u.url}</code>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
