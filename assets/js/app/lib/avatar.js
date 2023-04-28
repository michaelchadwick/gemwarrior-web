/* AVATAR */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

// shuttle avatar display workload to Web Worker
GemWarrior._initAvatarWorker = function() {
  if (window.Worker) {
    // Web Worker created from file
    GemWarrior.config.avatarWorker = new Worker(GW_WORKER_JS_URL)

    if (GemWarrior.config.avatarWorker) {
      // console.log('Worker(): avatarWorker created successfully')

      // attach event listener to process successful Web Worker responses
      GemWarrior.config.avatarWorker.onmessage = (response) => {
        // console.log('response from web-worker:', response)

        const cmd = response.data.command
        const val = response.data.value

        if (cmd) {
          switch (cmd) {
            case 'data':
              GemWarrior.dom.avatar.html(val)
              break

            case 'status':
              switch (val) {
                case 'standing':
                  GemWarrior._avatarStand({ sound: true })
                  break
                case 'standing-quiet':
                  GemWarrior._avatarStand()
                  break
                case 'sitting':
                  GemWarrior._avatarSit({ sound: true })
                  break
                case 'sitting-quiet':
                  GemWarrior._avatarSit()
                  break
              }
              break
          }
        }
      }

      // initialize data into CacheStorage, if needed
      GemWarrior.config.avatarWorker.postMessage({ command: 'init' })

      // get initial player avatar display
      if (GemWarrior.world) {
        GemWarrior._getAvatarDisplay(GemWarrior.world.player.status)
      } else {
        GemWarrior._getAvatarDisplay('standing')
      }
    } else {
      console.error('Worker(): creation of Web Worker failed')
    }
  } else {
    console.error('Worker(): not supported by browser')
  }
}

GemWarrior._getAvatarDisplay = function(type) {
  // is this setting enabled?
  if (GemWarrior.settings.showAvatar) {
    // do we have a valid Web Worker?
    if (GemWarrior.config.avatarWorker) {
      // tell Web Worker which data we want via status key
      GemWarrior.config.avatarWorker.postMessage({ command: 'status', value: type })
    } else {
      console.error('web-worker: no valid Web Worker to postMessage')
    }
  }
}

GemWarrior._avatarStand = function(options = null) {
  clearTimeout(GemWarrior._sleepTimer)

  if (GemWarrior.world) {
    if (GemWarrior.world.player.status == 'sleeping') {
      if (options && options.sound) {
        GemWarrior._playBGM('main')
      }
    } else {
      if (options && options.sound) {
        GemWarrior._playSFX('sfx-stand')
      }
    }

    GemWarrior.world.player.status = 'standing'
    GemWarrior._getAvatarDisplay('standing')
    GemWarrior._avatarBlink()
  }
}
GemWarrior._avatarSit = function(options = null) {
  clearTimeout(GemWarrior._sleepTimer)

  if (GemWarrior.world) {
    if (GemWarrior.world.player.status == 'sleeping') {
      if (options && options.sound) {
        GemWarrior._playBGM('main')
      }
    } else {
      if (options && options.sound) {
        GemWarrior._playSFX('sfx-sit')
      }
    }

    GemWarrior.world.player.status = 'sitting'
    GemWarrior._getAvatarDisplay('sitting')
    GemWarrior._avatarBlink()
  }
}
GemWarrior._avatarSleep = function(init = null) {
  if (GemWarrior.world) {
    if (GemWarrior.world.player.status === 'sleeping') {
      if (init) {
        GemWarrior._playBGM('sleep')

        clearInterval(GemWarrior.config.blinker)
      }

      GemWarrior._getAvatarDisplay('sleeping1')

      // set up a loop of loading different status text files
      GemWarrior._sleepTimer = setTimeout(() => {
        GemWarrior._getAvatarDisplay('sleeping2')

        GemWarrior._sleepTimer = setTimeout(() => {
          GemWarrior._getAvatarDisplay('sleeping3')

          GemWarrior._sleepTimer = setTimeout(() => {
            GemWarrior._avatarSleep()
          }, 1000)
        }, 1000)
      }, 1000)
    }

    GemWarrior.world.player.status = 'sitting'
    GemWarrior._getAvatarDisplay('sitting')
    GemWarrior._avatarBlink()
  }
}
GemWarrior._avatarBlink = function() {
  clearInterval(GemWarrior.config.blinker)

  if (GemWarrior.world) {
    if (GemWarrior.world.player.status === 'standing') {
      GemWarrior.config.blinker = setInterval(() => {
        GemWarrior._getAvatarDisplay('standing-blink')
        setTimeout(() => GemWarrior._getAvatarDisplay('standing'), GemWarrior.__getAvatarBlinkSpeed())
      }, GemWarrior.__getAvatarBlinkFreq())
    }
    else if (GemWarrior.world.player.status === 'sitting') {
      GemWarrior.config.blinker = setInterval(() => {
        GemWarrior._getAvatarDisplay('sitting-blink')
        setTimeout(() => GemWarrior._getAvatarDisplay('sitting'), GemWarrior.__getAvatarBlinkSpeed())
      }, GemWarrior.__getAvatarBlinkFreq())
    }
  }
}

GemWarrior._destroyAvatarDisplay = function() {
  if (window.Worker) {
    // console.log('destroying web-worker for avatar')

    GemWarrior.config.avatarWorker.postMessage({ command: 'destroy'})

    GemWarrior.config.avatarWorker = null

    GemWarrior.dom.avatar.html('')
  } else {
    console.error('could not destroy avatar', error)
  }
}

GemWarrior.__getAvatarBlinkFreq = function() {
  var min = 2000
  var max = 20000

  return Math.floor(Math.random() * (max - min + 1) + min)
}
GemWarrior.__getAvatarBlinkSpeed = function() {
  var min = 100
  var max = 600

  return Math.floor(Math.random() * (max - min + 1) + min)
}
