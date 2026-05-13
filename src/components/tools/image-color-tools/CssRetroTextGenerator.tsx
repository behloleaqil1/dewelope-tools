'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssRetroTextGenerator - Generate CSS retro/vintage text effects.
 * Creates various retro text styles with live preview and CSS output.
 */
export default function CssRetroTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('RETRO');
  const [style, setStyle] = useState<'neon-80s' | 'vhs-glitch' | 'arcade' | 'typewriter' | 'disco' | 'western'>('neon-80s');
  const [fontSize, setFontSize] = useState('64');
  const [primaryColor, setPrimaryColor] = useState('#ff00ff');
  const [secondaryColor, setSecondaryColor] = useState('#00ffff');
  const [output, setOutput] = useState('');

  const generate = () => {
    let css = '';
    let html = '';
    const size = `${fontSize}px`;

    switch (style) {
      case 'neon-80s':
        css = `.retro-text {\n  font-family: 'Courier New', monospace;\n  font-size: ${size};\n  font-weight: bold;\n  color: ${primaryColor};\n  text-shadow:\n    0 0 7px ${primaryColor},\n    0 0 10px ${primaryColor},\n    0 0 21px ${primaryColor},\n    0 0 42px ${secondaryColor},\n    0 0 82px ${secondaryColor},\n    0 0 92px ${secondaryColor},\n    0 0 102px ${secondaryColor},\n    0 0 151px ${secondaryColor};\n  letter-spacing: 4px;\n  text-transform: uppercase;\n}`;
        break;
      case 'vhs-glitch':
        css = `.retro-text {\n  font-family: 'Impact', sans-serif;\n  font-size: ${size};\n  font-weight: bold;\n  color: #fff;\n  text-shadow:\n    3px 0 ${primaryColor},\n    -3px 0 ${secondaryColor};\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  position: relative;\n}\n\n.retro-text::before {\n  content: attr(data-text);\n  position: absolute;\n  left: 2px;\n  text-shadow: -2px 0 ${primaryColor};\n  top: 0;\n  color: #fff;\n  overflow: hidden;\n  clip-path: inset(0 0 50% 0);\n}\n\n.retro-text::after {\n  content: attr(data-text);\n  position: absolute;\n  left: -2px;\n  text-shadow: 2px 0 ${secondaryColor};\n  top: 0;\n  color: #fff;\n  overflow: hidden;\n  clip-path: inset(50% 0 0 0);\n}`;
        break;
      case 'arcade':
        css = `.retro-text {\n  font-family: 'Press Start 2P', 'Courier New', monospace;\n  font-size: ${size};\n  color: ${primaryColor};\n  text-shadow:\n    4px 4px 0 #000,\n    -1px -1px 0 ${secondaryColor},\n    1px -1px 0 ${secondaryColor},\n    -1px 1px 0 ${secondaryColor},\n    1px 1px 0 ${secondaryColor};\n  letter-spacing: 3px;\n  text-transform: uppercase;\n  -webkit-text-stroke: 1px #000;\n}`;
        break;
      case 'typewriter':
        css = `.retro-text {\n  font-family: 'Courier New', Courier, monospace;\n  font-size: ${size};\n  color: #2c2c2c;\n  text-shadow:\n    1px 1px 0 rgba(0,0,0,0.1);\n  letter-spacing: 2px;\n  background: linear-gradient(to bottom, transparent 95%, #333 95%);\n  background-size: 100% 1.2em;\n  padding: 0.2em;\n  border: 2px solid #8b7355;\n  background-color: #f5f0e8;\n}`;
        break;
      case 'disco':
        css = `.retro-text {\n  font-family: 'Arial Black', sans-serif;\n  font-size: ${size};\n  font-weight: bold;\n  background: linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, #ffff00, ${primaryColor});\n  background-size: 300% 300%;\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  text-shadow: none;\n  letter-spacing: 3px;\n  text-transform: uppercase;\n  animation: disco-shift 3s ease infinite;\n}\n\n@keyframes disco-shift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}`;
        break;
      case 'western':
        css = `.retro-text {\n  font-family: 'Georgia', serif;\n  font-size: ${size};\n  font-weight: bold;\n  color: ${primaryColor};\n  text-shadow:\n    2px 2px 0 #000,\n    4px 4px 0 ${secondaryColor},\n    6px 6px 0 rgba(0,0,0,0.2);\n  letter-spacing: 5px;\n  text-transform: uppercase;\n  -webkit-text-stroke: 1px #000;\n}`;
        break;
    }

    html = `<div class="retro-text"${style === 'vhs-glitch' ? ` data-text="${text}"` : ''}>${text}</div>`;

    const fullOutput = `/* ${style.replace(/-/g, ' ').toUpperCase()} Style */\n\n${css}\n\n<!-- HTML -->\n${html}`;
    setOutput(fullOutput);
  };

  const getPreviewStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { fontSize: `${Math.min(parseInt(fontSize), 48)}px`, fontWeight: 'bold', textTransform: 'uppercase' as const, letterSpacing: '3px' };
    switch (style) {
      case 'neon-80s':
        return { ...base, fontFamily: 'Courier New, monospace', color: primaryColor, textShadow: `0 0 7px ${primaryColor}, 0 0 21px ${primaryColor}, 0 0 42px ${secondaryColor}, 0 0 82px ${secondaryColor}` };
      case 'arcade':
        return { ...base, fontFamily: 'Courier New, monospace', color: primaryColor, textShadow: `4px 4px 0 #000, -1px -1px 0 ${secondaryColor}, 1px 1px 0 ${secondaryColor}`, WebkitTextStroke: '1px #000' };
      case 'western':
        return { ...base, fontFamily: 'Georgia, serif', color: primaryColor, textShadow: `2px 2px 0 #000, 4px 4px 0 ${secondaryColor}` };
      default:
        return { ...base, fontFamily: 'Impact, sans-serif', color: primaryColor, textShadow: `3px 0 ${secondaryColor}, -3px 0 ${primaryColor}` };
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Retro Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as typeof style)} className="input-field" aria-label="Retro style">
              <option value="neon-80s">80s Neon</option>
              <option value="vhs-glitch">VHS Glitch</option>
              <option value="arcade">Arcade</option>
              <option value="typewriter">Typewriter</option>
              <option value="disco">Disco</option>
              <option value="western">Western</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-primary`} className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <input id={`${toolId}-primary`} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field h-10" aria-label="Primary color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-secondary`} className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <input id={`${toolId}-secondary`} type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="input-field h-10" aria-label="Secondary color" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate Retro Text CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="bg-gray-900 p-8 rounded-lg flex items-center justify-center min-h-[120px]">
              <span style={getPreviewStyle()}>{text}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS & HTML Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-80">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
