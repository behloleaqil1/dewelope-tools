'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SonarqubeConfigGenerator - Generate SonarQube sonar-project.properties file
 * with project key, sources, exclusions, encoding, and language settings.
 */
export default function SonarqubeConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectKey, setProjectKey] = useState('my-project');
  const [projectName, setProjectName] = useState('My Project');
  const [projectVersion, setProjectVersion] = useState('1.0.0');
  const [sources, setSources] = useState('src');
  const [tests, setTests] = useState('tests');
  const [encoding, setEncoding] = useState('UTF-8');
  const [language, setLanguage] = useState('');
  const [exclusions, setExclusions] = useState('**/node_modules/**\n**/dist/**\n**/coverage/**');
  const [testExclusions, setTestExclusions] = useState('**/test/**\n**/*.spec.*\n**/*.test.*');
  const [coveragePlugin, setCoveragePlugin] = useState('lcov');
  const [coveragePaths, setCoveragePaths] = useState('coverage/lcov.info');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('# SonarQube Project Configuration');
    lines.push(`# Generated on ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push(`sonar.projectKey=${projectKey}`);
    lines.push(`sonar.projectName=${projectName}`);
    lines.push(`sonar.projectVersion=${projectVersion}`);
    lines.push('');
    lines.push('# Source directories');
    lines.push(`sonar.sources=${sources}`);
    if (tests.trim()) {
      lines.push(`sonar.tests=${tests}`);
    }
    lines.push('');
    lines.push(`sonar.sourceEncoding=${encoding}`);
    if (language.trim()) {
      lines.push(`sonar.language=${language}`);
    }
    lines.push('');

    const excl = exclusions.split('\n').filter(e => e.trim());
    if (excl.length > 0) {
      lines.push('# Exclusions');
      lines.push(`sonar.exclusions=${excl.join(',')}`);
    }

    const testExcl = testExclusions.split('\n').filter(e => e.trim());
    if (testExcl.length > 0) {
      lines.push(`sonar.test.exclusions=${testExcl.join(',')}`);
    }

    lines.push('');
    lines.push('# Coverage');
    lines.push(`sonar.${coveragePlugin}.reportPaths=${coveragePaths}`);
    lines.push('');
    lines.push('# Quality Gate');
    lines.push('sonar.qualitygate.wait=true');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Key
            </label>
            <input
              id={`${toolId}-key`}
              type="text"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
              className="input-field"
              aria-label={`Project key for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
              aria-label="Project name"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id={`${toolId}-version`}
              type="text"
              value={projectVersion}
              onChange={(e) => setProjectVersion(e.target.value)}
              className="input-field"
              aria-label="Project version"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-encoding`} className="block text-sm font-medium text-gray-700 mb-1">
              Encoding
            </label>
            <select
              id={`${toolId}-encoding`}
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
              className="input-field"
              aria-label="Source encoding"
            >
              <option value="UTF-8">UTF-8</option>
              <option value="ISO-8859-1">ISO-8859-1</option>
              <option value="US-ASCII">US-ASCII</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-sources`} className="block text-sm font-medium text-gray-700 mb-1">
              Sources Directory
            </label>
            <input
              id={`${toolId}-sources`}
              type="text"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              className="input-field"
              aria-label="Sources directory"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-tests`} className="block text-sm font-medium text-gray-700 mb-1">
              Tests Directory
            </label>
            <input
              id={`${toolId}-tests`}
              type="text"
              value={tests}
              onChange={(e) => setTests(e.target.value)}
              className="input-field"
              aria-label="Tests directory"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-language`} className="block text-sm font-medium text-gray-700 mb-1">
              Language (optional)
            </label>
            <select
              id={`${toolId}-language`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              aria-label="Project language"
            >
              <option value="">Auto-detect</option>
              <option value="js">JavaScript</option>
              <option value="ts">TypeScript</option>
              <option value="java">Java</option>
              <option value="py">Python</option>
              <option value="cs">C#</option>
              <option value="go">Go</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-coverage`} className="block text-sm font-medium text-gray-700 mb-1">
              Coverage Plugin
            </label>
            <select
              id={`${toolId}-coverage`}
              value={coveragePlugin}
              onChange={(e) => setCoveragePlugin(e.target.value)}
              className="input-field"
              aria-label="Coverage plugin"
            >
              <option value="lcov">LCOV</option>
              <option value="javascript.lcov">JavaScript LCOV</option>
              <option value="jacoco">JaCoCo</option>
              <option value="cobertura">Cobertura</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-covpath`} className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Report Path
          </label>
          <input
            id={`${toolId}-covpath`}
            type="text"
            value={coveragePaths}
            onChange={(e) => setCoveragePaths(e.target.value)}
            className="input-field"
            aria-label="Coverage report path"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-exclusions`} className="block text-sm font-medium text-gray-700 mb-1">
            Exclusions (one per line)
          </label>
          <textarea
            id={`${toolId}-exclusions`}
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
            className="input-field h-24 resize-y font-mono"
            aria-label="Source exclusions"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-testexcl`} className="block text-sm font-medium text-gray-700 mb-1">
            Test Exclusions (one per line)
          </label>
          <textarea
            id={`${toolId}-testexcl`}
            value={testExclusions}
            onChange={(e) => setTestExclusions(e.target.value)}
            className="input-field h-24 resize-y font-mono"
            aria-label="Test exclusions"
          />
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate sonar-project.properties
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated sonar-project.properties</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
