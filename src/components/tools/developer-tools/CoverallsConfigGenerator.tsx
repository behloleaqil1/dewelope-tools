'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CoverallsConfigGenerator - Generate Coveralls .coveralls.yml configuration files
 * with repo token, service name, coverage format, and parallel build settings.
 */
export default function CoverallsConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serviceName, setServiceName] = useState('github-actions');
  const [repoToken, setRepoToken] = useState('YOUR_REPO_TOKEN');
  const [coverageFormat, setCoverageFormat] = useState('lcov');
  const [parallel, setParallel] = useState(false);
  const [basePath, setBasePath] = useState('');
  const [flagName, setFlagName] = useState('');
  const [output, setOutput] = useState('');

  const services = [
    { value: 'github-actions', label: 'GitHub Actions' },
    { value: 'travis-ci', label: 'Travis CI' },
    { value: 'circleci', label: 'CircleCI' },
    { value: 'jenkins', label: 'Jenkins' },
    { value: 'gitlab-ci', label: 'GitLab CI' },
    { value: 'bitbucket-pipelines', label: 'Bitbucket Pipelines' },
  ];

  const formats = [
    { value: 'lcov', label: 'LCOV' },
    { value: 'simplecov', label: 'SimpleCov (Ruby)' },
    { value: 'cobertura', label: 'Cobertura (XML)' },
    { value: 'gcov', label: 'gcov (C/C++)' },
  ];

  const generate = () => {
    const config: string[] = [
      `service_name: ${serviceName}`,
      `repo_token: ${repoToken}`,
    ];

    if (coverageFormat !== 'lcov') {
      config.push(`coverage_format: ${coverageFormat}`);
    }

    if (parallel) {
      config.push('parallel: true');
    }

    if (basePath.trim()) {
      config.push(`base_path: ${basePath.trim()}`);
    }

    if (flagName.trim()) {
      config.push(`flag_name: ${flagName.trim()}`);
    }

    setOutput(config.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-service`} className="block text-sm font-medium text-gray-700 mb-1">CI Service</label>
            <select id={`${toolId}-service`} value={serviceName} onChange={(e) => setServiceName(e.target.value)} aria-label={`CI service for ${toolName}`} className="input-field">
              {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-token`} className="block text-sm font-medium text-gray-700 mb-1">Repo Token</label>
            <input id={`${toolId}-token`} type="text" value={repoToken} onChange={(e) => setRepoToken(e.target.value)} aria-label="Repository token" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Coverage Format</label>
            <select id={`${toolId}-format`} value={coverageFormat} onChange={(e) => setCoverageFormat(e.target.value)} aria-label="Coverage format" className="input-field">
              {formats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Path (optional)</label>
            <input id={`${toolId}-base`} type="text" value={basePath} onChange={(e) => setBasePath(e.target.value)} placeholder="e.g., src/" aria-label="Base path" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-flag`} className="block text-sm font-medium text-gray-700 mb-1">Flag Name (optional)</label>
            <input id={`${toolId}-flag`} type="text" value={flagName} onChange={(e) => setFlagName(e.target.value)} placeholder="e.g., unittests" aria-label="Flag name" className="input-field" />
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-parallel`} type="checkbox" checked={parallel} onChange={(e) => setParallel(e.target.checked)} className="rounded" />
            <label htmlFor={`${toolId}-parallel`} className="text-sm text-gray-700">Enable parallel builds</label>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate .coveralls.yml</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated .coveralls.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
