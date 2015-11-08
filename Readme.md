# metalsmith-polyglot

  A Metalsmith plugin that creates translation paths for files in a website using the convention for relative paths `lang/path` with the exception of the base language that is omitted.

## Installation

    $ npm install metalsmith-polyglot

## Usage

  This plugin is intented for projects that use an output hierarchy that mirrors your base language content with a `root based` and `language-code` ordered translations (supports permalinks by default). It is required to tag your files' language code using front matter Ex:

```
src/
    content/
        index.html
        post/
            first-post/
                index.html
            second-post/index.html
    es/
        index.html
        post/
            first-post/
                index.html
            second-post/index.html
```

  The polyglot plugin will parse the structure and filenames that match and output a translation path on to the metadata, available for templates to use for each language as in `translationPath.es` or `translationPath.en` for every file.

```js
var Metalsmith = require('metalsmith');
var permalinks = require('metalsmith-permalinks');
var polyglot = require('metalsmith-polyglot');

var metalsmith = new Metalsmith(__dirname)
    .use(branch('content/post/**.html')
        .use(permalinks({
            pattern: 'post/:title'
        }))
    )
    .use(branch('es/post/**.html')
        .use(permalinks({
            pattern: 'es/post/:title'
        }))
    )
    .use(polyglot())
    .use(layouts({
        engine: 'jade'
    }))
    .build(function(err) {
        if (err) {
            console.log(err);
        }
    });
```

The template snippet might look something like this (of course, more elaborated design and mobile friendly support would be implemented for a real website).

```jade
a(href="#{translationPath.es}") SPANISH
a(href="#{translationPath.fr}") FRENCH
```

#### Options

  **baseLang:** The base language of the project. Defaults to "en".

  **permalinksEnabled:** Boolean variable to indicate whether permalinks are used or not. Defaults to **true**.

  **emptyRedirect:** When working on a project and a file is not translated, send a specific url path to redirect every translation path. Defaults to the base language root url "/".

## License

  MIT
