'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssCounterGenerator - Generates CSS counter styles for custom ordered lists.
 * Supports various list-style-type values and custom counter formats.
 */
export default function CssCounterGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [counterName, setCounterName] = useState('section');
  const [counterStyle, setCounterStyle] = useState('decimal');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('. ');
  const [startValue, setStartValue] = useState('1');
  const [increment, setIncrement] = useState('1');
  const [nestedCounters, setNestedCounters] = useState(false);
  const [output, setOutput] = useState('');

  const styles = [
    'decimal', 'decimal-leading-zero', 'lower-alpha', 'upper-alpha',
    'lower-roman', 'upper-roman', 'lower-greek', 'disc', 'circle', 'square', 'none',
  ];

  const generate = () => {
    const start = parseInt(startValue) || 1;
    const inc = parseInt(increment) || 1;

    let css = '';
    if (nestedCounters) {
      css = `/* Parent list */
ol {
  counter-reset: ${counterName} ${start - inc};
  list-style: none;
  padding-left: 1.5em;
}

ol li {
  counter-increment: ${counterName} ${inc};
}

ol li::before {
  content: "${prefix}" counters(${counterName}, ".") "${suffix}";
  font-weight: bold;
}`;
    } else {
      css = `ol {
  counter-reset: ${counterName} ${start - inc};
  list-style: none;
  padding-left: 1.5em;
}

ol li {
  counter-increment: ${counterName} ${inc};
}

ol li::before {
  content: "${prefix}" counter(${counterName}, ${counterStyle}) "${suffix}";
  font-weight: bold;
}`;
    }

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
            Counter Name
          </label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
            placeholder="section"
            aria-label={`Counter name for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
            Counter Style
          </label>
          <select
            id={`${toolId}-style`}
            value={counterStyle}
            onChange={(e) => setCounterStyle(e.target.value)}
            aria-label={`Counter style for ${toolName}`}
            className="input-field"
          >
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">
            Prefix
          </label>
          <input
            id={`${toolId}-prefix`}
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g. Chapter "
            aria-label={`Prefix for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-suffix`} className="block text-sm font-medium text-gray-700 mb-1">
            Suffix
          </label>
          <input
            id={`${toolId}-suffix`}
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder=". "
            aria-label={`Suffix for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
            Start Value
          </label>
          <input
            id={`${toolId}-start`}
            type="text"
            inputMode="numeric"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            placeholder="1"
            aria-label={`Start value for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-increment`} className="block text-sm font-medium text-gray-700 mb-1">
            Increment
          </label>
          <input
            id={`${toolId}-increment`}
            type="text"
            inputMode="numeric"
            value={increment}
            onChange={(e) => setIncrement(e.target.value)}
            placeholder="1"
            aria-label={`Increment for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={nestedCounters}
            onChange={(e) => setNestedCounters(e.target.checked)}
            className="rounded border-gray-300"
          />
          Use nested counters (counters() for multi-level lists)
        </label>
      </div>

      <button onClick={generate} aria-label="Generate CSS counter" className="btn-primary">
        Generate CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
