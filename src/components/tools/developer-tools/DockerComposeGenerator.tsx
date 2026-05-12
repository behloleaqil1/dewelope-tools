'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Service {
  name: string;
  image: string;
  ports: string;
  environment: string;
  volumes: string;
  dependsOn: string;
}

/**
 * DockerComposeGenerator - Generate docker-compose.yml from service definitions.
 */
export default function DockerComposeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [services, setServices] = useState<Service[]>([{ name: 'web', image: 'nginx:latest', ports: '80:80', environment: '', volumes: '', dependsOn: '' }]);
  const [version, setVersion] = useState('3.8');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const addService = () => {
    setServices([...services, { name: '', image: '', ports: '', environment: '', volumes: '', dependsOn: '' }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const generate = () => {
    setError('');
    setOutput('');

    const validServices = services.filter(s => s.name.trim() && s.image.trim());
    if (validServices.length === 0) {
      setError('Please add at least one service with a name and image.');
      return;
    }

    let yaml = `version: '${version}'\n\nservices:\n`;

    for (const svc of validServices) {
      yaml += `  ${svc.name.trim()}:\n`;
      yaml += `    image: ${svc.image.trim()}\n`;

      if (svc.ports.trim()) {
        const portList = svc.ports.split(',').map(p => p.trim()).filter(Boolean);
        yaml += `    ports:\n`;
        for (const port of portList) {
          yaml += `      - "${port}"\n`;
        }
      }

      if (svc.environment.trim()) {
        const envList = svc.environment.split(',').map(e => e.trim()).filter(Boolean);
        yaml += `    environment:\n`;
        for (const env of envList) {
          yaml += `      - ${env}\n`;
        }
      }

      if (svc.volumes.trim()) {
        const volList = svc.volumes.split(',').map(v => v.trim()).filter(Boolean);
        yaml += `    volumes:\n`;
        for (const vol of volList) {
          yaml += `      - ${vol}\n`;
        }
      }

      if (svc.dependsOn.trim()) {
        const deps = svc.dependsOn.split(',').map(d => d.trim()).filter(Boolean);
        yaml += `    depends_on:\n`;
        for (const dep of deps) {
          yaml += `      - ${dep}\n`;
        }
      }

      yaml += '\n';
    }

    setOutput(yaml.trimEnd());
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Compose Version</label>
            <select id={`${toolId}-version`} value={version} onChange={(e) => setVersion(e.target.value)} aria-label={`Compose version for ${toolName}`} className="input-field w-32">
              <option value="3.8">3.8</option>
              <option value="3.9">3.9</option>
              <option value="3">3</option>
              <option value="2.4">2.4</option>
            </select>
          </div>

          {services.map((svc, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Service {i + 1}</span>
                {services.length > 1 && (
                  <button onClick={() => removeService(i)} className="text-red-500 text-xs hover:underline" aria-label={`Remove service ${i + 1}`}>Remove</button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input value={svc.name} onChange={(e) => updateService(i, 'name', e.target.value)} placeholder="Service name (e.g. web)" aria-label="Service name" className="input-field text-sm" />
                <input value={svc.image} onChange={(e) => updateService(i, 'image', e.target.value)} placeholder="Image (e.g. nginx:latest)" aria-label="Docker image" className="input-field text-sm" />
                <input value={svc.ports} onChange={(e) => updateService(i, 'ports', e.target.value)} placeholder="Ports (e.g. 80:80, 443:443)" aria-label="Port mappings" className="input-field text-sm" />
                <input value={svc.environment} onChange={(e) => updateService(i, 'environment', e.target.value)} placeholder="Env vars (e.g. DB_HOST=db)" aria-label="Environment variables" className="input-field text-sm" />
                <input value={svc.volumes} onChange={(e) => updateService(i, 'volumes', e.target.value)} placeholder="Volumes (e.g. ./data:/data)" aria-label="Volume mounts" className="input-field text-sm" />
                <input value={svc.dependsOn} onChange={(e) => updateService(i, 'dependsOn', e.target.value)} placeholder="Depends on (e.g. db, redis)" aria-label="Service dependencies" className="input-field text-sm" />
              </div>
            </div>
          ))}

          <button onClick={addService} className="text-sm text-blue-600 hover:underline" aria-label="Add another service">+ Add Service</button>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate docker-compose.yml">Generate docker-compose.yml</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">docker-compose.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
