# generate-temp

This generates the `temp` folder in test one, and tries to open that generated `temp/index.html` in test two.

To get started, first run `npm install`. To run the tests which will generate `temp`, do `npm test`.

## Issues

### Zombie issue

Related to issue: https://github.com/stealjs/steal/issues/1177

After running `npm test`, note that the second test in `test.js` cannot find `window.PACKAGES` because steal is not working under zombie.

However, if you do `http-server` and visit <http://127.0.0.1:8080/temp/>, you will see everything works fine under a normal browser.

You might want to `it.only` the second test once you have `temp` generated (perhaps with `devBuild`) if you plan on editing anything in `temp` so changes don't get overriden.

For instance, in relation to the `devBuild` issue (below), you might want to manually fix the location in `temp/index.html` to point to `./static/node_modules/steal/steal.js`.

### devBuild issue

Related to issue: https://github.com/bit-docs/bit-docs-generate-html/issues/26

Another issue was recently discovered, and it has to do with `bit-docs-generate-html`:

In the first test that generates `temp`, there is an option `devBuild` that is currently set to `false`.

If you change this to `true`, then the generated output in `temp/index.html` should change in the following way:

https://github.com/bit-docs/bit-docs-generate-html/blob/minor/site/default/templates/layout.mustache

However, for some reason it does not, and effectively `{{devBuild}}` is evaluating to false in this mustache template.

So, if you change `devBuild` to true and run `npm test`, the steal dependencies will not be compressed into `./static/steal.production.js` (as expected), but the `index.html` will still be pointing there (not expected), and will not find anything (404 on trying to load steal).

## About the dependencies

See `package.json` that the latest npm versions of all dependencies are being used, including a pre-release of `bit-docs-generate-html`.

This `0.5.0-pre.4` pre-release updates `bit-docs-generate-html` to use steal `1.X` and updates the location it references `steal.production.js` in the above mentioned `site/default/templates/layout.mustache` because the newer version of steal puts it in a different location when bundling comapred to the old location of `./static/node_modules/steal/steal.production.js`.

## Output examples

### Using production steal

Without modifying anything, in a freshly cloned copy of this repo:

