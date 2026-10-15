#!/usr/bin/env node
// Writes the draw.io diagram of a CRML file, by default next to it as <name>.drawio.

import fs from 'fs';
import { crmlToDrawio } from '../src/crmlDiagram.js';

const [inputFile, outputFile] = process.argv.slice(2);
if (!inputFile) {
  console.error('Usage: crml-diagram <file.crml> [<file.drawio>]');
  process.exit(1);
}

const { xml, errors } = crmlToDrawio(fs.readFileSync(inputFile, 'utf-8'));
errors.forEach((e) => console.error(`${inputFile}:${e.line}:${e.column}: ${e.message}`));
const outFile = outputFile || inputFile.replace(/\.crml$/, '') + '.drawio';
fs.writeFileSync(outFile, xml, 'utf-8');
console.log(`Diagram written to ${outFile}`);
