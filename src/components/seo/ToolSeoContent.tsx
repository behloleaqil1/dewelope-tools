interface ToolSeoContentProps {
  toolName: string;
  howToUse?: string;
  howToSteps?: string[];
}

/**
 * ToolSeoContent - Renders keyword-rich SEO content below the tool.
 * Displays a "How to Use" guide and numbered step-by-step instructions.
 */
export default function ToolSeoContent({ toolName, howToUse, howToSteps }: ToolSeoContentProps) {
  if (!howToUse && !howToSteps) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200" aria-label={`How to use ${toolName}`}>
      {howToUse && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            How to Use {toolName}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            {howToUse}
          </p>
        </div>
      )}

      {howToSteps && howToSteps.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Step-by-Step Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {howToSteps.map((step, index) => (
              <li key={index} className="text-sm text-gray-600 leading-relaxed pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
