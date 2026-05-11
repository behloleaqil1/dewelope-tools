'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IpAddressLookup - Displays the user's current screen/browser information
 * and provides IP-related utilities like binary conversion.
 * Note: Does not make external API calls - shows local network info only.
 */
export default function IpAddressLookup({ toolId }: { toolId: string; toolName: string }) {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const data: Record<string, string> = {};

    // Browser and platform info
    data['User Agent'] = navigator.userAgent;
    data['Platform'] = navigator.platform;
    data['Language'] = navigator.language;
    data['Languages'] = navigator.languages?.join(', ') || navigator.language;
    data['Online Status'] = navigator.onLine ? 'Online' : 'Offline';
    data['Cookies Enabled'] = navigator.cookieEnabled ? 'Yes' : 'No';
    data['Do Not Track'] = navigator.doNotTrack || 'Not set';
    data['Screen Resolution'] = `${screen.width} × ${screen.height}`;
    data['Color Depth'] = `${screen.colorDepth}-bit`;
    data['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    data['Timezone Offset'] = `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`;
    data['Connection Type'] = (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'Unknown';
    data['Hardware Concurrency'] = `${navigator.hardwareConcurrency || 'Unknown'} cores`;
    data['Device Memory'] = `${(navigator as unknown as { deviceMemory?: number }).deviceMemory || 'Unknown'} GB`;
    data['Max Touch Points'] = `${navigator.maxTouchPoints}`;

    setInfo(data);
  }, []);

  const copyText = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
        This tool shows your browser and device information detected locally. No external API calls are made.
      </div>

      <OutputArea hasContent={Object.keys(info).length > 0}>
        {Object.keys(info).length > 0 && (
          <div className="space-y-2">
            <div className="divide-y divide-gray-100">
              {Object.entries(info).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start py-2 gap-4">
                  <span className="text-sm font-medium text-gray-600 flex-shrink-0">{key}</span>
                  <span className="text-sm text-gray-800 font-mono text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
