'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface GrammarIssue { pattern: string; match: string; suggestion: string; position: number; }

const GRAMMAR_RULES: { pattern: RegExp; message: string; suggestion: string }[] = [
  { pattern: /\b(their|there|they're)\b.*\b(their|there|they're)\b/gi, message: 'Check their/there/they\'re usage', suggestion: 'Verify correct homophone' },
  { pattern: /\b(its|it's)\s+(a|the|an|very|not)\b/gi, message: 'Possible its/it\'s confusion', suggestion: '"it\'s" = "it is", "its" = possessive' },
  { pattern: /\b(could|would|should)\s+of\b/gi, message: 'Should be "could/would/should have"', suggestion: 'Replace "of" with "have"' },
  { pattern: /\b(alot)\b/gi, message: '"alot" is not a word', suggestion: 'Use "a lot" (two words)' },
  { pattern: /\b(irregardless)\b/gi, message: '"irregardless" is non-standard', suggestion: 'Use "regardless"' },
  { pattern: /\b(supposably)\b/gi, message: '"supposably" is non-standard', suggestion: 'Use "supposedly"' },
  { pattern: /\b(then)\b\s+\b(than)\b|\b(than)\b\s+\b(then)\b/gi, message: 'Check then/than usage', suggestion: '"then" = time, "than" = comparison' },
  { pattern: /\b(affect|effect)\b/gi, message: 'Check affect/effect usage', suggestion: '"affect" = verb (to influence), "effect" = noun (result)' },
  { pattern: /\b(your|you're)\b/gi, message: 'Check your/you\'re usage', suggestion: '"you\'re" = "you are", "your" = possessive' },
  { pattern: /\b(loose|lose)\b/gi, message: 'Check loose/lose usage', suggestion: '"loose" = not tight, "lose" = to misplace' },
  { pattern: /\s{2,}/g, message: 'Multiple consecutive spaces', suggestion: 'Use single spaces between words' },
  { pattern: /\b(i)\b(?!\s*['.:])/g, message: 'Lowercase "i" should be capitalized', suggestion: 'Capitalize "I" when used as pronoun' },
  { pattern: /[.!?]\s*[a-z]/g, message: 'Sentence may not start with capital letter', suggestion: 'Capitalize the first letter after sentence-ending punctuation' },
  { pattern: /\b(alright)\b/gi, message: '"alright" is informal', suggestion: 'Use "all right" in formal writing' },
  { pattern: /\b(anyways)\b/gi, message: '"anyways" is non-standard', suggestion: 'Use "anyway" (without s)' },
];

/**
 * GrammarPatternChecker - Checks text for common grammar patterns and issues.
 */
export default function GrammarPatternChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [issues, setIssues] = useState<GrammarIssue[]>([]);

  const check = () => {
    setError(undefined);
    setIssues([]);
    if (!text.trim()) { setError('Please enter text to check'); return; }

    const found: GrammarIssue[] = [];

    for (const rule of GRAMMAR_RULES) {
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        found.push({
          pattern: rule.message,
          match: match[0],
          suggestion: rule.suggestion,
          position: match.index,
        });
      }
    }

    // Remove duplicates at same position
    const unique = found.filter((item, index, self) =>
      index === self.findIndex(t => t.position === item.position && t.pattern === item.pattern)
    );

    setIssues(unique.sort((a, b) => a.position - b.position));
  };

  const copyText = issues.length > 0 ? `Grammar issues found: ${issues.length}\n\n${issues.map(i => `[${i.pattern}] "${i.match}" → ${i.suggestion}`).join('\n')}` : 'No grammar issues detected';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Check</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here to check for common grammar issues..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={check} aria-label="Check grammar patterns" className="btn-primary">Check Grammar</button>
      <OutputArea hasContent={issues.length > 0 || text.trim().length > 0}>
        {issues.length > 0 ? (
          <div className="space-y-2">
            <div className="bg-orange-50 p-2 rounded-lg border border-orange-200 text-center text-sm text-orange-700">{issues.length} potential issue(s) found</div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {issues.map((issue, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-red-700">{issue.pattern}</div>
                  <div className="text-xs font-mono text-gray-600 mt-1">Found: &quot;{issue.match}&quot;</div>
                  <div className="text-xs text-green-700 mt-1">💡 {issue.suggestion}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        ) : text.trim().length > 0 ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center text-green-700 text-sm">No common grammar issues detected.</div>
        ) : null}
      </OutputArea>
    </div>
  );
}
