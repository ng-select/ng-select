'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');


/**
 * Simple Promiseify function that takes a Node API and return a version that supports promises.
 * We use promises instead of synchronized functions to make the process less I/O bound and
 * faster. It also simplifies the code.
 */
function promiseify(fn) {
  return function () {
    const args = [].slice.call(arguments, 0);
    return new Promise((resolve, reject) => {
      fn.apply(this, args.concat([function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }]));
    });
  };
}

const readFile = promiseify(fs.readFile);
const writeFile = promiseify(fs.writeFile);

/**
 * Inline resources in a tsc/ngc compilation.
 * @param projectPath {string} Path to the project.
 */
function inlineResources(projectPath) {

  // Match only TypeScript files in projectPath.
  const files = glob.sync('**/*.ts', {cwd: projectPath});

  // For each file, inline the templates and styles under it and write the new file.
  return Promise.all(files.map(filePath => {
    const fullFilePath = path.join(projectPath, filePath);
    return readFile(fullFilePath, 'utf-8')
      .then(content => inlineResourcesFromString(content, url => {
        // Resolve the template url.
        return path.join(path.dirname(fullFilePath), url);
      }))
      .then(content => writeFile(fullFilePath, content))
      .catch(err => {
        console.error('An error occured: ', err);
      });
  }));
}

/**
 * Inline resources from a string content.
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @returns {string} The content with resources inlined.
 */
function inlineResourcesFromString(content, urlResolver) {
  // Curry through the inlining functions.
  return [
    inlineTemplate,
    inlineStyle,
    removeModuleId
  ].reduce((content, fn) => fn(content, urlResolver), content);
}

/**
 * Inline the templates for a source file. Simply search for instances of `templateUrl: ...` and
 * replace with `template: ...` (with the content of the file included).
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @return {string} The content with all templates inlined.
 */
function inlineTemplate(content, urlResolver) {
  return content.replace(/templateUrl:\s*'([^']+?\.html)'/g, function (m, templateUrl) {
    const templateFile = urlResolver(templateUrl);
    const templateContent = fs.readFileSync(templateFile, 'utf-8');
    const shortenedTemplate = templateContent
      .replace(/([\n\r]\s*)+/gm, ' ')
      .replace(/"/g, '\\"');
    return `template: "${shortenedTemplate}"`;
  });
}


/**
 * Inline the styles for a source file. Simply search for instances of `styleUrls: [...]` and
 * replace with `styles: [...]` (with the content of the file included).
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @param content {string} The source file's content.
 * @return {string} The content with all styles inlined.
 */
function inlineStyle(content, urlResolver) {
  return content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function (m, styleUrls) {
    const urls = eval(styleUrls);
    return 'styles: ['
      + urls.map(styleUrl => {
        const styleFile = urlResolver(styleUrl);
        const styleContent = fs.readFileSync(styleFile, 'utf-8');
        const shortenedStyle = styleContent
          .replace(/([\n\r]\s*)+/gm, ' ')
          .replace(/"/g, '\\"');
        return `"${shortenedStyle}"`;
      })
        .join(',\n')
      + ']';
  });
}


/**
 * Remove every mention of `moduleId: module.id`.
 * @param content {string} The source file's content.
 * @returns {string} The content with all moduleId: mentions removed.
 */
function removeModuleId(content) {
  return content.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '');
}

module.exports = inlineResources;
module.exports.inlineResourcesFromString = inlineResourcesFromString;

// Run inlineResources if module is being called directly from the CLI with arguments.
if (require.main === module && process.argv.length > 2) {
  console.log('Inlining resources from project:', process.argv[2]);
  return inlineResources(process.argv[2]);
}
