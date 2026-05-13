'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ArgoCdApplicationGenerator - Generate ArgoCD Application manifest YAML.
 * Creates a valid ArgoCD Application resource with configurable source, destination, and sync policy.
 */
export default function ArgoCdApplicationGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('');
  const [namespace, setNamespace] = useState('argocd');
  const [repoUrl, setRepoUrl] = useState('');
  const [path, setPath] = useState('');
  const [targetRevision, setTargetRevision] = useState('HEAD');
  const [destServer, setDestServer] = useState('https://kubernetes.default.svc');
  const [destNamespace, setDestNamespace] = useState('default');
  const [autoSync, setAutoSync] = useState(false);
  const [selfHeal, setSelfHeal] = useState(false);
  const [prune, setPrune] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!appName || !repoUrl || !path) {
      setOutput('# Please fill in App Name, Repo URL, and Path');
      return;
    }

    let yaml = `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ${appName}
  namespace: ${namespace}
spec:
  project: default
  source:
    repoURL: ${repoUrl}
    targetRevision: ${targetRevision}
    path: ${path}
  destination:
    server: ${destServer}
    namespace: ${destNamespace}`;

    if (autoSync) {
      yaml += `
  syncPolicy:
    automated:
      selfHeal: ${selfHeal}
      prune: ${prune}
    syncOptions:
      - CreateNamespace=true`;
    }

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
            <input id={`${toolId}-name`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="my-app" aria-label="Application name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="argocd" aria-label="ArgoCD namespace" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-repo`} className="block text-sm font-medium text-gray-700 mb-1">Repo URL</label>
            <input id={`${toolId}-repo`} type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/org/repo.git" aria-label="Git repository URL" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Path</label>
            <input id={`${toolId}-path`} type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="k8s/overlays/prod" aria-label="Path in repository" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rev`} className="block text-sm font-medium text-gray-700 mb-1">Target Revision</label>
            <input id={`${toolId}-rev`} type="text" value={targetRevision} onChange={(e) => setTargetRevision(e.target.value)} placeholder="HEAD" aria-label="Target revision" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">Destination Server</label>
            <input id={`${toolId}-dest`} type="text" value={destServer} onChange={(e) => setDestServer(e.target.value)} placeholder="https://kubernetes.default.svc" aria-label="Destination cluster server" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-destns`} className="block text-sm font-medium text-gray-700 mb-1">Destination Namespace</label>
            <input id={`${toolId}-destns`} type="text" value={destNamespace} onChange={(e) => setDestNamespace(e.target.value)} placeholder="default" aria-label="Destination namespace" className="input-field" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} aria-label="Enable auto sync" /> Auto Sync
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selfHeal} onChange={(e) => setSelfHeal(e.target.checked)} disabled={!autoSync} aria-label="Enable self heal" /> Self Heal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={prune} onChange={(e) => setPrune(e.target.checked)} disabled={!autoSync} aria-label="Enable prune" /> Prune
          </label>
        </div>
        <button onClick={generate} className="btn-primary mt-3" aria-label="Generate ArgoCD Application YAML">
          Generate YAML
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ArgoCD Application Manifest</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
