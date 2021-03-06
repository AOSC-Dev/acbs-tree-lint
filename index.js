#!/bin/node

const package = require('./package.json')
const fs = require('fs');
const mylog = require('./libs/mylog.js');
const exec = require('child_process').execSync;
console.log(`
================================================================================

    Welcome to ACBS-TREE-LINT (v${package.version})
    Copyright (c) 2020 Neruthes & various contributors
    Licensed undere GNU AGPL v3
    Source code is public at https://github.com/AOSC-Dev/acbs-tree-lint

================================================================================
`.trim());

// ----------------------------------------
// Parameters
const LINTER = process.argv[2];
const TARGET = process.argv[3];

// ----------------------------------------
// Linters
const Linters = {
    spec: require('./libs/spec.js')
};

// ----------------------------------------
// Main
if (!LINTER) {
    mylog.fail('No linter specified.');
}
if (Object.keys(Linters).indexOf(LINTER) !== -1) {
    // Linter exists
    mylog.info(`Running linter "${LINTER}".`);

    const dirsl1 = fs.readdirSync('./').filter(x => x.match(/^\w+-\w+$/));
    const dirsl2 = dirsl1.map(function (dir) {
        return fs.readdirSync(`./${dir}`).map(x => `./${dir}/${x}`).join('\n');
    }).join('\n').split('\n').filter(function (dirl2) {
        let skips = [
            './extra-utils/cpuburn'
        ];
        if (skips.indexOf(dirl2) === -1) {
            return true;
        };
    });

    Linters[LINTER]({
        dirsl2: dirsl2
    });
} else {
    mylog.fail(`Linter ${LINTER} does not exist.`);
    mylog.fail(`Please select among [ ${Object.keys(Linters).join(', ')} ].`);
};
