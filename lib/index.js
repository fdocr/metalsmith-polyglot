/**
 * Helper functions, separated from plugin core for testing purposes.
 */
var helpers = require('./helpers.js');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin that exposes relative paths
 * for redirecting to translated content.
 *
 * @param {Object} options
 *   @property {String} baseLang
 *   @property {Boolean} permalinks
 *   @property {String} emptyTranslationPath
 * @return {Function}
 */

 function plugin(options) {
     options = options || {};
     var baseLang = options.baseLang || "en";
     var permalinksEnabled = options.permalinks || true;
     var emptyRedirectPath = options.emptyTranslationPath;

     return function (files, metalsmith, done) {
         var file, fileLang, translationUrl, strippedUrl, currentFileKey, currentFileLang, otherFileLang;
         var siblings = {};
         var langs = [];

         //Order files by siblings {lang: [stripped file url]}
         for (file in files) {
             fileLang = files[file].lang;
             if (fileLang === undefined) continue;
             if (langs.indexOf(fileLang) < 0) {
                 langs.push(fileLang);
             }
             if (siblings[fileLang] === undefined) {
                 siblings[fileLang] = [];
             }
             siblings[fileLang].push(helpers.stripLang(file, fileLang));
             files[file].translationPath = {};
         }

         //Add refrerences of matching files in different translation 'scopes':
         //file.translationPath.otherLang = "otherLang/filePath"
         //defaults to homepage in otherLang if no translation found || emptyRedirectPath
         for (var i=0; i<langs.length; i++) {
             currentFileLang = langs[i];
             for (var j=0; j<siblings[currentFileLang].length; j++) {
                 strippedFilePath = siblings[currentFileLang][j];
                 currentFileKey = (currentFileLang === baseLang) ? strippedFilePath : (currentFileLang + "/" + strippedFilePath);
                 for (var k=0; k<langs.length; k++) {
                     otherFileLang = langs[k];
                     files[currentFileKey].translationPath[otherFileLang] = (emptyRedirectPath === undefined) ? "/".concat(otherFileLang) : emptyRedirectPath;
                     if (currentFileLang === otherFileLang) continue;
                     if (siblings[otherFileLang].indexOf(strippedFilePath) >= 0) {
                         translationUrl = (otherFileLang === baseLang) ? "/".concat(strippedFilePath) : ("/".concat(otherFileLang, "/", strippedFilePath));
                         files[currentFileKey].translationPath[otherFileLang] = helpers.permalinkAwarePath(translationUrl, permalinksEnabled);
                     }
                 }
             }
         }

         return done();
     };
 }
