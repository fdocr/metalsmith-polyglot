function stripLang(url, lang) {
    if (url.substr(0, lang.length) === lang) {
        return url.substr(lang.length+1, url.length);
    }
    return url;
}

function permalinkAwareUrl(url, permalinks) {
    if (!permalinks) return url;

    var parts = url.split("/");
    var cleanUrl = "";
    for (var i=0; i<(parts.length-1); i++) {
        cleanUrl = cleanUrl.concat(parts[i], "/");
    }

    return (cleanUrl === "") ? "/" : cleanUrl.substr(0, cleanUrl.length-1);
}

module.exports = function(options) {
    if (options == null) {
        options = {};
    }
    var baseLang = options.baseLang || "en";
    var permalinksEnabled = options.permalinks || true;
    var emptyRedirect = options.emptyTranslationPath;

    return function (files, metalsmith, done) {
        var file, fileLang, translationUrl, strippedUrl, currentFileKey, currentFileLang, otherFileLang;
        var siblings = {};
        var langs = [];

        //Order files by siblings {lang: [stripped file url]}
        for (file in files) {
            fileLang = files[file].lang;
            if (fileLang === undefined) continue;
            if (langs.indexOf(fileLang) === -1) {
                langs.push(fileLang);
            }
            if (siblings[fileLang] === undefined) {
                siblings[fileLang] = [];
            }
            siblings[fileLang].push(stripLang(file, fileLang));
            files[file].translationPath = {};
        }

        //Any matching translations add them to:
        //file.translation-path.otherLang = "otherLang/filePath"
        //defaults to homepage translated to otherLang if no translation found
        for (var i=0; i<langs.length; i++) {
            currentFileLang = langs[i];
            for (var j=0; j<siblings[currentFileLang].length; j++) {
                strippedUrl = siblings[currentFileLang][j];
                currentFileKey = (currentFileLang === baseLang) ? strippedUrl : (currentFileLang + "/" + strippedUrl);
                for (var k=0; k<langs.length; k++) {
                    otherFileLang = langs[k];
                    files[currentFileKey].translationPath[otherFileLang] = (emptyRedirect === undefined) ? "/".concat(otherFileLang) : emptyRedirect;
                    if (currentFileLang === otherFileLang) continue;
                    if (siblings[otherFileLang].indexOf(strippedUrl) >= 0) {
                        translationUrl = (otherFileLang === baseLang) ? strippedUrl : (otherFileLang + "/" + strippedUrl);
                        files[currentFileKey].translationPath[otherFileLang] = permalinkAwareUrl(translationUrl, permalinksEnabled);
                    }
                }
            }
        }

        return done();
    };
};
