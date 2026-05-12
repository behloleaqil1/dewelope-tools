const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/data/tools-registry.ts');
let content = fs.readFileSync(registryPath, 'utf8');

// Find the array content between the opening [ and closing ];
const arrayStart = content.indexOf('export const toolsRegistry: ToolConfig[] = [');
const arrayEnd = content.indexOf('];', arrayStart);

const before = content.substring(0, arrayStart);
const arrayContent = content.substring(arrayStart, arrayEnd + 2);
const after = content.substring(arrayEnd + 2);

// Extract individual entries (each starts with "  { id: '")
const entries = arrayContent.match(/  \{ id: '[^']+',.*?\},?$/gm) || [];

// Deduplicate by id, keeping the LAST occurrence (our new ones override old)
const seen = new Map();
entries.forEach((entry, idx) => {
  const idMatch = entry.match(/id: '([^']+)'/);
  if (idMatch) {
    seen.set(idMatch[1], { entry, idx });
  }
});

// Sort by original index to maintain order
const unique = [...seen.values()].sort((a, b) => a.idx - b.idx).map(v => v.entry);

// Rebuild the array
const header = "export const toolsRegistry: ToolConfig[] = [\n";
const newArrayContent = header + unique.join('\n') + '\n];';

const newContent = before + newArrayContent + after;
fs.writeFileSync(registryPath, newContent);

console.log(`Deduplication complete. ${entries.length} entries -> ${unique.length} unique entries.`);
