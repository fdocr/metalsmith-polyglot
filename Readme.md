# metalsmith-polyglot ![version](https://img.shields.io/badge/version-0.3.2-blue.svg)

  A Metalsmith plugin that creates relative paths metadata for files in a website using `lang/path` as a convention for translated files in your domain (the base language lang code is omitted). This means no need of javscript or complicated definitions for translating.

## Installation

    $ npm install metalsmith-polyglot

## Usage

  This plugin is intented for projects that use an output hierarchy that mirrors your base language content with a `root based` and `language-code` ordered translations (supports [permalinks](https://github.com/segmentio/metalsmith-permalinks) by default). It is required to tag your files' language code using front matter `lang: es`.

  The following is an example structure for a translated website:

```
src/
    content/
        index.html
        post/
            first-post/
                index.html
            second-post/
                index.html
    es/
        index.html
        post/
            first-post/
                index.html
            second-post/
                index.html
```

  The polyglot plugin will parse the structure and filenames that match and output a translation path on to the metadata, available for templates to use for each language as in `translationPath.es` or `translationPath.en` for every file. In the following example, a root `index.html` homepage is generated and permalinks are filtered to work with the contents only (using the [metalsmith-branch](https://github.com/ericgj/metalsmith-branch) plugin).

  Note that the root homepage is also translated. Using the front matter `lang` tag will tell polyglot to search for matches and generate translationPath metadata available at template time.

```js
var Metalsmith = require('metalsmith'),
    permalinks = require('metalsmith-permalinks'),
    branch = require('metalsmith-branch'),
    polyglot = require('metalsmith-polyglot'),
    layouts = require('metalsmith-layouts');

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

* **baseLang**
  * Type: String
  * Description: The base language of the project. Defaults to "en".

* **permalinksEnabled**
  * Type: Boolean
  * Description: Indicates whether permalinks are used or not. Defaults to true.

* **emptyRedirect**
  * Type: String
  * Description: When working on a project and a file is not translated, send a specific url path to redirect every translation path. Defaults to the root url of the wanted language "/langCode" ("/" for base language missing path).

## License

  MIT
