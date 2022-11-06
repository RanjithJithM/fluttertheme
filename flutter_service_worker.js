'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "842097f5cacadb18394e5e08790cd4af",
"assets/assets/doc/doc1.png": "ade8221dd9637b0cf1e4e750c63345e3",
"assets/assets/doc/doc2.png": "0d3b7661e9e0c8072ca1069e6ffd71ea",
"assets/assets/doc/doc3.png": "5e85de270872b5b55d1f02a2c4ff6e26",
"assets/assets/doc/doc4.png": "d0e87b45965a051210de4c65fe1267e7",
"assets/assets/doc/doc5.png": "0eab66be9fb8e501c35933e665301ab2",
"assets/assets/doc/doc6.png": "9481ea254df109448af5b9c9783fb0fd",
"assets/assets/doc/install1.png": "e236a99858a2322c9af470cb19044ba7",
"assets/assets/doc/install2.png": "3e7ad5c82c7823c3efa736a72fda5066",
"assets/assets/images/android.png": "9f870386503adae076d0cb210e7e6d1b",
"assets/assets/images/contact.png": "4ab1891e4ac46bfb187a52357c4bf160",
"assets/assets/images/doc.png": "7185451c841ff0783674593369207627",
"assets/assets/images/facebook.png": "021ada146ffb7c1753557ff29618d04c",
"assets/assets/images/instagram.png": "5c570427ee23f69853d28aec805eee79",
"assets/assets/images/logo.png": "4eaf3a8a7312b4c756762e6a1f1cd12d",
"assets/assets/images/menu.png": "f44dbeb96afa3c161a513c5a054b781d",
"assets/assets/images/office.png": "1b5851e058b342ef51488500afd4cfee",
"assets/assets/images/user.png": "6c25f23b6b0ef3a4c9acb7c49aeaf11e",
"assets/assets/purchase/admin.png": "db49cfd85cd2e58b0eb10b3852108c55",
"assets/assets/purchase/app.png": "2cb964bf864d4516c8f2a3e5b4ee613e",
"assets/assets/purchase/backend.png": "0d2829fd243001dc1f94d3269a827aae",
"assets/assets/purchase/domain.png": "eec19c11e77379b48240c342ce6a9f87",
"assets/assets/purchase/frontend.png": "eecadca1de10330fc34746ab68787ab2",
"assets/assets/purchase/hosting.png": "31a4ae0005c265fde836416ca82307be",
"assets/assets/purchase/installation.png": "c683d62ff61e034b2e5b412b2c1d1dbb",
"assets/assets/purchase/publish.png": "8918660a60951b408c51ed9f5e268778",
"assets/assets/purchase/website.png": "1c2bfd52db2bae360d56866214138732",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "eef5ccc99fe3ad8c0a7b2bebfb4cfa46",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/payments.html": "57241fd01e192839f70c569a6abc7e8e",
"assets/shaders/ink_sparkle.frag": "feb251a6c91ac50d62fd1d527ce4721a",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "a2c734346f48c4002cd44dcb1af7ee67",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-192.png": "9376bf13036822d42384dc9a67db1fc8",
"icons/Icon-512.png": "83fec9135a9f0fabe03c0afc16ebfb1d",
"icons/Icon-maskable-192.png": "9376bf13036822d42384dc9a67db1fc8",
"icons/Icon-maskable-512.png": "83fec9135a9f0fabe03c0afc16ebfb1d",
"index.html": "162847e0728c2722e08f932d76080e7d",
"/": "162847e0728c2722e08f932d76080e7d",
"main.dart.js": "46cd5c5ab6bbcb96a147523211b478b9",
"manifest.json": "458cc332f8e612c7dc45bad3156fb132",
"version.json": "f6b7cba0d1ac73a8915464a83a4e2826"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
