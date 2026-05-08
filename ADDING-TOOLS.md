# How to Add a New Tool

## 2 Steps Only

### Step 1: Create the component

Create a file at:
```
src/components/tools/{category-slug}/{ToolName}.tsx
```

Use this template:

```tsx
'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MyNewTool({ toolId, toolName }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    // Your tool logic here
    setOutput(input.toUpperCase()); // example
  };

  return (
    <div className="space-y-6">
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter something..."
          aria-label="Tool input"
          className="input-field h-40 resize-y"
        />
      </InputArea>

      <button onClick={handleProcess} className="btn-primary">
        Process
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
```

### Step 2: Register it

Open `src/data/tools-registry.ts` and add an entry to the array:

```typescript
{
  id: 'my-new-tool',
  name: 'My New Tool',
  description: 'What this tool does in detail.',
  shortDescription: 'Brief description (max 120 chars).',
  category: 'text-tools',  // pick existing category
  slug: 'my-new-tool',
  metaTitle: 'My New Tool - Free Online Tool',        // 30-60 chars
  metaDescription: 'SEO description for search engines here.', // 70-160 chars
  keywords: ['keyword1', 'keyword2'],
  featured: false,
  componentPath: '@/components/tools/text-tools/MyNewTool',
  inputConfig: { type: 'text', maxLength: 100000 },
  outputConfig: { type: 'text', copyable: true },
}
```

Then open `src/app/[category]/[tool]/page.tsx` and add one line to `TOOL_COMPONENTS`:

```typescript
'my-new-tool': dynamic(() => import('@/components/tools/text-tools/MyNewTool'), { loading: () => <ToolLoadingSkeleton />, ssr: false }),
```

Done. The tool automatically gets:
- Its own page at `/text-tools/my-new-tool`
- Listed in the category page
- Searchable from the search bar
- Included in the sitemap
- SEO metadata

---

## Ads

Set your AdSense ID in `.env.local`:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-YOUR_ID_HERE
```

Ads appear automatically on tool pages (in-content + sidebar). They collapse to zero height until you have a real approved AdSense account.

---

## Deploy

```bash
npm run build   # verify everything works
```

Push to Vercel, Netlify, or any static host. That's it.
