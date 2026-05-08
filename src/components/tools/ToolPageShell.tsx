'use client';

interface ToolPageShellProps {
  toolName: string;
  description: string;
  children: React.ReactNode;
}

/**
 * ToolPageShell - Layout wrapper for tool pages.
 * Displays tool name, description, ad slots, then children.
 * Ad positions: between description and input, and after tool output.
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

      {/* Ad slot: between description and input */}
      <div
        className="w-full"
        aria-hidden="true"
        data-ad-slot="in-content"
      />

      <div className="space-y-6">
        {children}
      </div>

      {/* Ad slot: after tool output */}
      <div
        className="w-full"
        aria-hidden="true"
        data-ad-slot="after-output"
      />
    </div>
  );
}
