'use client';

interface ToolPageShellProps {
  toolName: string;
  description: string;
  children: React.ReactNode;
}

/**
 * ToolPageShell - Layout wrapper for tool pages.
 * Displays tool name, description, an ad slot placeholder, then children.
 */
export default function ToolPageShell({ toolName, description, children }: ToolPageShellProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {toolName}
        </h1>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Ad slot placeholder */}
      <div
        className="w-full"
        aria-hidden="true"
        data-ad-slot="in-content"
      />

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
