# CRML Class-Object Diagram Generator

Parses CRML files and produces **class-object/instance diagrams** in draw.io (`.drawio`) format:
the classes with their attributes, requirements (with their conditions) and operators, the
top-level instances, and the associations between them.

The parser is generated from the grammar of the CRML compiler in
[OpenModelica/CRML](https://github.com/OpenModelica/CRML),
`submodules/language/src/main/antlr/crml/language/grammar/crml.g4`, so the generator always reads
the same language as the compiler. The generator was written by Rajat Agarwal in
[lenaRB/crml-compiler](https://github.com/lenaRB/crml-compiler/tree/DrawioDiagramGenerators)
(`DiagramGenerators/`) and moved here with its history.

This repository is a submodule of
- [OpenModelica/CRML](https://github.com/OpenModelica/CRML), as `diagram-generator/`, where it is
  built from the grammar of that checkout, and of
- [OpenModelica/OpenModelica](https://github.com/OpenModelica/OpenModelica), where OMEdit shows the
  diagram of a CRML file with the committed `dist/crml-diagram.min.js`, so that building
  OpenModelica needs neither Node.js nor Java.

## Prerequisites

- **Node.js** 18 or later, with npm
- **Java** 11 or later, to run the ANTLR tool (downloaded into `build/` on the first build)

## Build

```bash
npm install
npm run build
```

Inside a CRML checkout the grammar is found on its own. Elsewhere, give it with `CRML_GRAMMAR`:

```bash
CRML_GRAMMAR=/path/to/CRML/submodules/language/src/main/antlr/crml/language/grammar/crml.g4 npm run build
```

or `npm run generate -- --grammar <crml.g4>`. `npm run generate` regenerates the parser into
`generated/`, which is needed after every change of the grammar; `npm run bundle` writes
`dist/crml-diagram.min.js` (see [In a web page](#in-a-web-page)). `npm run build` does both.

`dist/crml-diagram.min.js` is committed: rebuild and commit it with every change of the generator
or of the grammar. The CI builds it from the grammar of the CRML master branch and fails if the
committed file differs.

## Usage

```bash
node bin/crml-diagram.js <file.crml> [<file.drawio>]
```

**Example:**
```bash
node bin/crml-diagram.js test/test_files/pumping3.crml /tmp/pumping3.drawio
```

Without an output file the diagram is written next to the input, as `<name>.drawio`. Syntax
errors are printed, and the diagram shows what could still be parsed.

Open the `.drawio` file in [draw.io](https://app.diagrams.net), or in VS Code with the
**Draw.io Integration** extension.

## In a web page

`dist/crml-diagram.min.js` is a single script, with the ANTLR runtime and the parser, that defines
the global `CRMLDiagram`:

```js
const { xml, errors } = CRMLDiagram.crmlToDrawio(text, { link: 'crml:///pumping3.crml' });
```

`errors` holds the syntax errors as `{ line, column, message }`. With the `link` option every class,
attribute, requirement, operator and instance links to the line it is defined on, as
`<link>?lineNumber=<line>`. OMEdit uses this script to show the diagram of a CRML file.

## Tests

```bash
npm test
```

compares the diagram of each `test/test_files/*.crml` with the `.drawio` file next to it, syntax
errors included (as comments at the end). After an intended change, `node test/run.mjs --update`
rewrites the expected files; check the difference before committing it.

## Caveats

- The test files use constructs that the current grammar does not accept; their diagrams show what
  could be parsed, and the errors are recorded in the expected files.
- Classes are laid out in a grid and instances beneath them; edit the layout in draw.io if needed.

## License

See [OSMC-License.txt](OSMC-License.txt): the OSMC Public License (OSMC-PL) version 1.8 or the GNU AGPL version 3,
as for [OpenModelica](https://github.com/OpenModelica/OpenModelica) and [CRML](https://github.com/OpenModelica/CRML).
