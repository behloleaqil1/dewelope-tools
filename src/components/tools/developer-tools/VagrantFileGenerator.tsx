'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VagrantFileGenerator - Generate Vagrantfile from VM configuration options.
 */
export default function VagrantFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [box, setBox] = useState('ubuntu/jammy64');
  const [hostname, setHostname] = useState('dev-vm');
  const [memory, setMemory] = useState('2048');
  const [cpus, setCpus] = useState('2');
  const [ip, setIp] = useState('192.168.56.10');
  const [ports, setPorts] = useState('8080:80');
  const [provision, setProvision] = useState('');
  const [syncedFolder, setSyncedFolder] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!box.trim()) {
      setError('Please specify a Vagrant box.');
      return;
    }

    let vagrantfile = `# -*- mode: ruby -*-\n# vi: set ft=ruby :\n\nVagrant.configure("2") do |config|\n`;
    vagrantfile += `  config.vm.box = "${box.trim()}"\n`;

    if (hostname.trim()) {
      vagrantfile += `  config.vm.hostname = "${hostname.trim()}"\n`;
    }

    if (ip.trim()) {
      vagrantfile += `\n  config.vm.network "private_network", ip: "${ip.trim()}"\n`;
    }

    if (ports.trim()) {
      const portMappings = ports.split(',').map(p => p.trim()).filter(Boolean);
      vagrantfile += '\n';
      for (const mapping of portMappings) {
        const [host, guest] = mapping.split(':');
        if (host && guest) {
          vagrantfile += `  config.vm.network "forwarded_port", guest: ${guest.trim()}, host: ${host.trim()}\n`;
        }
      }
    }

    if (syncedFolder.trim()) {
      const folders = syncedFolder.split(',').map(f => f.trim()).filter(Boolean);
      vagrantfile += '\n';
      for (const folder of folders) {
        const [src, dest] = folder.split(':');
        if (src && dest) {
          vagrantfile += `  config.vm.synced_folder "${src.trim()}", "${dest.trim()}"\n`;
        }
      }
    }

    vagrantfile += `\n  config.vm.provider "virtualbox" do |vb|\n`;
    vagrantfile += `    vb.memory = "${memory.trim() || '2048'}"\n`;
    vagrantfile += `    vb.cpus = ${cpus.trim() || '2'}\n`;
    vagrantfile += `  end\n`;

    if (provision.trim()) {
      vagrantfile += `\n  config.vm.provision "shell", inline: <<-SHELL\n`;
      const lines = provision.split('\n');
      for (const line of lines) {
        vagrantfile += `    ${line}\n`;
      }
      vagrantfile += `  SHELL\n`;
    }

    vagrantfile += `end\n`;

    setOutput(vagrantfile);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-box`} className="block text-sm font-medium text-gray-700 mb-1">Vagrant Box</label>
              <input id={`${toolId}-box`} type="text" value={box} onChange={(e) => setBox(e.target.value)} placeholder="ubuntu/jammy64" aria-label={`Vagrant box for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-hostname`} className="block text-sm font-medium text-gray-700 mb-1">Hostname</label>
              <input id={`${toolId}-hostname`} type="text" value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="dev-vm" aria-label="VM hostname" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-memory`} className="block text-sm font-medium text-gray-700 mb-1">Memory (MB)</label>
              <input id={`${toolId}-memory`} type="text" value={memory} onChange={(e) => setMemory(e.target.value)} placeholder="2048" aria-label="VM memory in MB" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cpus`} className="block text-sm font-medium text-gray-700 mb-1">CPUs</label>
              <input id={`${toolId}-cpus`} type="text" value={cpus} onChange={(e) => setCpus(e.target.value)} placeholder="2" aria-label="Number of CPUs" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ip`} className="block text-sm font-medium text-gray-700 mb-1">Private Network IP</label>
              <input id={`${toolId}-ip`} type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.56.10" aria-label="Private network IP" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ports`} className="block text-sm font-medium text-gray-700 mb-1">Port Forwards (host:guest)</label>
              <input id={`${toolId}-ports`} type="text" value={ports} onChange={(e) => setPorts(e.target.value)} placeholder="8080:80, 3306:3306" aria-label="Port forwarding" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-synced`} className="block text-sm font-medium text-gray-700 mb-1">Synced Folders (src:dest, comma-separated)</label>
            <input id={`${toolId}-synced`} type="text" value={syncedFolder} onChange={(e) => setSyncedFolder(e.target.value)} placeholder="./src:/var/www/html" aria-label="Synced folders" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-provision`} className="block text-sm font-medium text-gray-700 mb-1">Shell Provisioning Script</label>
            <textarea id={`${toolId}-provision`} value={provision} onChange={(e) => setProvision(e.target.value)} placeholder="apt-get update&#10;apt-get install -y nginx" aria-label="Provisioning script" className="input-field h-24 resize-y font-mono text-sm" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Vagrantfile">Generate Vagrantfile</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Vagrantfile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
