'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CodecovConfigGenerator - Generate Codecov codecov.yml configuration files
 * with coverage targets, flags, ignore paths, and notification settings.
 */
export default function CodecovConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectTarget, setProjectTarget] = useState('80');
  const [patchTarget, setPatchTarget] = useState('70');
  const [flags, setFlags] = useState('unittests');
  const [ignorePaths, setIgnorePaths] = useState('tests/\nnode_modules/\n*.test.ts');
  const [notifySlack, setNotifySlack] = useState(false);
  const [commentLayout, setCommentLayout] = useState('reach,diff,flags');
  const [output, setOutput] = useState('');

  const generate = () => {
    const flagList = flags.split('\n').filter(f => f.trim());
    const ignoreList = ignorePaths.split('\n').filter(p => p.trim());

    const config: string[] = [
      'codecov:',
      '  require_ci_to_pass: yes',
      '',
      'coverage:',
      '  precision: 2',
      '  round: down',
      '  range: "60...100"',
      '  status:',
      '    project:',
      '      default:',
      `        target: ${projectTarget}%`,
      '        threshold: 1%',
      '    patch:',
      '      default:',
      `        target: ${patchTarget}%`,
      '',
    ];

    if (flagList.length > 0) {
      config.push('flags:');
      flagList.forEach(flag => {
        config.push(`  ${flag.trim()}:`);
        config.push('    paths:');
        config.push('      - src/');
        config.push('    carryforward: true');
      });
      config.push('');
    }

    if (ignoreList.length > 0) {
      config.push('ignore:');
      ignoreList.forEach(path => {
        config.push(`  - "${path.trim()}"`);
      });
      config.push('');
    }

    config.push('comment:');
    config.push(`  layout: "${commentLayout}"`);
    config.push('  behavior: default');
    config.push('  require_changes: false');

    if (notifySlack) {
      config.push('');
      config.push('notify:');
      config.push('  slack:');
      config.push('    default:');
      config.push('      url: "secret:SLACK_WEBHOOK"');
      config.push('      threshold: 1%');
    }

    setOutput(config.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">Project Target (%)</label>
              <input id={`${toolId}-project`} type="number" min="0" max="100" value={projectTarget} onChange={(e) => setProjectTarget(e.target.value)} aria-label={`Project coverage target for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-patch`} className="block text-sm font-medium text-gray-700 mb-1">Patch Target (%)</label>
              <input id={`${toolId}-patch`} type="number" min="0" max="100" value={patchTarget} onChange={(e) => setPatchTarget(e.target.value)} aria-label="Patch coverage target" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-flags`} className="block text-sm font-medium text-gray-700 mb-1">Flags (one per line)</label>
            <textarea id={`${toolId}-flags`} value={flags} onChange={(e) => setFlags(e.target.value)} aria-label="Coverage flags" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ignore`} className="block text-sm font-medium text-gray-700 mb-1">Ignore Paths (one per line)</label>
            <textarea id={`${toolId}-ignore`} value={ignorePaths} onChange={(e) => setIgnorePaths(e.target.value)} aria-label="Paths to ignore" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-layout`} className="block text-sm font-medium text-gray-700 mb-1">Comment Layout</label>
            <input id={`${toolId}-layout`} type="text" value={commentLayout} onChange={(e) => setCommentLayout(e.target.value)} aria-label="PR comment layout" className="input-field" />
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-slack`} type="checkbox" checked={notifySlack} onChange={(e) => setNotifySlack(e.target.checked)} className="rounded" />
            <label htmlFor={`${toolId}-slack`} className="text-sm text-gray-700">Enable Slack notifications</label>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate codecov.yml</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated codecov.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
