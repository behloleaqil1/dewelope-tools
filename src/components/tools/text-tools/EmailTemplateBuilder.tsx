'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EmailTemplateBuilder - Build HTML email templates with common layouts.
 */
export default function EmailTemplateBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [subject, setSubject] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#007bff');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!heading.trim() && !body.trim()) { setError('Enter at least a heading or body text.'); return; }

    const h = heading.trim() || 'Your Heading Here';
    const b = body.trim().split('\n').map((line) => `<p style="margin:0 0 16px;color:#333333;font-size:16px;line-height:1.5;">${line}</p>`).join('\n            ');
    const ctaHtml = ctaText.trim() ? `\n            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">\n              <tr>\n                <td style="background:${accentColor};border-radius:4px;padding:12px 24px;">\n                  <a href="${ctaUrl.trim() || '#'}" style="color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;">${ctaText.trim()}</a>\n                </td>\n              </tr>\n            </table>` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject.trim() || h}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${bgColor};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:${accentColor};padding:24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">${h}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
            ${b}${ctaHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:16px 24px;text-align:center;border-top:1px solid #e9ecef;">
              <p style="margin:0;color:#6c757d;font-size:12px;">You received this email because you subscribed. <a href="#" style="color:${accentColor};">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    setResult(html);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-subject`} className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
            <input id={`${toolId}-subject`} type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Welcome to Our Service" aria-label={`Subject for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-heading`} className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input id={`${toolId}-heading`} type="text" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g. Welcome Aboard!" aria-label={`Heading for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
            <textarea id={`${toolId}-body`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your email body content..." rows={4} aria-label={`Body text for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-cta`} className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
              <input id={`${toolId}-cta`} type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Get Started" aria-label={`CTA text for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
              <input id={`${toolId}-url`} type="text" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://example.com" aria-label={`CTA URL for ${toolName}`} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-accent`} className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
              <input id={`${toolId}-accent`} type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} aria-label={`Accent color for ${toolName}`} className="input-field h-10" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate email template">Generate</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-xs bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto max-h-96 whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