```
❯ npm i && npm test

> fsevents@1.1.1 install /Users/leoj/tmp/generate-temp/node_modules/fsevents
> node install

[fsevents] Success: "/Users/leoj/tmp/generate-temp/node_modules/fsevents/lib/binding/Release/node-v48-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile

> steal-tools@1.3.1 postinstall /Users/leoj/tmp/generate-temp/node_modules/steal-tools
> install-engine-dependencies

generate-temp@1.0.0 /Users/leoj/tmp/generate-temp
├─┬ bit-docs-generate-html@0.5.0-pre.4
│ ├─┬ enpeem@2.2.0
│ │ └─┬ stream-reduce@1.0.3
│ │   └── through@2.3.8
│ ├── escape-html@1.0.3
│ ├─┬ fs-extra@0.30.0

[...]

npm info ok
BUILD: Getting build module
OPENING: bit-docs-site/static
Transpiling...
Calculating main bundle(s)...
Flattening main bundle(s)...
BUNDLE: bit-docs-site/static.js
+ [system-bundles-config]
+ npm-utils
+ npm-extension
+ npm-load
+ semver
+ npm-crawl
+ npm-convert
+ npm
+ package.json!npm
+ generate-temp@1.0.0#temp_req
+ generate-temp@1.0.0#temp
+ bit-docs-site@0.0.1#packages
+ steal-css@1.2.3#css
+ @node-require/steal-less@1.2.0#less-engine-node
+ steal-less@1.2.0#less-engine-node
+ steal-less@1.2.0#less
+ bit-docs-site@0.0.1#static
BUNDLE: bit-docs-site/static.css
+ bit-docs-site@0.0.1#styles/styles.less!steal-less@1.2.0#less
BUILD: Copying build to dist.
BUILD: Copying production files to temp/static
    ✓ temp (12954ms)
TypeError: Cannot read property 'indexOf' of undefined
    at Attr.<anonymous> (http://127.0.0.1/temp/static/steal.production.js:13:9554)
    at c (http://127.0.0.1/temp/static/steal.production.js:12:25354)
    at P (http://127.0.0.1/temp/static/steal.production.js:13:9505)
    at http://127.0.0.1/temp/static/steal.production.js:13:9903
    at c (http://127.0.0.1/temp/static/steal.production.js:11:4415)
    at new b (http://127.0.0.1/temp/static/steal.production.js:11:4301)
    at Q (http://127.0.0.1/temp/static/steal.production.js:13:9760)
    at Function.z.startup (http://127.0.0.1/temp/static/steal.production.js:13:10114)
    at http://127.0.0.1/temp/static/steal.production.js:13:11306
    at http://127.0.0.1/temp/static/steal.production.js:13:11581 'TypeError: Cannot read property \'indexOf\' of undefined\n    at Attr.<anonymous> (http://127.0.0.1/temp/static/steal.production.js:13:9554)\n    at c (http://127.0.0.1/temp/static/steal.production.js:12:25354)\n    at P (http://127.0.0.1/temp/static/steal.production.js:13:9505)\n    at http://127.0.0.1/temp/static/steal.production.js:13:9903\n    at c (http://127.0.0.1/temp/static/steal.production.js:11:4415)\n    at new b (http://127.0.0.1/temp/static/steal.production.js:11:4301)\n    at Q (http://127.0.0.1/temp/static/steal.production.js:13:9760)\n    at Function.z.startup (http://127.0.0.1/temp/static/steal.production.js:13:10114)\n    at http://127.0.0.1/temp/static/steal.production.js:13:11306\n    at http://127.0.0.1/temp/static/steal.production.js:13:11581'
    1) test


  1 passing (15s)
  1 failing

  1) generate test:
     Error: failed to find PACKAGES
      at Timeout.check [as _onTimeout] (test.js:18:9)



npm ERR! Test failed.  See above for more details.
```

### Using `devBuild` and manually fixing path

Using `npm test` to generate with `devBuild` set to `true`, editing `temp/index.html` to point to `./static/node_modules/steal/steal.js`, adding `it.only` to second test, then re-running `npm test`:

```
> generate-temp@1.0.0 test /Users/leoj/bitovi/,+/bd/1/generate-temp
> mocha test.js --reporter spec



  generate
TypeError: Cannot read property 'indexOf' of undefined
    at Attr.<anonymous> (http://127.0.0.1/temp/static/node_modules/steal/steal.js:6980:28)
    at each (http://127.0.0.1/temp/static/node_modules/steal/steal.js:5587:9)
    at getScriptOptions (http://127.0.0.1/temp/static/node_modules/steal/steal.js:6977:3)
    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7014:14
    at init (http://127.0.0.1/temp/static/node_modules/steal/steal.js:377:5)
    at new Promise (http://127.0.0.1/temp/static/node_modules/steal/steal.js:365:53)
    at getUrlOptions (http://127.0.0.1/temp/static/node_modules/steal/steal.js:7002:10)
    at Function.steal.startup (http://127.0.0.1/temp/static/node_modules/steal/steal.js:7047:16)
    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7187:16
    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7199:3 'TypeError: Cannot read property \'indexOf\' of undefined\n    at Attr.<anonymous> (http://127.0.0.1/temp/static/node_modules/steal/steal.js:6980:28)\n    at each (http://127.0.0.1/temp/static/node_modules/steal/steal.js:5587:9)\n    at getScriptOptions (http://127.0.0.1/temp/static/node_modules/steal/steal.js:6977:3)\n    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7014:14\n    at init (http://127.0.0.1/temp/static/node_modules/steal/steal.js:377:5)\n    at new Promise (http://127.0.0.1/temp/static/node_modules/steal/steal.js:365:53)\n    at getUrlOptions (http://127.0.0.1/temp/static/node_modules/steal/steal.js:7002:10)\n    at Function.steal.startup (http://127.0.0.1/temp/static/node_modules/steal/steal.js:7047:16)\n    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7187:16\n    at http://127.0.0.1/temp/static/node_modules/steal/steal.js:7199:3'
    1) test


  0 passing (2s)
  1 failing

  1) generate test:
     Error: failed to find PACKAGES
      at Timeout.check [as _onTimeout] (test.js:18:9)



npm ERR! Test failed.  See above for more details.
```

