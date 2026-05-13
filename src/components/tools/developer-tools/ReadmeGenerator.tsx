'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReadmeGenerator - Generate README.md template from project info.
 */
export default function ReadmeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [installation, setInstallation] = useState('');
  const [usage, setUsage] = useState('');
  const [license, setLicense] = useState('MIT');
  const [author, setAuthor] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const sections: string[] = [];
    sections.push(`# ${projectName || 'Project Name'}\n`);
    if (description) {
      sections.push(`## Description\n\n${description}\n`);
    }
    sections.push(`## Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [License](#license)\n- [Author](#author)\n`);
    sections.push(`## Installation\n\n\`\`\`bash\n${installation || 'npm install'}\n\`\`\`\n`);
    sections.push(`## Usage\n\n\`\`\`bash\n${usage || 'npm start'}\n\`\`\`\n`);
    sections.push(`## License\n\nThis project is licensed under the ${license} License.\n`);
    if (author) {
      sections.push(`## Author\n\n${author}\n`);
    }
    setOutput(sections.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome Project" aria-label={`Project name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your project..." aria-label="Project description" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-install`} className="block text-sm font-medium text-gray-700 mb-1">Installation Command</label>
            <input id={`${toolId}-install`} type="text" value={installation} onChange={(e) => setInstallation(e.target.value)} placeholder="npm install" aria-label="Installation command" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-usage`} className="block text-sm font-medium text-gray-700 mb-1">Usage Command</label>
            <input id={`${toolId}-usage`} type="text" value={usage} onChange={(e) => setUsage(e.target.value)} placeholder="npm start" aria-label="Usage command" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <select id={`${toolId}-license`} value={license} onChange={(e) => setLicense(e.target.value)} aria-label="License type" className="input-field">
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="BSD-3-Clause">BSD 3-Clause</option>
              <option value="ISC">ISC</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input id={`${toolId}-author`} type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" aria-label="Author name" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary">Generate README</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated README.md</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
