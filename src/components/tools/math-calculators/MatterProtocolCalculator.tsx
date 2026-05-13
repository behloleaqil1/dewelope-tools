'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatterProtocolCalculator - Calculate Matter/Thread smart home network capacity
 * based on border routers, device types, and network topology.
 */
export default function MatterProtocolCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [borderRouters, setBorderRouters] = useState('2');
  const [threadDevices, setThreadDevices] = useState('20');
  const [wifiDevices, setWifiDevices] = useState('10');
  const [networkType, setNetworkType] = useState('thread');
  const [homeSize, setHomeSize] = useState('medium');
  const [output, setOutput] = useState('');

  const networkTypes = [
    { value: 'thread', label: 'Thread (mesh)' },
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'hybrid', label: 'Hybrid (Thread + Wi-Fi)' },
  ];

  const homeSizes = [
    { value: 'small', label: 'Small (1-2 rooms)', area: 50, maxRouters: 1 },
    { value: 'medium', label: 'Medium (3-5 rooms)', area: 120, maxRouters: 2 },
    { value: 'large', label: 'Large (6-10 rooms)', area: 250, maxRouters: 3 },
    { value: 'xlarge', label: 'Extra Large (10+ rooms)', area: 400, maxRouters: 5 },
  ];

  const calculate = () => {
    const routers = parseInt(borderRouters);
    const threadDev = parseInt(threadDevices);
    const wifiDev = parseInt(wifiDevices);

    if (isNaN(routers) || isNaN(threadDev) || isNaN(wifiDev)) {
      setOutput('Please enter valid numbers.');
      return;
    }

    const home = homeSizes.find(h => h.value === homeSize);
    if (!home) return;

    // Thread network capacity: ~250 devices per Thread network
    // Each border router can handle ~32 sleepy end devices
    const threadCapacity = routers * 32;
    const maxThreadPerNetwork = 250;
    const effectiveThreadMax = Math.min(threadCapacity, maxThreadPerNetwork);

    // Wi-Fi capacity depends on router (typically 32-128 devices)
    const wifiCapacity = routers * 64;

    // Coverage estimation
    const threadRange = 10; // meters per hop
    const maxHops = 4;
    const coverageRadius = threadRange * maxHops;
    const coverageArea = Math.PI * coverageRadius * coverageRadius;
    const coveragePercent = Math.min((coverageArea / home.area) * 100, 100);

    // Latency estimation
    const avgHops = Math.ceil(threadDev / (routers * 8));
    const latencyPerHop = 15; // ms
    const estimatedLatency = avgHops * latencyPerHop + 50; // base latency

    const totalDevices = threadDev + wifiDev;
    const utilizationThread = (threadDev / effectiveThreadMax) * 100;
    const utilizationWifi = (wifiDev / wifiCapacity) * 100;

    const results = [
      `=== Matter/Thread Network Capacity ===`,
      ``,
      `Network Configuration:`,
      `  Border Routers: ${routers}`,
      `  Thread Devices: ${threadDev}`,
      `  Wi-Fi Devices: ${wifiDev}`,
      `  Total Devices: ${totalDevices}`,
      `  Network Type: ${networkTypes.find(n => n.value === networkType)?.label}`,
      `  Home Size: ${home.label}`,
      ``,
      `Thread Network:`,
      `  Max Capacity: ${effectiveThreadMax} devices`,
      `  Current Utilization: ${utilizationThread.toFixed(1)}%`,
      `  Sleepy End Devices per Router: 32`,
      `  Router Devices per Network: 32`,
      ``,
      `Wi-Fi Network:`,
      `  Max Capacity: ${wifiCapacity} devices`,
      `  Current Utilization: ${utilizationWifi.toFixed(1)}%`,
      ``,
      `Coverage & Performance:`,
      `  Thread Coverage: ${coveragePercent.toFixed(0)}% of home area`,
      `  Max Mesh Hops: ${maxHops}`,
      `  Avg Hops to Border Router: ${avgHops}`,
      `  Estimated Latency: ${estimatedLatency} ms`,
      ``,
      `Recommendations:`,
      routers < home.maxRouters ? `  ⚠️ Consider adding ${home.maxRouters - routers} more border router(s)` : `  ✓ Border router count is adequate`,
      utilizationThread > 80 ? `  ⚠️ Thread network utilization is high` : `  ✓ Thread network has headroom`,
      utilizationWifi > 70 ? `  ⚠️ Wi-Fi network is getting crowded` : `  ✓ Wi-Fi capacity is sufficient`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-routers`} className="block text-sm font-medium text-gray-700 mb-1">Border Routers</label>
              <input id={`${toolId}-routers`} type="number" min="1" max="10" value={borderRouters} onChange={(e) => setBorderRouters(e.target.value)} aria-label={`Border routers for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-thread`} className="block text-sm font-medium text-gray-700 mb-1">Thread Devices</label>
              <input id={`${toolId}-thread`} type="number" min="0" max="250" value={threadDevices} onChange={(e) => setThreadDevices(e.target.value)} aria-label="Thread device count" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-wifi`} className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Devices</label>
              <input id={`${toolId}-wifi`} type="number" min="0" max="200" value={wifiDevices} onChange={(e) => setWifiDevices(e.target.value)} aria-label="Wi-Fi device count" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-network`} className="block text-sm font-medium text-gray-700 mb-1">Network Type</label>
              <select id={`${toolId}-network`} value={networkType} onChange={(e) => setNetworkType(e.target.value)} aria-label="Network type" className="input-field">
                {networkTypes.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-home`} className="block text-sm font-medium text-gray-700 mb-1">Home Size</label>
            <select id={`${toolId}-home`} value={homeSize} onChange={(e) => setHomeSize(e.target.value)} aria-label="Home size" className="input-field">
              {homeSizes.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Network Capacity</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Network Capacity Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