### Modifying `temp/static/node_modules/steal/steal.js`

Modifying the `steal.js` a bit:

```diff
--- steal-orig.js	2017-04-24 21:26:26.000000000 -0500
+++ steal.js	2017-04-24 21:27:24.000000000 -0500
@@ -6975,11 +6975,12 @@
 		scriptOptions.stealURL = script.src;
 
 		each(script.attributes, function(attr){
+			var name = attr.name || attr.nodeName;
 			// get option, remove "data" and camelize
 			var optionName =
-				camelize( attr.nodeName.indexOf("data-") === 0 ?
-					attr.nodeName.replace("data-","") :
-					attr.nodeName );
+				camelize( name.indexOf("data-") === 0 ?
+					name.replace("data-","") :
+					name.nodeName );
 			// make options uniform e.g. baseUrl => baseURL
 			optionName = optionName.replace(urlRegEx, "URL")
 			scriptOptions[optionName] = (attr.value === "") ? true : attr.value;
```

After following the same steps from the previous section "Using `devBuild` and manually fixing path" results in slightly different error:

```
❯ npm test

> generate-temp@1.0.0 test /Users/leoj/bitovi/,+/bd/1/generate-temp
> mocha test.js --reporter spec



  generate
{ Error: Error loading "package.json!npm" at <unknown>
Error loading "npm" at http://127.0.0.1/temp/static/static/node_modules/steal/ext/npm.js
Not Found: http://127.0.0.1/temp/static/static/node_modules/steal/ext/npm.js
    at error (http://127.0.0.1/temp/static/node_modules/steal/steal.js:3069:19)
    at XMLHttpRequest.xhr.onreadystatechange (http://127.0.0.1/temp/static/node_modules/steal/steal.js:3079:13)
    at XMLHttpRequest.callback.(anonymous function) (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:230:32)
    at invokeEventListeners (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:195:25)
    at invokeInlineListeners (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:163:7)
    at EventTargetImpl._dispatch (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:122:7)
    at EventTargetImpl.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:87:17)
    at XMLHttpRequest.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:60:35)
    at XMLHttpRequest.DOM.EventTarget.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/zombie/lib/dom/jsdom_patches.js:182:31)
    at XMLHttpRequest._fire (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/zombie/lib/xhr.js:248:12) statusCode: 404 } 'Error: Error loading "package.json!npm" at <unknown>\nError loading "npm" at http://127.0.0.1/temp/static/static/node_modules/steal/ext/npm.js\nNot Found: http://127.0.0.1/temp/static/static/node_modules/steal/ext/npm.js\n    at error (http://127.0.0.1/temp/static/node_modules/steal/steal.js:3069:19)\n    at XMLHttpRequest.xhr.onreadystatechange (http://127.0.0.1/temp/static/node_modules/steal/steal.js:3079:13)\n    at XMLHttpRequest.callback.(anonymous function) (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:230:32)\n    at invokeEventListeners (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:195:25)\n    at invokeInlineListeners (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:163:7)\n    at EventTargetImpl._dispatch (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:122:7)\n    at EventTargetImpl.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:87:17)\n    at XMLHttpRequest.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:60:35)\n    at XMLHttpRequest.DOM.EventTarget.dispatchEvent (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/zombie/lib/dom/jsdom_patches.js:182:31)\n    at XMLHttpRequest._fire (/Users/leoj/bitovi/,+/bd/1/generate-temp/node_modules/zombie/lib/xhr.js:248:12)'
    1) test


  0 passing (2s)
  1 failing

  1) generate test:
     Error: failed to find PACKAGES
      at Timeout.check [as _onTimeout] (test.js:18:9)



npm ERR! Test failed.  See above for more details.
```
