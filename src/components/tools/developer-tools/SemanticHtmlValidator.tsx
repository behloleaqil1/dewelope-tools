'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Finding { type: 'good' | 'warning' | 'error'; message: string; }

const SEMANTIC_ELEMENTS = ['header', 'footer', 'nav', 'main', 'article', 'section', 'aside', 'figure', 'figcaption', 'details', 'summary', 'mark', 'time'];
const _NON_SEMANTIC = ['div', 'span'];

/**
 * SemanticHtmlValidator - Analyzes HTML for semantic structure and provides suggestions.
 */
export default function SemanticHtmlValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [findings, setFindings] = useState<Finding[]>([]);

  const analyze = () => {
    setError(undefined);
    setFindings([]);
    if (!html.trim()) { setError('Please enter HTML to analyze'); return; }

    const results: Finding[] = [];
    const lower = html.toLowerCase();

    // Check for semantic elements
    const foundSemantic = SEMANTIC_ELEMENTS.filter(el => lower.includes(`<${el}`));
    if (foundSemantic.length > 0) {
      results.push({ type: 'good', message: `Uses semantic elements: ${foundSemantic.join(', ')}` });
    } else {
      results.push({ type: 'warning', message: 'No semantic HTML5 elements found (header, nav, main, article, section, etc.)' });
    }

    // Count divs and spans
    const divCount = (lower.match(/<div/g) || []).length;
    const spanCount = (lower.match(/<span/g) || []).length;
    const totalNonSemantic = divCount + spanCount;
    const totalElements = (lower.match(/<[a-z]/g) || []).length;

    if (totalElements > 0 && totalNonSemantic / totalElements > 0.7) {
      results.push({ type: 'error', message: `High ratio of non-semantic elements (${totalNonSemantic}/${totalElements}). Consider replacing divs/spans with semantic alternatives.` });
    } else if (divCount > 0) {
      results.push({ type: 'warning', message: `Found ${divCount} <div> and ${spanCount} <span> elements. Review if any could be semantic elements.` });
    }

    // Check headings
    const headings = lower.match(/<h[1-6]/g) || [];
    if (headings.length === 0 && totalElements > 3) {
      results.push({ type: 'warning', message: 'No heading elements found. Add headings for document structure.' });
    } else if (headings.length > 0) {
      const levels = headings.map(h => parseInt(h.charAt(2)));
      if (!levels.includes(1) && levels.length > 0) {
        results.push({ type: 'warning', message: 'No <h1> found. Pages should have exactly one <h1>.' });
      }
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          results.push({ type: 'error', message: `Heading level skipped: h${levels[i - 1]} → h${levels[i]}. Don't skip heading levels.` });
          break;
        }
      }
      results.push({ type: 'good', message: `Found ${headings.length} heading element(s)` });
    }

    // Check for alt attributes on images
    const imgs = lower.match(/<img[^>]*>/g) || [];
    const imgsWithoutAlt = imgs.filter(img => !img.includes('alt='));
    if (imgsWithoutAlt.length > 0) {
      results.push({ type: 'error', message: `${imgsWithoutAlt.length} image(s) missing alt attribute` });
    } else if (imgs.length > 0) {
      results.push({ type: 'good', message: `All ${imgs.length} image(s) have alt attributes` });
    }

    // Check for lang attribute
    if (lower.includes('<html') && !lower.includes('lang=')) {
      results.push({ type: 'error', message: 'Missing lang attribute on <html> element' });
    }

    // Check for landmark regions
    if (!lower.includes('<main') && totalElements > 5) {
      results.push({ type: 'warning', message: 'No <main> landmark found. Wrap primary content in <main>.' });
    }
    if (!lower.includes('<nav') && (lower.match(/<a /g) || []).length > 3) {
      results.push({ type: 'warning', message: 'Multiple links found but no <nav> element. Group navigation links in <nav>.' });
    }

    setFindings(results);
  };

  const copyText = findings.map(f => `[${f.type.toUpperCase()}] ${f.message}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">HTML to Analyze</label>
        <textarea id={`${toolId}-input`} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<div>Paste your HTML here...</div>" aria-label={`HTML input for ${toolName}`} className="input-field font-mono min-h-[120px] text-sm" />
      </InputArea>
      <button onClick={analyze} aria-label="Analyze HTML semantics" className="btn-primary">Analyze</button>
      <OutputArea hasContent={findings.length > 0}>
        {findings.length > 0 && (
          <div className="space-y-2">
            {findings.map((f, i) => (
              <div key={i} className={`p-3 rounded-lg border ${f.type === 'good' ? 'bg-green-50 border-green-200' : f.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`text-sm ${f.type === 'good' ? 'text-green-800' : f.type === 'warning' ? 'text-yellow-800' : 'text-red-800'}`}>
                  {f.type === 'good' ? '✓' : f.type === 'warning' ? '⚠' : '✗'} {f.message}
                </span>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
