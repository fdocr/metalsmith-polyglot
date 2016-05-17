.PHONY: test

mocha=node_modules/.bin/mocha

ifeq ("$(MOCHA_FILE)","/opt/results/test-results.xml")
  options=--reporter mocha-junit-reporter
endif

node_modules: package.json
	@npm install

test: node_modules
	$(mocha) $(options)
