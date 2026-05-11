'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TailwindClassSorter - Sort Tailwind CSS classes in recommended order.
 * Groups classes by category: layout, sizing, spacing, typography, colors, effects, etc.
 */
export default function TailwindClassSorter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const ORDER: string[] = [
    // Layout
    'container', 'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'hidden',
    // Position
    'static', 'fixed', 'absolute', 'relative', 'sticky',
    'inset', 'top', 'right', 'bottom', 'left',
    // Z-index
    'z-',
    // Overflow
    'overflow', 'overscroll',
    // Display / Flex / Grid
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap', 'flex-1', 'flex-auto', 'flex-initial', 'flex-none',
    'grow', 'shrink', 'basis',
    'grid-cols', 'grid-rows', 'col-', 'row-',
    'gap', 'gap-x', 'gap-y',
    'justify', 'items', 'self', 'place', 'content',
    'order',
    // Sizing
    'w-', 'min-w', 'max-w', 'h-', 'min-h', 'max-h',
    'size-',
    // Spacing
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'ps-', 'pe-',
    'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-', 'ms-', 'me-',
    'space-x', 'space-y',
    // Typography
    'font-', 'text-', 'leading-', 'tracking-', 'whitespace', 'break-', 'truncate',
    'uppercase', 'lowercase', 'capitalize', 'normal-case',
    'italic', 'not-italic', 'underline', 'overline', 'line-through', 'no-underline',
    'antialiased', 'subpixel-antialiased',
    'list-',
    // Backgrounds
    'bg-',
    // Borders
    'border', 'rounded', 'divide',
    // Effects
    'shadow', 'opacity', 'mix-blend',
    // Filters
    'blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia', 'backdrop',
    // Transitions & Animation
    'transition', 'duration', 'ease', 'delay', 'animate',
    // Transforms
    'scale', 'rotate', 'translate', 'skew', 'origin',
    // Interactivity
    'cursor', 'select', 'resize', 'scroll', 'snap', 'touch', 'pointer-events',
    // Accessibility
    'sr-only', 'not-sr-only',
  ];

  const getClassPriority = (cls: string): number => {
    for (let i = 0; i < ORDER.length; i++) {
      if (cls === ORDER[i] || cls.startsWith(ORDER[i])) {
        return i;
      }
    }
    return ORDER.length;
  };

  const sortClasses = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines = input.split('\n');
    const sortedLines = lines.map((line) => {
      // Match class/className attributes or just raw class lists
      const classMatch = line.match(/(class(?:Name)?=["'`])([^"'`]+)(["'`])/);
      if (classMatch) {
        const prefix = classMatch[1];
        const classes = classMatch[2];
        const suffix = classMatch[3];
        const sorted = classes
          .split(/\s+/)
          .filter(Boolean)
          .sort((a, b) => {
            const stripVariant = (c: string) => {
              const parts = c.split(':');
              return parts[parts.length - 1];
            };
            return getClassPriority(stripVariant(a)) - getClassPriority(stripVariant(b));
          })
          .join(' ');
        return line.replace(classMatch[0], `${prefix}${sorted}${suffix}`);
      }
      // If no attribute wrapper, treat entire line as space-separated classes
      const classes = line.trim().split(/\s+/).filter(Boolean);
      if (classes.length === 0) return line;
      return classes
        .sort((a, b) => {
          const stripVariant = (c: string) => {
            const parts = c.split(':');
            return parts[parts.length - 1];
          };
          return getClassPriority(stripVariant(a)) - getClassPriority(stripVariant(b));
        })
        .join(' ');
    });

    setOutput(sortedLines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste Tailwind CSS classes or HTML with class attributes
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'e.g. mt-4 flex text-red-500 p-2 w-full items-center bg-white rounded shadow'}
          aria-label={`Input classes for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={sortClasses} aria-label="Sort Tailwind classes" className="btn-primary">
        Sort Classes
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sorted Classes</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
