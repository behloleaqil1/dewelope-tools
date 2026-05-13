'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PackerTemplateGenerator - Generate HashiCorp Packer template HCL.
 */
export default function PackerTemplateGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sourceName, setSourceName] = useState('ubuntu-base');
  const [sourceType, setSourceType] = useState('amazon-ebs');
  const [region, setRegion] = useState('us-east-1');
  const [instanceType, setInstanceType] = useState('t2.micro');
  const [sshUsername, setSshUsername] = useState('ubuntu');
  const [buildName, setBuildName] = useState('my-image');
  const [provisioner, setProvisioner] = useState('shell');
  const [shellCommands, setShellCommands] = useState('sudo apt-get update\nsudo apt-get install -y nginx');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cmds = shellCommands.split('\n').map(c => `      "${c.trim()}"`).join(',\n');
    const hcl = `packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "${sourceType}" "${sourceName}" {
  ami_name      = "${buildName}-{{timestamp}}"
  instance_type = "${instanceType}"
  region        = "${region}"

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-jammy-22.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }

  ssh_username = "${sshUsername}"
}

build {
  name = "${buildName}"

  sources = [
    "source.${sourceType}.${sourceName}"
  ]

  provisioner "${provisioner}" {
    inline = [
${cmds}
    ]
  }
}`;
    setOutput(hcl);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-source-name`} className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
            <input id={`${toolId}-source-name`} type="text" value={sourceName} onChange={(e) => setSourceName(e.target.value)} className="input-field" aria-label={`Source name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-source-type`} className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
            <select id={`${toolId}-source-type`} value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="input-field" aria-label="Source type">
              <option value="amazon-ebs">Amazon EBS</option>
              <option value="azure-arm">Azure ARM</option>
              <option value="googlecompute">Google Compute</option>
              <option value="docker">Docker</option>
              <option value="virtualbox-iso">VirtualBox ISO</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-region`} className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <input id={`${toolId}-region`} type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="input-field" aria-label="Region" />
          </div>
          <div>
            <label htmlFor={`${toolId}-instance`} className="block text-sm font-medium text-gray-700 mb-1">Instance Type</label>
            <input id={`${toolId}-instance`} type="text" value={instanceType} onChange={(e) => setInstanceType(e.target.value)} className="input-field" aria-label="Instance type" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ssh`} className="block text-sm font-medium text-gray-700 mb-1">SSH Username</label>
            <input id={`${toolId}-ssh`} type="text" value={sshUsername} onChange={(e) => setSshUsername(e.target.value)} className="input-field" aria-label="SSH username" />
          </div>
          <div>
            <label htmlFor={`${toolId}-build`} className="block text-sm font-medium text-gray-700 mb-1">Build Name</label>
            <input id={`${toolId}-build`} type="text" value={buildName} onChange={(e) => setBuildName(e.target.value)} className="input-field" aria-label="Build name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-provisioner`} className="block text-sm font-medium text-gray-700 mb-1">Provisioner</label>
            <select id={`${toolId}-provisioner`} value={provisioner} onChange={(e) => setProvisioner(e.target.value)} className="input-field" aria-label="Provisioner type">
              <option value="shell">Shell</option>
              <option value="ansible">Ansible</option>
              <option value="file">File</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-commands`} className="block text-sm font-medium text-gray-700 mb-1">Shell Commands (one per line)</label>
          <textarea id={`${toolId}-commands`} value={shellCommands} onChange={(e) => setShellCommands(e.target.value)} className="input-field h-32 resize-y font-mono" aria-label="Shell commands" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Packer Template</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Packer Template HCL</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
