'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function WaypointConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('my-app');
  const [buildType, setBuildType] = useState('docker');
  const [deployType, setDeployType] = useState('kubernetes');
  const [registryUrl, setRegistryUrl] = useState('docker.io/myorg');
  const [namespace, setNamespace] = useState('default');
  const [port, setPort] = useState('3000');
  const [replicas, setReplicas] = useState('2');
  const [output, setOutput] = useState('');

  const generate = () => {
    let buildBlock = '';
    if (buildType === 'docker') {
      buildBlock = `  build {
    use "docker" {
      dockerfile = "Dockerfile"
    }
    registry {
      use "docker" {
        image = "${registryUrl}/${appName}"
        tag   = gitrefpretty()
      }
    }
  }`;
    } else if (buildType === 'pack') {
      buildBlock = `  build {
    use "pack" {
      builder = "heroku/buildpacks:20"
    }
    registry {
      use "docker" {
        image = "${registryUrl}/${appName}"
        tag   = gitrefpretty()
      }
    }
  }`;
    } else {
      buildBlock = `  build {
    use "docker-pull" {
      image = "${registryUrl}/${appName}"
      tag   = "latest"
    }
  }`;
    }

    let deployBlock = '';
    if (deployType === 'kubernetes') {
      deployBlock = `  deploy {
    use "kubernetes" {
      probe_path = "/health"
      replicas   = ${replicas}
      namespace  = "${namespace}"
    }
  }`;
    } else if (deployType === 'nomad') {
      deployBlock = `  deploy {
    use "nomad-jobspec" {
      jobspec = templatefile("\${path.app}/job.nomad.tpl")
    }
  }`;
    } else if (deployType === 'ecs') {
      deployBlock = `  deploy {
    use "aws-ecs" {
      region = "us-east-1"
      memory = 512
      count  = ${replicas}
    }
  }`;
    } else {
      deployBlock = `  deploy {
    use "exec" {
      command = ["${appName}"]
    }
  }`;
    }

    const config = `project = "${appName}"

app "${appName}" {
  labels = {
    "service" = "${appName}"
    "env"     = "production"
  }

${buildBlock}

${deployBlock}

  release {
    use "kubernetes" {
      port = ${port}
    }
  }

  url {
    auto_hostname = true
  }
}`;

    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-app`} className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
            <input id={`${toolId}-app`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="input-field" aria-label={`Application name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-build`} className="block text-sm font-medium text-gray-700 mb-1">Build Type</label>
            <select id={`${toolId}-build`} value={buildType} onChange={(e) => setBuildType(e.target.value)} className="input-field" aria-label="Build type">
              <option value="docker">Docker</option>
              <option value="pack">Cloud Native Buildpacks</option>
              <option value="pull">Docker Pull</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-deploy`} className="block text-sm font-medium text-gray-700 mb-1">Deploy Platform</label>
            <select id={`${toolId}-deploy`} value={deployType} onChange={(e) => setDeployType(e.target.value)} className="input-field" aria-label="Deploy platform">
              <option value="kubernetes">Kubernetes</option>
              <option value="nomad">Nomad</option>
              <option value="ecs">AWS ECS</option>
              <option value="exec">Exec</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-registry`} className="block text-sm font-medium text-gray-700 mb-1">Registry URL</label>
            <input id={`${toolId}-registry`} type="text" value={registryUrl} onChange={(e) => setRegistryUrl(e.target.value)} className="input-field" aria-label="Registry URL" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} className="input-field" aria-label="Namespace" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input id={`${toolId}-port`} type="number" value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label="Port" />
          </div>
          <div>
            <label htmlFor={`${toolId}-replicas`} className="block text-sm font-medium text-gray-700 mb-1">Replicas</label>
            <input id={`${toolId}-replicas`} type="number" value={replicas} onChange={(e) => setReplicas(e.target.value)} className="input-field" aria-label="Replicas" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Waypoint Config</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">waypoint.hcl</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
