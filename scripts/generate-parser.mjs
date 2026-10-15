#!/usr/bin/env node
// Generates the JavaScript CRML parser into generated/ from the grammar of the
// language submodule, so that the diagram generator always parses what the
// compiler parses. The ANTLR tool is downloaded into build/ once; its version
// must match the antlr4 runtime in package.json.

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ANTLR_VERSION = '4.13.2';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const grammar = path.resolve(root, '../submodules/language/src/main/antlr/crml/language/grammar/crml.g4');
const buildDir = path.join(root, 'build');
const outDir = path.join(root, 'generated');
const jar = path.join(buildDir, `antlr-${ANTLR_VERSION}-complete.jar`);

fs.mkdirSync(buildDir, { recursive: true });
if (!fs.existsSync(jar)) {
  const url = `https://www.antlr.org/download/antlr-${ANTLR_VERSION}-complete.jar`;
  console.log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Downloading ${url} failed: ${response.status} ${response.statusText}`);
  }
  fs.writeFileSync(jar, Buffer.from(await response.arrayBuffer()));
}

// A rule named constructor becomes ConstructorContext.constructor(), which is
// not valid JavaScript, so the rule is renamed in a copy of the grammar.
const text = fs.readFileSync(grammar, 'utf-8').replace(/\bconstructor\b/g, 'constructorRule');
const grammarCopy = path.join(buildDir, 'crml.g4');
fs.writeFileSync(grammarCopy, text);

fs.rmSync(outDir, { recursive: true, force: true });
execFileSync('java', ['-jar', jar, '-Dlanguage=JavaScript', '-Xexact-output-dir', '-o', outDir, grammarCopy],
             { stdio: 'inherit' });
console.log(`Generated the parser in ${path.relative(process.cwd(), outDir) || '.'}`);
