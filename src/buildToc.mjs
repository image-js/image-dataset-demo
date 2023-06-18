import { readdirSync, writeFileSync } from 'node:fs';

import { walk } from './walk.mjs';

const homedir = '../docs/'
createTocForFolder(homedir)

for (const entry of readdirSync(new URL(homedir, import.meta.url), { withFileTypes: true })) {
  if (entry.isDirectory()) {
    createTocForFolder(`${homedir}${entry.name}/`);
  }
}




async function createTocForFolder(folder) {
  const baseDir = new URL(folder, import.meta.url);
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

  const targetFile = new URL(`${folder}index.json`, import.meta.url);

  writeFileSync(targetFile, JSON.stringify(webSource, null, 2));


}

