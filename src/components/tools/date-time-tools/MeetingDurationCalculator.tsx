'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MeetingDurationCalculator - Calculate total meeting time from a list of meetings.
 * Supports adding multiple meetings with start/end times.
 */
export default function MeetingDurationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [meetings, setMeetings] = useState<{ name: string; start: string; end: string }[]>([
    { name: '', start: '09:00', end: '10:00' },
  ]);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    totalMinutes: number;
    meetingDetails: { name: string; duration: number }[];
    averageDuration: number;
  } | null>(null);

  const addMeeting = () => {
    setMeetings([...meetings, { name: '', start: '09:00', end: '10:00' }]);
  };

  const removeMeeting = (index: number) => {
    if (meetings.length > 1) {
      setMeetings(meetings.filter((_, i) => i !== index));
    }
  };

  const updateMeeting = (index: number, field: 'name' | 'start' | 'end', value: string) => {
    const updated = [...meetings];
    updated[index] = { ...updated[index], [field]: value };
    setMeetings(updated);
  };

  const calculate = () => {
    const details: { name: string; duration: number }[] = [];
    let totalMinutes = 0;

    for (let i = 0; i < meetings.length; i++) {
      const m = meetings[i];
      if (!m.start || !m.end) {
        setError(`Meeting ${i + 1}: Please set both start and end times.`);
        setResult(null);
        return;
      }

      const [startH, startM] = m.start.split(':').map(Number);
      const [endH, endM] = m.end.split(':').map(Number);
      let duration = (endH * 60 + endM) - (startH * 60 + startM);

      if (duration <= 0) {
        // Assume crosses midnight
        duration += 24 * 60;
      }

      details.push({ name: m.name || `Meeting ${i + 1}`, duration });
      totalMinutes += duration;
    }

    setError('');
    setResult({
      totalMinutes,
      meetingDetails: details,
      averageDuration: totalMinutes / details.length,
    });
  };

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const copyText = result
    ? `Total Meeting Time: ${formatDuration(result.totalMinutes)}\nAverage Duration: ${formatDuration(Math.round(result.averageDuration))}\nNumber of Meetings: ${result.meetingDetails.length}\n\n${result.meetingDetails.map((d) => `${d.name}: ${formatDuration(d.duration)}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {meetings.map((meeting, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (optional)</label>
              <input
                type="text"
                value={meeting.name}
                onChange={(e) => updateMeeting(i, 'name', e.target.value)}
                placeholder={`Meeting ${i + 1}`}
                aria-label={`Meeting ${i + 1} name for ${toolName}`}
                className="input-field text-sm"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
              <input
                type="time"
                value={meeting.start}
                onChange={(e) => updateMeeting(i, 'start', e.target.value)}
                aria-label={`Meeting ${i + 1} start time`}
                className="input-field text-sm"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
              <input
                type="time"
                value={meeting.end}
                onChange={(e) => updateMeeting(i, 'end', e.target.value)}
                aria-label={`Meeting ${i + 1} end time`}
                className="input-field text-sm"
              />
            </div>
            {meetings.length > 1 && (
              <button onClick={() => removeMeeting(i)} className="text-red-500 hover:text-red-700 text-sm px-2 py-1" aria-label={`Remove meeting ${i + 1}`}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addMeeting} className="px-4 py-2 rounded text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300" aria-label="Add another meeting">
          + Add Meeting
        </button>
        <button onClick={calculate} className="btn-primary" aria-label="Calculate total meeting time">
          Calculate Total
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{formatDuration(result.totalMinutes)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Time</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.meetingDetails.length}</div>
                <div className="text-xs text-gray-500 mt-1">Meetings</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{formatDuration(Math.round(result.averageDuration))}</div>
                <div className="text-xs text-gray-500 mt-1">Average</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Breakdown</h4>
              <div className="space-y-1 text-sm">
                {result.meetingDetails.map((d, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600">{d.name}</span>
                    <span className="font-mono text-gray-800">{formatDuration(d.duration)}</span>
                  </div>
                ))}
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
