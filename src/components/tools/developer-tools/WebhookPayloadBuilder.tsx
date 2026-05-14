'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WebhookPayloadBuilder - Build webhook JSON payloads from event type and data fields.
 */
export default function WebhookPayloadBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [eventType, setEventType] = useState('push');
  const [source, setSource] = useState('github');
  const [customData, setCustomData] = useState('');

  const buildPayload = (): string => {
    const timestamp = new Date().toISOString();
    const id = Math.random().toString(36).slice(2, 10);

    const templates: Record<string, Record<string, unknown>> = {
      'github-push': {
        event: 'push',
        ref: 'refs/heads/main',
        repository: { full_name: 'user/repo', url: 'https://github.com/user/repo' },
        pusher: { name: 'developer', email: 'dev@example.com' },
        commits: [{ id: id, message: 'Update README', timestamp }],
      },
      'github-pull_request': {
        event: 'pull_request',
        action: 'opened',
        number: 42,
        pull_request: { title: 'Feature update', state: 'open', user: { login: 'developer' } },
      },
      'stripe-payment': {
        id: `evt_${id}`,
        type: 'payment_intent.succeeded',
        data: { object: { amount: 2000, currency: 'usd', status: 'succeeded' } },
        created: Math.floor(Date.now() / 1000),
      },
      'stripe-subscription': {
        id: `evt_${id}`,
        type: 'customer.subscription.created',
        data: { object: { plan: { id: 'plan_basic', amount: 999 }, status: 'active' } },
        created: Math.floor(Date.now() / 1000),
      },
      'slack-message': {
        token: 'xoxb-example',
        event: { type: 'message', text: 'Hello world', user: 'U12345', channel: 'C12345', ts: timestamp },
        type: 'event_callback',
      },
      'slack-interaction': {
        type: 'block_actions',
        user: { id: 'U12345', name: 'developer' },
        actions: [{ action_id: 'button_click', value: 'clicked' }],
        trigger_id: id,
      },
    };

    const key = `${source}-${eventType}`;
    const payload = templates[key] || { event: eventType, source, timestamp, data: {} };

    if (customData.trim()) {
      try {
        const custom = JSON.parse(customData);
        Object.assign(payload, { custom_data: custom });
      } catch {
        Object.assign(payload, { custom_data: customData.trim() });
      }
    }

    return JSON.stringify(payload, null, 2);
  };

  const eventOptions: Record<string, string[]> = {
    github: ['push', 'pull_request'],
    stripe: ['payment', 'subscription'],
    slack: ['message', 'interaction'],
  };

  const result = buildPayload();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select id={`${toolId}-source`} value={source} onChange={(e) => { setSource(e.target.value); setEventType(eventOptions[e.target.value]?.[0] || 'push'); }} aria-label={`Source for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {Object.keys(eventOptions).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-event`} className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select id={`${toolId}-event`} value={eventType} onChange={(e) => setEventType(e.target.value)} aria-label={`Event type for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {(eventOptions[source] || []).map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${toolId}-custom`} className="block text-sm font-medium text-gray-700 mb-1">Custom Data (optional JSON)</label>
        <textarea id={`${toolId}-custom`} value={customData} onChange={(e) => setCustomData(e.target.value)} rows={3} placeholder='{"key": "value"}' aria-label={`Custom data for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg max-h-80 overflow-y-auto">{result}</pre>
          <CopyToClipboard text={result} />
        </div>
      </OutputArea>
    </div>
  );
}
