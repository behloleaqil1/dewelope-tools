'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NomadJobGenerator - Generate HashiCorp Nomad job specification HCL.
 */
export default function NomadJobGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [jobName, setJobName] = useState('my-service');
  const [jobType, setJobType] = useState('service');
  const [datacenters, setDatacenters] = useState('dc1');
  const [taskDriver, setTaskDriver] = useState('docker');
  const [image, setImage] = useState('nginx:latest');
  const [cpu, setCpu] = useState('500');
  const [memory, setMemory] = useState('256');
  const [port, setPort] = useState('80');
  const [count, setCount] = useState('1');
  const [output, setOutput] = useState('');

  const generate = () => {
    const dcs = datacenters.split(',').map(d => `"${d.trim()}"`).join(', ');
    const hcl = `job "${jobName}" {
  type = "${jobType}"
  datacenters = [${dcs}]

  group "${jobName}-group" {
    count = ${count}

    network {
      port "http" {
        static = ${port}
      }
    }

    task "${jobName}-task" {
      driver = "${taskDriver}"

      config {
        image = "${image}"
        ports = ["http"]
      }

      resources {
        cpu    = ${cpu}
        memory = ${memory}
      }

      service {
        name = "${jobName}"
        port = "http"

        check {
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}`;
    setOutput(hcl);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
            <input id={`${toolId}-name`} type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} className="input-field" aria-label={`Job name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select id={`${toolId}-type`} value={jobType} onChange={(e) => setJobType(e.target.value)} className="input-field" aria-label="Job type">
              <option value="service">Service</option>
              <option value="batch">Batch</option>
              <option value="system">System</option>
              <option value="sysbatch">Sysbatch</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-dc`} className="block text-sm font-medium text-gray-700 mb-1">Datacenters (comma-separated)</label>
            <input id={`${toolId}-dc`} type="text" value={datacenters} onChange={(e) => setDatacenters(e.target.value)} className="input-field" aria-label="Datacenters" />
          </div>
          <div>
            <label htmlFor={`${toolId}-driver`} className="block text-sm font-medium text-gray-700 mb-1">Task Driver</label>
            <select id={`${toolId}-driver`} value={taskDriver} onChange={(e) => setTaskDriver(e.target.value)} className="input-field" aria-label="Task driver">
              <option value="docker">Docker</option>
              <option value="exec">Exec</option>
              <option value="java">Java</option>
              <option value="raw_exec">Raw Exec</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Container Image</label>
            <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input-field" aria-label="Container image" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input id={`${toolId}-port`} type="number" value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label="Port number" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cpu`} className="block text-sm font-medium text-gray-700 mb-1">CPU (MHz)</label>
            <input id={`${toolId}-cpu`} type="number" value={cpu} onChange={(e) => setCpu(e.target.value)} className="input-field" aria-label="CPU in MHz" />
          </div>
          <div>
            <label htmlFor={`${toolId}-memory`} className="block text-sm font-medium text-gray-700 mb-1">Memory (MB)</label>
            <input id={`${toolId}-memory`} type="number" value={memory} onChange={(e) => setMemory(e.target.value)} className="input-field" aria-label="Memory in MB" />
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count</label>
            <input id={`${toolId}-count`} type="number" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label="Task count" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Nomad Job</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Nomad Job HCL</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
