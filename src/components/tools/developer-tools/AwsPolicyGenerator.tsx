'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AwsPolicyGenerator - Generate AWS IAM policy JSON from form inputs.
 */
export default function AwsPolicyGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [effect, setEffect] = useState<'Allow' | 'Deny'>('Allow');
  const [service, setService] = useState('s3');
  const [actions, setActions] = useState('GetObject,PutObject');
  const [resource, setResource] = useState('arn:aws:s3:::my-bucket/*');
  const [condition, setCondition] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = [
    { value: 's3', label: 'S3' },
    { value: 'ec2', label: 'EC2' },
    { value: 'lambda', label: 'Lambda' },
    { value: 'dynamodb', label: 'DynamoDB' },
    { value: 'sqs', label: 'SQS' },
    { value: 'sns', label: 'SNS' },
    { value: 'iam', label: 'IAM' },
    { value: 'logs', label: 'CloudWatch Logs' },
    { value: 'sts', label: 'STS' },
    { value: 'kms', label: 'KMS' },
  ];

  const generate = () => {
    const newErrors: Record<string, string> = {};
    if (!actions.trim()) newErrors.actions = 'At least one action is required';
    if (!resource.trim()) newErrors.resource = 'Resource ARN is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOutput('');
      return;
    }
    setErrors({});

    const actionList = actions.split(',').map(a => `${service}:${a.trim()}`).filter(Boolean);

    interface Statement {
      Effect: string;
      Action: string[];
      Resource: string;
      Condition?: Record<string, Record<string, string>>;
    }

    const statement: Statement = {
      Effect: effect,
      Action: actionList,
      Resource: resource.trim(),
    };

    if (condition.trim()) {
      try {
        statement.Condition = JSON.parse(condition.trim());
      } catch {
        // skip invalid condition
      }
    }

    const policy = {
      Version: '2012-10-17',
      Statement: [statement],
    };

    setOutput(JSON.stringify(policy, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-effect`} className="block text-sm font-medium text-gray-700 mb-1">Effect</label>
          <select id={`${toolId}-effect`} value={effect} onChange={(e) => setEffect(e.target.value as 'Allow' | 'Deny')} className="input-field" aria-label={`Effect for ${toolName}`}>
            <option value="Allow">Allow</option>
            <option value="Deny">Deny</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-service`} className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select id={`${toolId}-service`} value={service} onChange={(e) => setService(e.target.value)} className="input-field" aria-label={`Service for ${toolName}`}>
            {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
      </div>

      <InputArea error={errors.actions}>
        <label htmlFor={`${toolId}-actions`} className="block text-sm font-medium text-gray-700 mb-1">Actions (comma-separated)</label>
        <input id={`${toolId}-actions`} type="text" value={actions} onChange={(e) => setActions(e.target.value)} placeholder="GetObject,PutObject,DeleteObject" aria-label={`Actions for ${toolName}`} className="input-field" />
      </InputArea>

      <InputArea error={errors.resource}>
        <label htmlFor={`${toolId}-resource`} className="block text-sm font-medium text-gray-700 mb-1">Resource ARN</label>
        <input id={`${toolId}-resource`} type="text" value={resource} onChange={(e) => setResource(e.target.value)} placeholder="arn:aws:s3:::my-bucket/*" aria-label={`Resource ARN for ${toolName}`} className="input-field" />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-condition`} className="block text-sm font-medium text-gray-700 mb-1">Condition (optional JSON)</label>
        <textarea id={`${toolId}-condition`} value={condition} onChange={(e) => setCondition(e.target.value)} placeholder='{"IpAddress": {"aws:SourceIp": "192.168.1.0/24"}}' aria-label={`Condition for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate IAM Policy">Generate Policy</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated IAM Policy</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
