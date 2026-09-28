'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReadmeTemplateGenerator - Generate README.md templates for projects.
 */
export default function ReadmeTemplateGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<'minimal' | 'standard' | 'detailed'>('standard');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!projectName.trim()) { setError('Please enter a project name.'); return; }

    const desc = description.trim() || 'A brief description of your project.';
    let output = '';

    if (template === 'minimal') {
      output = `# ${projectName}\n\n${desc}\n\n## Installation\n\n\`\`\`bash\nnpm install ${projectName.toLowerCase().replace(/\s+/g, '-')}\n\`\`\`\n\n## Usage\n\n\`\`\`js\n// Add usage example here\n\`\`\`\n\n## License\n\nMIT\n`;
    } else if (template === 'standard') {
      output = `# ${projectName}\n\n${desc}\n\n## Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [Features](#features)\n- [Contributing](#contributing)\n- [License](#license)\n\n## Installation\n\n\`\`\`bash\nnpm install ${projectName.toLowerCase().replace(/\s+/g, '-')}\n\`\`\`\n\n## Usage\n\n\`\`\`js\nconst ${projectName.replace(/\s+/g, '')} = require('${projectName.toLowerCase().replace(/\s+/g, '-')}');\n\n// Add usage example here\n\`\`\`\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Contributing\n\nPull requests are welcome. For major changes, please open an issue first.\n\n## License\n\n[MIT](LICENSE)\n`;
    } else {
      output = `# ${projectName}\n\n![Version](https://img.shields.io/badge/version-1.0.0-blue)\n![License](https://img.shields.io/badge/license-MIT-green)\n\n${desc}\n\n## Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [API Reference](#api-reference)\n- [Configuration](#configuration)\n- [Examples](#examples)\n- [Testing](#testing)\n- [Contributing](#contributing)\n- [Changelog](#changelog)\n- [License](#license)\n\n## Installation\n\n### Prerequisites\n\n- Node.js >= 16\n- npm >= 8\n\n### Steps\n\n\`\`\`bash\nnpm install ${projectName.toLowerCase().replace(/\s+/g, '-')}\n\`\`\`\n\n## Usage\n\n\`\`\`js\nimport { init } from '${projectName.toLowerCase().replace(/\s+/g, '-')}';\n\nconst instance = init({ /* options */ });\n\`\`\`\n\n## API Reference\n\n| Method | Parameters | Returns | Description |\n|--------|-----------|---------|-------------|\n| init() | options: Object | Instance | Initialize the library |\n\n## Configuration\n\n| Option | Type | Default | Description |\n|--------|------|---------|-------------|\n| debug | boolean | false | Enable debug mode |\n\n## Examples\n\nSee the [examples](./examples) directory.\n\n## Testing\n\n\`\`\`bash\nnpm test\n\`\`\`\n\n## Contributing\n\n1. Fork the repository\n2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n3. Commit your changes (\`git commit -m 'Add amazing feature'\`)\n4. Push to the branch (\`git push origin feature/amazing-feature\`)\n5. Open a Pull Request\n\n## Changelog\n\nSee [CHANGELOG.md](CHANGELOG.md).\n\n## License\n\n[MIT](LICENSE) © ${new Date().getFullYear()}\n`;
    }

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        {(['minimal', 'standard', 'detailed'] as const).map((t) => (
          <button key={t} onClick={() => setTemplate(t)} className={`px-4 py-2 rounded text-sm font-medium capitalize ${template === t ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label={`${t} template`}>{t}</button>
        ))}
      </div>

      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. My Awesome Project" aria-label={`Project name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your project" rows={2} aria-label={`Description for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate README template">Generate</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
