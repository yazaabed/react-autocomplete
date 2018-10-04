const fs = require("fs");

let buildPath = process.env.BUILD_PATH;

let fileContent = `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod/index.js');
} else {
  module.exports = require('./dev/index.js');
}
`;

console.log("Start appending index.js...");

fs.writeFile(`./${buildPath}/index.js`, fileContent, function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("Append index.js done...");
});

/**
 * Change main entry for json after build
 */
let packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson['main'] = 'index.js';
delete packageJson['devDependencies'];
delete packageJson['scripts'];
delete packageJson['directories']['src'];

console.log("........................................");
console.log("Start appending package.json...");

fs.writeFile(`./${buildPath}/package.json`, JSON.stringify(packageJson, null, "  "), function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("Append package.json done...");
});