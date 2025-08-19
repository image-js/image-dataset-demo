import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function* walk(currentDir, baseDir) {
  const nextDir = join(baseDir, currentDir);
  for (const entry of readdirSync(nextDir, { withFileTypes: true })) {
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
  const fileInfo = statSync(join(entry.parentPath, entry.name));
  return {
    name: entry.name,
    parentPath: entry.parentPath,
    relativePath: join(baseDir, entry.name),
    size: fileInfo.size,
    lastModified: fileInfo.mtimeMs,
  };
}
