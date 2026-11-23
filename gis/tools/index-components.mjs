// Refresh the offline index from the same documentation modules as Astryx CLI.
import {readdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const source = fileURLToPath(
  new URL('../../packages/core/src/', import.meta.url),
);
const rows = [];
for (const file of await readdir(source, {recursive: true})) {
  if (!file.endsWith('.doc.mjs')) continue;
  const {docs} = await import(
    new URL(
      '../../packages/core/src/' + file.split(path.sep).join('/'),
      import.meta.url,
    )
  );
  rows.push({
    name: docs.name,
    group: docs.category || docs.group || path.basename(path.dirname(file)),
    summary: docs.usage?.description || docs.description || '',
    source: 'packages/core/src/' + file.split(path.sep).join('/'),
    cli: 'astryx component ' + docs.name,
  });
}
rows.sort((a, b) => a.name.localeCompare(b.name, 'en'));
await writeFile(
  new URL('../data/components.json', import.meta.url),
  JSON.stringify(rows, null, 2) + '\n',
);
