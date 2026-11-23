#!/usr/bin/env node
import {readFile, writeFile, cp, mkdir, rm} from 'node:fs/promises';
import {resolve, relative, isAbsolute, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sections, themes, findLand, fold} from './api.mjs';
const root = fileURLToPath(new URL('.', import.meta.url));
const data = async file =>
  JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
const [cmd = 'help', arg = '', ...rest] = process.argv.slice(2);
const print = value => console.log(JSON.stringify(value, null, 2));
try {
  if (cmd === 'land')
    print(
      findLand(await data('data/land.json'), arg, rest[0]).map(r => ({
        ...r,
        context: sections[r.section],
      })),
    );
  else if (cmd === 'component')
    print(
      (await data('data/components.json')).filter(c =>
        fold(c.name).includes(fold(arg)),
      ),
    );
  else if (cmd === 'blocks')
    print(
      (await data('cad/blocks.json')).filter(r =>
        fold(r.block + ' ' + r.name).includes(fold(arg)),
      ),
    );
  else if (cmd === 'themes') print(Object.keys(themes));
  else if (cmd === 'theme') {
    if (!Object.hasOwn(themes, arg))
      throw Error('Theme hợp lệ: ' + Object.keys(themes).join(', '));
    await writeFile(
      new URL('settings.json', import.meta.url),
      JSON.stringify({theme: arg}) + '\n',
    );
  } else if (cmd === 'create') {
    if (!arg) throw Error('Cần tên thư mục mới.');
    const dest = resolve(arg),
      rel = relative(root, dest);
    if (
      !rel ||
      (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep))
    )
      throw Error('Chọn thư mục ngoài template nguồn.');
    await mkdir(dest);
    try {
      for (const file of [
        'index.html',
        'style.css',
        'app.mjs',
        'api.mjs',
        'cli.mjs',
        'settings.json',
        'data',
        'cad',
        'hatch',
        'sources',
        'README.md',
      ]) {
        await cp(resolve(root, file), resolve(dest, file), {
          recursive: true,
          errorOnExist: true,
          force: false,
        });
      }
    } catch (e) {
      await rm(dest, {recursive: true, force: true});
      throw e;
    }
    console.log(dest);
  } else if (cmd === 'help')
    console.log(
      'design-gis create DIR | land [QUERY] [SECTION] | component [NAME] | blocks [QUERY] | themes | theme NAME',
    );
  else throw Error('Lệnh không hợp lệ. Chạy help để xem cú pháp.');
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
