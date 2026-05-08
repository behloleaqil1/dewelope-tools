'use client';

import { ToolEngineProps } from '@/types';

/**
 * Placeholder component for tool engines that haven't been implemented yet.
 * Displays a "coming soon" message with the tool name.
 * This will be replaced as actual tool engines are built.
 */
export default function ToolEnginePlaceholder({ toolId, toolName }: ToolEngineProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Tool Coming Soon
      </h2>
      <p className="text-gray-500">
        The <span className="font-medium">{toolName}</span> engine is under development.
      </p>
      <p className="text-gray-400 text-sm mt-2">
        Tool ID: {toolId}
      </p>
    </div>
  );
}
