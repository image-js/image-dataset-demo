import { readdir, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function* walk(currentDir, baseDir) {
  const url = new URL(currentDir, baseDir);
  for (const entry of readdirSync(url, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const newDir = join(currentDir, entry.name);
      for (const subentry of walk(newDir, baseDir)) {
        yield getEntry(subentry, newDir);
      }
    } else {
      yield getEntry(entry, currentDir);
    }
  }
}

function getEntry(entry, baseDir) {
  const fileInfo = statSync(join(entry.path, entry.name));
  return {
    name: entry.name,
    path: entry.path,
    relativePath: join(baseDir, entry.name),
    size: fileInfo.size,
    lastModified: fileInfo.mtimeMs,
  };
}
