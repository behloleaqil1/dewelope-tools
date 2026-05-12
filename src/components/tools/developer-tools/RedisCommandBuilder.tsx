'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CommandParam {
  label: string;
  placeholder: string;
  required?: boolean;
}

interface RedisCommand {
  name: string;
  description: string;
  params: CommandParam[];
}

const COMMANDS: RedisCommand[] = [
  { name: 'GET', description: 'Get the value of a key', params: [{ label: 'Key', placeholder: 'mykey', required: true }] },
  { name: 'SET', description: 'Set a key to a value', params: [{ label: 'Key', placeholder: 'mykey', required: true }, { label: 'Value', placeholder: 'myvalue', required: true }, { label: 'EX (seconds)', placeholder: '3600' }] },
  { name: 'DEL', description: 'Delete one or more keys', params: [{ label: 'Key(s)', placeholder: 'key1 key2', required: true }] },
  { name: 'HSET', description: 'Set hash field value', params: [{ label: 'Key', placeholder: 'myhash', required: true }, { label: 'Field', placeholder: 'field1', required: true }, { label: 'Value', placeholder: 'value1', required: true }] },
  { name: 'HGET', description: 'Get hash field value', params: [{ label: 'Key', placeholder: 'myhash', required: true }, { label: 'Field', placeholder: 'field1', required: true }] },
  { name: 'LPUSH', description: 'Prepend values to a list', params: [{ label: 'Key', placeholder: 'mylist', required: true }, { label: 'Value(s)', placeholder: 'val1 val2', required: true }] },
  { name: 'RPUSH', description: 'Append values to a list', params: [{ label: 'Key', placeholder: 'mylist', required: true }, { label: 'Value(s)', placeholder: 'val1 val2', required: true }] },
  { name: 'LRANGE', description: 'Get range of list elements', params: [{ label: 'Key', placeholder: 'mylist', required: true }, { label: 'Start', placeholder: '0', required: true }, { label: 'Stop', placeholder: '-1', required: true }] },
  { name: 'EXPIRE', description: 'Set key expiration in seconds', params: [{ label: 'Key', placeholder: 'mykey', required: true }, { label: 'Seconds', placeholder: '3600', required: true }] },
  { name: 'SADD', description: 'Add members to a set', params: [{ label: 'Key', placeholder: 'myset', required: true }, { label: 'Member(s)', placeholder: 'mem1 mem2', required: true }] },
  { name: 'ZADD', description: 'Add members to a sorted set', params: [{ label: 'Key', placeholder: 'myzset', required: true }, { label: 'Score', placeholder: '1', required: true }, { label: 'Member', placeholder: 'member1', required: true }] },
  { name: 'INCR', description: 'Increment integer value of key', params: [{ label: 'Key', placeholder: 'counter', required: true }] },
];

/**
 * RedisCommandBuilder - Build Redis commands from form inputs.
 * Select a command, fill in parameters, and get the formatted Redis CLI command.
 */
export default function RedisCommandBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedCmd, setSelectedCmd] = useState('GET');
  const [paramValues, setParamValues] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const currentCommand = COMMANDS.find((c) => c.name === selectedCmd) || COMMANDS[0];

  function handleCommandChange(cmd: string) {
    setSelectedCmd(cmd);
    setParamValues([]);
    setOutput('');
  }

  function handleParamChange(index: number, value: string) {
    const updated = [...paramValues];
    updated[index] = value;
    setParamValues(updated);
  }

  function handleBuild() {
    const parts = [currentCommand.name];
    for (let i = 0; i < currentCommand.params.length; i++) {
      const val = (paramValues[i] || '').trim();
      if (!val && currentCommand.params[i].required) {
        setOutput(`Error: ${currentCommand.params[i].label} is required`);
        return;
      }
      if (val) {
        if (currentCommand.name === 'SET' && i === 2) {
          parts.push('EX', val);
        } else if (val.includes(' ')) {
          val.split(/\s+/).forEach((v) => parts.push(v));
        } else {
          parts.push(val);
        }
      }
    }
    setOutput(parts.join(' '));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-cmd`} className="block text-sm font-medium text-gray-700 mb-1">
          Redis Command
        </label>
        <select
          id={`${toolId}-cmd`}
          value={selectedCmd}
          onChange={(e) => handleCommandChange(e.target.value)}
          aria-label={`Select command for ${toolName}`}
          className="input-field"
        >
          {COMMANDS.map((cmd) => (
            <option key={cmd.name} value={cmd.name}>
              {cmd.name} - {cmd.description}
            </option>
          ))}
        </select>
      </InputArea>

      <div className="space-y-3">
        {currentCommand.params.map((param, idx) => (
          <InputArea key={`${selectedCmd}-${idx}`}>
            <label htmlFor={`${toolId}-param-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">
              {param.label} {param.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={`${toolId}-param-${idx}`}
              type="text"
              value={paramValues[idx] || ''}
              onChange={(e) => handleParamChange(idx, e.target.value)}
              placeholder={param.placeholder}
              aria-label={`${param.label} for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        ))}
      </div>

      <button onClick={handleBuild} aria-label="Build Redis command" className="btn-primary">
        Build Command
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
