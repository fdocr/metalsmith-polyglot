var expect = require('chai').expect;
var helpers = require('../lib/helpers.js');

describe('Polyglot', function() {
    describe('#stripLang', function() {
        it('should add filepaths for matching translated files', function() {
            var filePaths = [
                'es/post/blog-post/index.html',
                'fr/index.html',
                'post/blog-post/index.html'
            ];
            var languages = ['es', 'fr', 'en'];
            var expected = [
                'post/blog-post/index.html',
                'index.html',
                'post/blog-post/index.html'
            ];
            var results = [];

            for (var i=0; i<filePaths.length; i++) {
                results.push(helpers.stripLang(filePaths[i], languages[i]));
            }

            expect(results).to.deep.equal(expected);
        });
    });

    describe('#permalinkAwareUrl', function() {
        it('should clean filepaths if permalinks are enabled', function() {
            var filePaths = [
                'post/blog-post/index.html',
                '/',
                'post/blog-post/index.html',
                '/'
            ];
            var permalinksEnabled = [true, true, false, true];
            var expected = [
                'post/blog-post',
                '/',
                'post/blog-post/index.html',
                '/'
            ];
            var results = [];

            for (var i=0; i<filePaths.length; i++) {
                results.push(helpers.permalinkAwarePath(filePaths[i], permalinksEnabled[i]));
            }

            expect(results).to.deep.equal(expected);
        });
    });
});
