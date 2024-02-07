import { readdirSync, writeFileSync } from 'node:fs';

import { walk } from './walk.mjs';

const homedir = '../docs/';

createIndexForFolder(homedir);

const toc = {
  title: 'Demo images',
  sections: [],
};

for (const entry of readdirSync(new URL(homedir, import.meta.url), {
  withFileTypes: true,
})) {
  if (entry.isDirectory()) {
    const section = getSectionForFolder(`${homedir}${entry.name}/`);
    toc.sections.push(section);
    createIndexForFolder(`${homedir}${entry.name}/`);
  }
}

writeFileSync(
  new URL(`${homedir}toc.json`, import.meta.url),
  JSON.stringify(toc, null, 2),
);

function getSectionForFolder(folder) {
  const section = {
    title: folder.split('/').at(-2),
    sources: [],
  };
  const baseDir = new URL(folder, import.meta.url);

  for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) continue;
    const relativePath = new URL(entry.name, baseDir).pathname.replace(
      /^.*\/docs\//,
      '',
    );
    section.sources.push({
      name: entry.name,
      source: {
        baseURL: 'https://image-js.github.io/image-dataset-demo/',
        entries: [{ relativePath }],
      },
    });
  }
  return section;
}

async function createIndexForFolder(folder) {
  const baseDir = new URL(folder, import.meta.url);
  const webSource = { entries: [] };
  for (const entry of walk('.', baseDir)) {
    if (entry.name.endsWith('.json')) continue;
    if (entry.name.startsWith('.')) continue;
    const relativePath = new URL(entry.relativePath, baseDir).pathname.replace(
      /^.*\/docs\//,
      '',
    );
    webSource.entries.push({
      name: entry.name,
      relativePath,
      size: entry.size,
      lastModified: entry.lastModified,
    });
  }

  const targetFile = new URL(`${folder}index.json`, import.meta.url);
  writeFileSync(targetFile, JSON.stringify(webSource, null, 2));
}
