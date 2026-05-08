import { ToolConfig } from '@/types';

/**
 * Generates JSON-LD HowTo structured data for a tool page.
 * Conforms to schema.org HowTo type for rich search results.
 *
 * @param tool - The tool configuration from the registry
 * @returns HowTo schema object or null if no steps are defined
 */
export function generateHowToSchema(tool: ToolConfig) {
  if (!tool.howToSteps) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${tool.name}`,
    description: tool.howToUse || tool.description,
    step: tool.howToSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
    tool: { '@type': 'HowToTool', name: 'Web Browser' },
    totalTime: 'PT1M',
  };
}
