'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ContributingGuideGenerator - Generate CONTRIBUTING.md template.
 */
export default function ContributingGuideGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [branchStrategy, setBranchStrategy] = useState('feature-branch');
  const [codeOfConduct, setCodeOfConduct] = useState(true);
  const [issueTemplates, setIssueTemplates] = useState(true);
  const [testingRequired, setTestingRequired] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = projectName || 'This Project';
    const sections: string[] = [];
    sections.push(`# Contributing to ${name}\n`);
    sections.push(`Thank you for considering contributing to ${name}! We welcome contributions from everyone.\n`);
    if (codeOfConduct) {
      sections.push(`## Code of Conduct\n\nBy participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.\n`);
    }
    sections.push(`## How to Contribute\n`);
    sections.push(`### Reporting Bugs\n\n- Check existing issues before creating a new one\n- Use a clear and descriptive title\n- Provide steps to reproduce the issue\n- Include your environment details\n`);
    if (issueTemplates) {
      sections.push(`### Suggesting Features\n\n- Open an issue with the "feature request" label\n- Describe the feature and its use case\n- Explain why it would benefit the project\n`);
    }
    sections.push(`### Pull Requests\n\n1. Fork the repository\n2. Create a new branch (\`${branchStrategy === 'feature-branch' ? 'git checkout -b feature/your-feature' : 'git checkout -b your-feature'}\`)\n3. Make your changes\n${testingRequired ? '4. Write or update tests as needed\n5. Ensure all tests pass\n6. Commit your changes\n7. Push to your branch\n8. Open a Pull Request' : '4. Commit your changes\n5. Push to your branch\n6. Open a Pull Request'}\n`);
    sections.push(`### Commit Messages\n\n- Use clear, descriptive commit messages\n- Start with a verb in present tense (e.g., "Add feature", "Fix bug")\n- Keep the first line under 72 characters\n`);
    if (testingRequired) {
      sections.push(`## Testing\n\nPlease ensure all tests pass before submitting a pull request:\n\n\`\`\`bash\nnpm test\n\`\`\`\n`);
    }
    sections.push(`## Questions?\n\nFeel free to open an issue if you have any questions about contributing.\n`);
    setOutput(sections.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Project" aria-label={`Project name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-branch`} className="block text-sm font-medium text-gray-700 mb-1">Branch Strategy</label>
            <select id={`${toolId}-branch`} value={branchStrategy} onChange={(e) => setBranchStrategy(e.target.value)} aria-label="Branch strategy" className="input-field">
              <option value="feature-branch">Feature Branch (feature/name)</option>
              <option value="simple">Simple (name)</option>
            </select>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={codeOfConduct} onChange={(e) => setCodeOfConduct(e.target.checked)} className="rounded" />
              Code of Conduct
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={issueTemplates} onChange={(e) => setIssueTemplates(e.target.checked)} className="rounded" />
              Issue Templates
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={testingRequired} onChange={(e) => setTestingRequired(e.target.checked)} className="rounded" />
              Testing Required
            </label>
          </div>
          <button onClick={generate} className="btn-primary">Generate CONTRIBUTING.md</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CONTRIBUTING.md</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
