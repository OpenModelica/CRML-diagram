#!/usr/bin/env node
// Checks the diagram of each test/test_files/*.crml against the .drawio next to
// it. With --update the expected .drawio files are rewritten instead.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crmlToDrawio } from '../src/crmlDiagram.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test_files');
const update = process.argv.includes('--update');
let failed = 0;
for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.crml')).sort()) {
  const expectedFile = path.join(dir, name.replace(/\.crml$/, '.drawio'));
  const { xml, errors } = crmlToDrawio(fs.readFileSync(path.join(dir, name), 'utf-8'),
                                       { link: `crml:///${name}` });
  const result = xml + errors.map((e) => `\n<!-- ${e.line}:${e.column}: ${e.message.replace(/--/g, '- -')} -->`).join('');
  if (update) {
    fs.writeFileSync(expectedFile, result + '\n');
    console.log(`updated ${path.basename(expectedFile)}`);
  } else if (!fs.existsSync(expectedFile) || fs.readFileSync(expectedFile, 'utf-8') !== result + '\n') {
    console.log(`FAIL ${name}`);
    failed++;
  } else {
    console.log(`ok   ${name}`);
  }
}
process.exit(failed ? 1 : 0);
