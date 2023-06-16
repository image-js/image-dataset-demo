import { writeFileSync } from 'node:fs';

import { walk } from './walk.mjs';

const baseDir = new URL('../docs/', import.meta.url);

const webSource = { entries: [] };

for (const entry of walk('.', baseDir)) {
  if (entry.name === 'index.json') continue;
  webSource.entries.push({
    name: entry.name,
    relativePath: entry.relativePath,
    size: entry.size,
    lastModified: entry.lastModified,
  });
}

const targetFile = new URL('../docs/index.json', import.meta.url);

writeFileSync(targetFile, JSON.stringify(webSource, null, 2));
