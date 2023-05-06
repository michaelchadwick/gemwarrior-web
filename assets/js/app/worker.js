/* /assets/js/app/worker.js */
/* js background worker for avatar display */

const GW_CACHE_TEXT_KEY = 'gemwarrior-cache-text'
const GW_ASSET_DATA_PATH = '/assets/data/avatar'

// Try to get data from the cache, but fall back to fetching it live.
async function getData(cacheName, url) {
  let cachedData = await this.getCachedData(cacheName, url)

  if (cachedData) {
    // console.log('Cache full:', cachedData)

    return cachedData
  }

  // console.log(`Cache empty: fetching fresh data for ${url}`)

  const cacheStorage = await caches.open(cacheName)
  await cacheStorage.add(url)
  cachedData = await this.getCachedData(cacheName, url)

  // await this.deleteCache(cacheName)

  return cachedData
}

// Get data from the cache.
async function getCachedData(cacheName, url) {
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(url)

  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }

  return cachedResponse
}

// Delete cache when unused to respect user's disk space
async function deleteCache(cacheName) {
  // console.log(`web worker: deleting ${cacheName} cache...`)

  const keys = await caches.keys()

  for (const key of keys) {

    if (cacheName !== key) {
      continue
    } else {
      caches.delete(key)
    }
  }
}

// use CacheStorage to check cache
async function useCache(url) {
  try {
    // console.log(`web-worker: Cache Request: '${url}'`)

    const cacheResponse = await this.getData(GW_CACHE_TEXT_KEY, url)
    const textBuffer = await cacheResponse.text()

    postMessage({ command: 'data', value: textBuffer })
  } catch (error) {
    console.error('web-worker: CacheStorage error', error)
  }
}

// use direct fetch(url)
async function useFetch(url) {
  // console.log(`web-worker: Fetch Request: '${url}'`)

  const statusText = await fetch(url)
    .then(response => response.text())

  postMessage({ command: 'data', value: statusText })
}

async function initData() {
  await caches.open(GW_CACHE_TEXT_KEY).then(async cache => {
    await cache.keys().then(async function(keys) {
      if (!keys.length) {
        // console.log(`web-worker: ${GW_CACHE_TEXT_KEY} is non-existing or empty. Adding files to it...`)

        await cache.addAll([
          `${GW_ASSET_DATA_PATH}/player-standing.txt`,
          `${GW_ASSET_DATA_PATH}/player-standing-blink.txt`,
          `${GW_ASSET_DATA_PATH}/player-sitting.txt`,
          `${GW_ASSET_DATA_PATH}/player-sitting-blink.txt`,
          `${GW_ASSET_DATA_PATH}/player-sleeping1.txt`,
          `${GW_ASSET_DATA_PATH}/player-sleeping2.txt`,
          `${GW_ASSET_DATA_PATH}/player-sleeping3.txt`
        ])

        // console.log(`web-worker: Added files to ${GW_CACHE_TEXT_KEY} cache`)
      } else {
        // console.log(`web-worker: ${GW_CACHE_TEXT_KEY} is full, so no need to initialize.`)
      }
    })
  })

  postMessage({ command: 'status', value: 'standing-quiet' })

  console.log('[LOADED] /app/worker')
}

function changeStatus(val) {
  const path = GW_ASSET_DATA_PATH
  const format = 'txt'
  const url = `${path}/player-${val}.${format}`

  if ('caches' in self) {
    this.useCache(url)
  } else {
    this.useFetch(url)
  }
}

onmessage = function(msg) {
  // console.log('web-worker: received msg from main js', msg.data)

  const cmd = msg.data.command
  const val = msg.data.value

  if (msg.isTrusted) {
    if (cmd == 'init') {
      this.initData()
    } else if (cmd == 'destroy') {
      this.deleteCache(GW_CACHE_TEXT_KEY)
    } else {
      changeStatus(val)
    }
  } else {
    console.error('web-worker: untrusted message posted to Web Worker!', msg)
  }
}
