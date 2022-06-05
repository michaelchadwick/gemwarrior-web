/* avatar */
/* js worker for avatar display */

const GW_CACHE_TEXT_KEY = 'gemwarrior-cache-text'
const GW_ASSET_DATA_PATH = '/assets/data/avatar'

// Try to get data from the cache, but fall back to fetching it live.
async function getData(cacheName, url) {
  let cachedData = await this.getCachedData(cacheName, url);

  if (cachedData) {
    // console.log('Cache full:', cachedData);

    return cachedData;
  }

  // console.log(`Cache empty: fetching fresh data for ${url}`);

  const cacheStorage = await caches.open(cacheName);
  await cacheStorage.add(url);
  cachedData = await this.getCachedData(cacheName, url);
  await this.deleteOldCaches(cacheName);

  return cachedData;
}

// Get data from the cache.
async function getCachedData(cacheName, url) {
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return cachedResponse;
}

// Delete any old caches to respect user's disk space.
async function deleteOldCaches(currentCache) {
  const keys = await caches.keys();

  for (const key of keys) {
    const isOurCache = GW_CACHE_TEXT_KEY;

    if (currentCache === key || !isOurCache) {
      continue;
    }

    caches.delete(key);
  }
}

// use CacheStorage to check cache
async function useCache(url) {
  try {
    // console.log(`Cache Request: '${url}'`)

    const cacheResponse = await this.getData(GW_CACHE_TEXT_KEY, url)
    const textBuffer = await cacheResponse.text()

    postMessage(textBuffer)
  } catch (error) {
    console.error('CacheStorage error', error)
  }
}

// use direct fetch(url)
async function useFetch(url) {
  const statusText = await fetch(url)
    .then(response => response.text())

  postMessage(statusText)
}

async function initData() {
  const path = GW_ASSET_DATA_PATH

  await caches.open(GW_CACHE_TEXT_KEY).then(cache => {
    cache.keys().then(function(keys) {
      if (!keys.length) {
        // console.info(`${GW_CACHE_TEXT_KEY} is empty. Adding files to it...`)

        cache.addAll([
          `${path}/player-standing.txt`,
          `${path}/player-standing-blink.txt`,
          `${path}/player-sitting.txt`,
          `${path}/player-sitting-blink.txt`,
          `${path}/player-reclining1.txt`,
          `${path}/player-reclining2.txt`,
          `${path}/player-reclining3.txt`
        ])
      } else {
        // console.info(`${GW_CACHE_TEXT_KEY} is full, so need to initialize.`)
      }
    })
  })
}

onmessage = function(msg) {
  // console.log('received msg from main js', msg.data)

  if (msg.isTrusted) {
    if (msg.data.command == 'init') {
      this.initData()
    } else {
      const path = GW_ASSET_DATA_PATH
      const format = 'txt'
      const url = `${path}/player-${msg.data.value}.${format}`

      if ('caches' in self) {
        this.useCache(url)
      } else {
        this.useFetch(url)
      }
    }
  } else {
    console.error('untrusted message posted to Web Worker!', msg)
  }
}
