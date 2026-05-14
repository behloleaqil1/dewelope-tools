'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Service {
  name: string;
  image: string;
  ports: string;
  environment: string;
}

/**
 * DockerComposeYamlGenerator - Generate docker-compose.yml from service configurations.
 */
export default function DockerComposeYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [services, setServices] = useState<Service[]>([{ name: 'web', image: 'nginx:latest', ports: '80:80', environment: '' }]);
  const [version, setVersion] = useState('3.8');

  const addService = () => setServices([...services, { name: '', image: '', ports: '', environment: '' }]);
  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[i] = { ...updated[i], [field]: value };
    setServices(updated);
  };

  const generateYaml = (): string => {
    const validServices = services.filter(s => s.name && s.image);
    if (validServices.length === 0) return '';
    let yaml = `version: '${version}'\n\nservices:\n`;
    for (const svc of validServices) {
      yaml += `  ${svc.name}:\n`;
      yaml += `    image: ${svc.image}\n`;
      if (svc.ports) {
        yaml += `    ports:\n`;
        svc.ports.split(',').map(p => p.trim()).filter(Boolean).forEach(p => { yaml += `      - "${p}"\n`; });
      }
      if (svc.environment) {
        yaml += `    environment:\n`;
        svc.environment.split(',').map(e => e.trim()).filter(Boolean).forEach(e => { yaml += `      - ${e}\n`; });
      }
    }
    return yaml;
  };

  const result = generateYaml();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Compose Version</label>
        <select id={`${toolId}-version`} value={version} onChange={(e) => setVersion(e.target.value)} aria-label={`Docker compose version for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="3.8">3.8</option>
          <option value="3.9">3.9</option>
          <option value="3">3</option>
        </select>
      </div>
      {services.map((svc, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Service {i + 1}</span>
            {services.length > 1 && <button onClick={() => removeService(i)} className="text-red-500 text-xs">Remove</button>}
          </div>
          <input value={svc.name} onChange={(e) => updateService(i, 'name', e.target.value)} placeholder="Service name" aria-label={`Service ${i + 1} name`} className="w-full p-2 border border-gray-300 rounded text-sm" />
          <input value={svc.image} onChange={(e) => updateService(i, 'image', e.target.value)} placeholder="Image (e.g. nginx:latest)" aria-label={`Service ${i + 1} image`} className="w-full p-2 border border-gray-300 rounded text-sm" />
          <input value={svc.ports} onChange={(e) => updateService(i, 'ports', e.target.value)} placeholder="Ports (e.g. 80:80, 443:443)" aria-label={`Service ${i + 1} ports`} className="w-full p-2 border border-gray-300 rounded text-sm" />
          <input value={svc.environment} onChange={(e) => updateService(i, 'environment', e.target.value)} placeholder="Env vars (e.g. NODE_ENV=production)" aria-label={`Service ${i + 1} environment`} className="w-full p-2 border border-gray-300 rounded text-sm" />
        </div>
      ))}
      <button onClick={addService} className="text-blue-600 text-sm font-medium">+ Add Service</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
