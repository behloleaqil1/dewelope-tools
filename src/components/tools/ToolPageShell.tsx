'use client';

import AdUnit from '@/components/ads/AdUnit';

interface ToolPageShellProps {
  toolName: string;
  description: string;
  children: React.ReactNode;
}

/**
 * ToolPageShell - Layout wrapper for tool pages.
 * Displays tool name, description, ad units, then children.
 */
export default function ToolPageShell({ toolName, description, children }: ToolPageShellProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {toolName}
        </h1>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Ad: between description and tool input */}
      <AdUnit position="in-content" size="responsive" className="w-full" />

      <div className="space-y-6">
        {children}
      </div>

      {/* Ad: after tool output */}
      <AdUnit position="leaderboard" size="728x90" className="w-full" />
    </div>
  );
}
