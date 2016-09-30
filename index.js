#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('./package');
const reqCwd = require('req-cwd');
const jspm = reqCwd('jspm');
const globby = require('globby');
const debug = require('debug')(pkg.name);

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('<entrypoint>')
  .parse(process.argv);

const expression = program.args[0];
if (!expression) program.help();
const expressionDir = path.dirname(expression);

function paths() {
  return globby([`${expressionDir}/**/*.js`]);
}

function jspmTree() {
  var builder = new jspm.Builder();
  return builder.trace(expression).then(tree => {
    var files = [];
    for (let name in tree) {
      let modulePath = tree[name].path;
      if (modulePath) {
        const dirname = path.dirname(modulePath).split(path.sep)[0];
        if (dirname && dirname == expressionDir) {
          files.push(modulePath);
        }
      }
    }
    return files;
  });
}

debug(`Building the tree for ${expression}`);
Promise.all([paths(), jspmTree()]).then(res => {
  const paths = res[0];
  const tree = new Set(res[1]);
  const unused = new Set(paths.filter(file => !tree.has(file)));
  debug(unused.size > 0 ? 'Unused files: ' : 'No unused files');
  for (let file of unused) {
    console.log(file);
  }
}).catch(err => {
	console.log(err.stack);
	process.exit(1);
});
