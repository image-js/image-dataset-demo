import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { walk } from './walk.js';

const homedir = path.join(import.meta.dirname, '../docs');

await createIndexForFolder(homedir);

const toc = {
  title: 'Demo images',
  sections: [],
};

for (const entry of readdirSync(homedir, {
  withFileTypes: true,
})) {
  if (entry.isDirectory()) {
    const entryDir = path.join(homedir, entry.name);
    const section = getSectionForFolder(entryDir);
    toc.sections.push(section);
    // eslint-disable-next-line no-await-in-loop
    await createIndexForFolder(entryDir);
  }
}

toc.sections.sort((a, b) =>
  a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
);

writeFileSync(path.join(homedir, 'toc.json'), JSON.stringify(toc, null, 2));

function getSectionForFolder(folder) {
  const section = {
    title: folder.split('/').at(-1),
    sources: [],
  };

  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) continue;
    const relativePath = path
      .join(folder, entry.name)
      .replace(/^.*\/docs\//, '');
    section.sources.push({
      name: entry.name,
      source: {
        baseURL: 'https://demo-dataset.image-js.org/',
        entries: [{ relativePath }],
      },
    });
  }

  section.sources.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );

  return section;
}

async function createIndexForFolder(folder) {
  const webSource = { entries: [] };
  for (const entry of walk('.', folder)) {
    if (entry.name.endsWith('.json') || entry.name === 'CNAME') continue;
    if (entry.name.startsWith('.')) continue;
    webSource.entries.push({
      name: entry.name,
      relativePath: entry.relativePath,
      size: entry.size,
      lastModified: entry.lastModified,
    });
  }

  webSource.entries.sort((a, b) =>
    a.relativePath.toLowerCase().localeCompare(b.relativePath.toLowerCase()),
  );

  const targetFile = path.join(folder, 'index.json');
  writeFileSync(targetFile, JSON.stringify(webSource, null, 2));
}
