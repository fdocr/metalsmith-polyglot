/**
 * Helper functions, exported separately for test purposes
 */
var exports = module.exports = {};

/**
 * Strips the language prefix of Metalsmith's filepath
 *
 * @param {String} url
 * @param {String} lang
 * @return {String}
 */

exports.stripLang = function(filePath, lang) {
   if (filePath.substr(0, lang.length) === lang) {
       return filePath.substr(lang.length+1, filePath.length);
   }
   return filePath;
};

/**
* Makes output file paths 'permalink aware'
*
* @param {String} url
* @param {String} lang
* @return {String}
*/

exports.permalinkAwarePath = function(filePath, permalinks) {
   if (!permalinks) return filePath;

   var parts = filePath.split("/");
   var cleanUrl = "";
   for (var i=0; i<(parts.length-1); i++) {
       cleanUrl = cleanUrl.concat(parts[i], "/");
   }

   return (cleanUrl === "/") ? "/" : cleanUrl.substr(0, cleanUrl.length-1);
};
