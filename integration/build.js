const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const ngc = require('@angular/compiler-cli/src/main').main;


const srcDir = path.join(__dirname, 'src/');
const distDir = path.join(__dirname, 'dist/');
const aotDir = path.join(__dirname, 'aot/');
const rollupConfig = {
  entry: `${srcDir}/main-aot.js`,
  sourceMap: false,
  format: 'iife',
  onwarn: function (warning) {
    // Skip certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    // console.warn everything else
    console.warn(warning.message);
  },
  plugins: [
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: ['node_modules/rxjs/**']
    }),
    uglify()
  ]
};

return Promise.resolve()
  // Compile using ngc.
  .then(() => ngc({ project: `./tsconfig.aot.json` }))
  // Create dist dir.
  .then(() => _recursiveMkDir(distDir))
  // Copy files.
  .then(() => {
    // Copy and rename index-aot.html.
    fs.createReadStream(path.join(srcDir, 'index-aot.html'))
      .pipe(fs.createWriteStream(path.join(distDir, 'index.html')));

    // Copy global stylesheets, images, etc.
    const assets = [
      'favicon.ico',
      'styles.css'
    ];

    return Promise.all(assets.map(asset => _relativeCopy(asset, srcDir, distDir)));
  })
  // Bundle app.
  .then(() => rollup.rollup(rollupConfig))
  // Concatenate app and scripts.
  .then(bundle => {
    const appBundle = bundle.generate(rollupConfig);

    const scripts = [
      'node_modules/core-js/client/shim.min.js',
      'node_modules/zone.js/dist/zone.min.js'
    ];

    let concatenatedScripts = scripts.map((script) => {
      return fs.readFileSync(path.join(__dirname, script)).toString();
    }).join('\n;');

    concatenatedScripts = concatenatedScripts.concat('\n;', appBundle.code);

    fs.writeFileSync(path.join(distDir, 'bundle.js'), concatenatedScripts);
  });



// Copy files maintaining relative paths.
function _relativeCopy(fileGlob, from, to) {
  return glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const origin = path.join(from, file);
      const dest = path.join(to, file);
      _recursiveMkDir(path.dirname(dest));
      fs.createReadStream(origin).pipe(fs.createWriteStream(dest));
    })
  })
}

// Recursively create a dir.
function _recursiveMkDir(dir) {
  if (!fs.existsSync(dir)) {
    _recursiveMkDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}
