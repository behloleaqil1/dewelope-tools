'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TektonPipelineGenerator - Generate Tekton CI/CD pipeline YAML configurations.
 */
export default function TektonPipelineGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pipelineName, setPipelineName] = useState('my-pipeline');
  const [namespace, setNamespace] = useState('default');
  const [tasks, setTasks] = useState('build,test,deploy');
  const [image, setImage] = useState('ubuntu:latest');
  const [output, setOutput] = useState('');

  const generate = () => {
    const taskList = tasks.split(',').map(t => t.trim()).filter(Boolean);
    const taskYamls = taskList.map((task, idx) => {
      const runAfter = idx > 0 ? `\n      runAfter:\n        - ${taskList[idx - 1]}` : '';
      return `    - name: ${task}\n      taskRef:\n        name: ${task}-task${runAfter}`;
    }).join('\n');

    const taskDefinitions = taskList.map(task => {
      return `---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: ${task}-task
  namespace: ${namespace}
spec:
  steps:
    - name: ${task}-step
      image: ${image}
      command:
        - /bin/sh
      args:
        - -c
        - echo "Running ${task} step"`;
    }).join('\n');

    const pipeline = `apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: ${pipelineName}
  namespace: ${namespace}
spec:
  tasks:
${taskYamls}
${taskDefinitions}
---
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: ${pipelineName}-run
  namespace: ${namespace}
spec:
  pipelineRef:
    name: ${pipelineName}`;

    setOutput(pipeline);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name</label>
            <input id={`${toolId}-name`} type="text" value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} className="input-field" aria-label={`Pipeline name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-namespace`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-namespace`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} className="input-field" aria-label="Kubernetes namespace" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tasks`} className="block text-sm font-medium text-gray-700 mb-1">Tasks (comma-separated)</label>
            <input id={`${toolId}-tasks`} type="text" value={tasks} onChange={(e) => setTasks(e.target.value)} className="input-field" aria-label="Pipeline tasks" />
          </div>
          <div>
            <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Container Image</label>
            <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input-field" aria-label="Container image" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Pipeline</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tekton Pipeline YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
