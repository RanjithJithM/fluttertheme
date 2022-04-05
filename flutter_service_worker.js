'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "65160b4d7db8700ef32d23c1163152ee",
"assets/assets/fonts/CaviarDreams.ttf": "fd2d0a4d699ed411275cb14ef35dec7d",
"assets/assets/fonts/KaushanScript.otf": "7a814d9d8801b9532895fd2e468e1a06",
"assets/assets/fonts/MontserratRegular.ttf": "e78f1d4557fab143f353931cd44b0dcf",
"assets/assets/fonts/MontserratSemiBold.ttf": "3e99c0b57ebd7ea207d8bd04cdcde86b",
"assets/assets/images/background1.jpg": "e5cf0c6bc840c338fecf5bec40164a8a",
"assets/assets/images/banner.png": "8e60e1ab736ba1f71e7c66a5c9227d77",
"assets/assets/images/banner2.png": "1c28db5babbae9961160bc46b1176f57",
"assets/assets/images/banner3.png": "fbbe18250d3e55490f02c7a7c1bfe036",
"assets/assets/images/banner4.png": "62875d2660f806c51addc057c7363d78",
"assets/assets/images/banner5.png": "9222311024f5850da5a735e8f95d4c11",
"assets/assets/images/contact.png": "4ab1891e4ac46bfb187a52357c4bf160",
"assets/assets/images/icons/facebook.png": "021ada146ffb7c1753557ff29618d04c",
"assets/assets/images/icons/instagram.png": "5c570427ee23f69853d28aec805eee79",
"assets/assets/images/icons/menu.png": "f44dbeb96afa3c161a513c5a054b781d",
"assets/assets/images/logo.png": "4eaf3a8a7312b4c756762e6a1f1cd12d",
"assets/assets/images/office.png": "1b5851e058b342ef51488500afd4cfee",
"assets/assets/images/profile.jpg": "dbfd82aeb8c0c4479a2dc4b6de4434c0",
"assets/assets/images/screenshot/screenshot1.png": "acbb52180d09ecf9c481427d98988a6d",
"assets/assets/images/screenshot/screenshot2.png": "fe365e05118dd4a7b6f4763855b23fe6",
"assets/assets/images/screenshot/screenshot3.png": "8a58e756241bfe46949278eb9926e7b0",
"assets/assets/images/screenshot/screenshot4.png": "c78c70aaf93317be1058fe124f6721d7",
"assets/assets/images/screenshot/screenshot5.png": "fe49c98d81567c99b6eeacc22fc53827",
"assets/assets/payments.html": "57241fd01e192839f70c569a6abc7e8e",
"assets/FontManifest.json": "2f062c3c657ddc7f4f4507fb69e2dffc",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "61bbbdb726f8e5845f77cbd4736aadd2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "a2c734346f48c4002cd44dcb1af7ee67",
"icons/Icon-192.png": "9376bf13036822d42384dc9a67db1fc8",
"icons/Icon-512.png": "83fec9135a9f0fabe03c0afc16ebfb1d",
"icons/Icon-maskable-192.png": "9376bf13036822d42384dc9a67db1fc8",
"icons/Icon-maskable-512.png": "83fec9135a9f0fabe03c0afc16ebfb1d",
"index.html": "9d1d6bb32b7c55bff1cf91ff2568b622",
"/": "9d1d6bb32b7c55bff1cf91ff2568b622",
"main.dart.js": "3fb795d85875bbde156da42592962352",
"manifest.json": "458cc332f8e612c7dc45bad3156fb132",
"version.json": "f6b7cba0d1ac73a8915464a83a4e2826"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
