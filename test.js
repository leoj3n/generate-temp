var path = require("path"),
	assert = require("assert"),
	Browser = require("zombie"),
	express = require('express'),
	generate = require("bit-docs-generate-html/generate");

Browser.localhost('*.example.com', 3003);

describe('example', function () {
	var server = express();
	var browser = new Browser();

	before(function () {
		return new Promise(function (resolve, reject) {
			server = server.use('/', express.static(__dirname)).listen(3003, resolve);
			server.on('error', reject);
		});
	});

	it('can be generated', function () {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				body: "<div class='wrapper'></div>\n"
			}
		});

		var siteConfig = {
			html: {
				dependencies: {
					"generate-temp": 'file://' + __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			debug: process.env.npm_config_debug,
			devBuild: process.env.npm_config_devBuild,
			parent: "index",
			forceBuild: true,
			minifyBuild: false
		};

		return generate(docMap, siteConfig);
	});

	describe('the generated page', function () {
		before(function () {
			return browser.visit('/temp/index.html');
		});

		it('should have content inserted', function () {
			browser.assert.success();
			browser.assert.element('section.body');

			var doc = browser.window.document;
			var wrapper = doc.getElementsByClassName("wrapper");
			assert.equal(wrapper.length, 1, "Has window.document and .wrapper found");

			browser.assert.element('.inserted');
		});
	});

	after(function () {
		browser.destroy();
		server.close();
	});
});