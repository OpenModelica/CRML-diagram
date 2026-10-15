#!/usr/bin/env node
// Bundles crmlToDrawio with the ANTLR runtime and the generated parser into
// dist/crml-diagram.min.js, a single script for a browser page that defines
// the global CRMLDiagram, e.g. CRMLDiagram.crmlToDrawio(text, { link: 'crml:///file' }).

import path from 'path';
import { build } from 'esbuild';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({
  entryPoints: [path.join(root, 'src/crmlDiagram.js')],
  outfile: path.join(root, 'dist/crml-diagram.min.js'),
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'CRMLDiagram',
  platform: 'browser',
  target: 'es2020',
  legalComments: 'eof',
});
console.log('Bundle written to dist/crml-diagram.min.js');
