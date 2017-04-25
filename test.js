var assert = require("assert"),
	generate = require("bit-docs-generate-html/generate"),
	path = require("path");

var Browser = require("zombie"),
	express = require('express');

Browser.localhost('127.0.0.1', 8081);

var find = function(browser, property, callback, done){
	var start = new Date();
	var check = function(){
		if(browser.window && browser.window[property]) {
			callback(browser.window);
		} else if(new Date() - start < 2000){
			setTimeout(check, 20);
		} else {
			done(new Error("failed to find "+property));
		}
	};
	check();
};

var open = function (url, callback, done) {
	var server = express().use('/', express.static(__dirname + '/')).listen(8081);
	var browser = new Browser();
	browser.on('error', function(err) {
		console.log('ZOMBIE ERROR', err);
	})
	browser.visit(url)
		.then(function () {
			callback(browser, function () {
				server.close();
			});
		}).catch(function (e) {
			server.close();
			done(e)
		});
};

describe("generate", function () {

	it("temp", function (done) {
		this.timeout(40000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				body: "<div class='wrapper'></div>\n"
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"generate-temp": 'file:' + __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			debug: true,
			devBuild: false,
			parent: "index",
			forceBuild: true,
			minifyBuild: false
		}).then(function () {
      done();
		}, done);
	});

  it("test", function(done) {
		this.timeout(40000);

    open("temp/index.html", function (browser, close) {
      find(browser, 'PACKAGES', function () {
        browser.assert.success();
        browser.assert.element('section.body');

        var doc = browser.window.document;
        var wrapper = doc.getElementsByClassName("demo_wrapper");
        assert.equal(wrapper.length, 1, "Has window.document and .wrapper found");

        browser.assert.element('.demo');

        close();
        done();
      }, done);
    }, done);
  });

});
