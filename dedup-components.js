const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/[category]/[tool]/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Find the TOOL_COMPONENTS object
const startMarker = "const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {";
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf('\n};', startIdx);

const before = content.substring(0, startIdx + startMarker.length);
const objectContent = content.substring(startIdx + startMarker.length, endIdx);
const after = content.substring(endIdx);

// Parse lines - keep comments and entries
const lines = objectContent.split('\n');
const seen = new Set();
const result = [];

for (const line of lines) {
  const keyMatch = line.match(/^\s+'([^']+)':/);
  if (keyMatch) {
    const key = keyMatch[1];
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  } else {
    // Comment or empty line
    result.push(line);
  }
}

const newContent = before + result.join('\n') + after;
fs.writeFileSync(pagePath, newContent);
console.log(`TOOL_COMPONENTS deduplication complete. Kept ${seen.size} unique entries.`);
