/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-b1bafff1'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "93999195931854a5eb512e9a289cf391"
  }, {
    "url": "pwa-512x512.png",
    "revision": "9b5867a580507bc9843893fb0e720a32"
  }, {
    "url": "pwa-192x192.png",
    "revision": "b5f90b6ddd4eacf62f8f1f758a0a0074"
  }, {
    "url": "logo.png",
    "revision": "adef82a1f47a1ea393e683eba461503b"
  }, {
    "url": "logo.jpg",
    "revision": "2dc1d31eada272c55bbfd1febadbb758"
  }, {
    "url": "index.html",
    "revision": "e514e83009135c850f96ab072b4aa71a"
  }, {
    "url": "icon.svg",
    "revision": "f7223aade1a49bb1ab9bcc794d747b25"
  }, {
    "url": "favicon.ico",
    "revision": "213c690b49ad197be4c7cbfb2a2a69a8"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "b1da86adc968c3f048acfbf54cdb472e"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/sealed_happiness_box_1794768643734-FMcjFq95.jpg",
    "revision": null
  }, {
    "url": "assets/opened_happiness_box_1794768644943-BA832AjR.jpg",
    "revision": null
  }, {
    "url": "assets/index-CqD5d2hQ.css",
    "revision": null
  }, {
    "url": "assets/index-Cchmxa22.js",
    "revision": null
  }, {
    "url": "assets/aistudio/Screenshot_20261116-083349_Chrome_2fb9fcd6.jpg",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "b1da86adc968c3f048acfbf54cdb472e"
  }, {
    "url": "favicon.ico",
    "revision": "213c690b49ad197be4c7cbfb2a2a69a8"
  }, {
    "url": "icon.svg",
    "revision": "f7223aade1a49bb1ab9bcc794d747b25"
  }, {
    "url": "logo.jpg",
    "revision": "2dc1d31eada272c55bbfd1febadbb758"
  }, {
    "url": "logo.png",
    "revision": "adef82a1f47a1ea393e683eba461503b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "b5f90b6ddd4eacf62f8f1f758a0a0074"
  }, {
    "url": "pwa-512x512.png",
    "revision": "9b5867a580507bc9843893fb0e720a32"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "93999195931854a5eb512e9a289cf391"
  }, {
    "url": "manifest.webmanifest",
    "revision": "8c467b7c01ed6e2331dea61d09a76f56"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/^\/api\//, /^\/__\//]
  }));
  workbox.registerRoute(/^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "rt-google-fonts",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 20,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/\.(?:png|jpg|jpeg|svg|webp|ico)$/i, new workbox.StaleWhileRevalidate({
    "cacheName": "rt-static-images",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');

}));
