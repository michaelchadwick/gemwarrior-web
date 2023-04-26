/* AVATAR */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

// shuttle avatar display workload to Web Worker
GemWarrior._initAvatarWorker = function() {
  if (window.Worker) {
    // Web Worker created from file
    GemWarrior.config.avatarWorker = new Worker('assets/js/app/worker.js')

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
                  GemWarrior._avatarStand()
                  break
                case 'sitting':
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
      GemWarrior._getAvatarDisplay(GemWarrior.config.player.status || 'standing')
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

GemWarrior._avatarStand = function() {
  clearTimeout(GemWarrior._sleepTimer)

  if (GemWarrior.config.player.status == 'sleeping') {
    GemWarrior._playBGM('main')
  } else {
    GemWarrior._playSFX('sfx-stand')
  }

  GemWarrior.config.player.status = 'standing'
  GemWarrior._getAvatarDisplay('standing')
  GemWarrior._avatarBlink()
}
GemWarrior._avatarSit = function() {
  clearTimeout(GemWarrior._sleepTimer)

  if (GemWarrior.config.player.status == 'sleeping') {
    GemWarrior._playBGM('main')
  } else {
    GemWarrior._playSFX('sfx-sit')
  }

  GemWarrior.config.player.status = 'sitting'
  GemWarrior._getAvatarDisplay('sitting')
  GemWarrior._avatarBlink()
}
GemWarrior._avatarSleep = function(init = null) {
  if (GemWarrior.config.player.status === 'sleeping') {
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
}
GemWarrior._avatarBlink = function() {
  clearInterval(GemWarrior.config.blinker)

  if (GemWarrior.config.player.status === 'standing') {
    GemWarrior.config.blinker = setInterval(() => {
      GemWarrior._getAvatarDisplay('standing-blink')
      setTimeout(() => GemWarrior._getAvatarDisplay('standing'), GemWarrior.__getAvatarBlinkSpeed())
    }, GemWarrior.__getAvatarBlinkFreq())
  }
  else if (GemWarrior.config.player.status === 'sitting') {
    GemWarrior.config.blinker = setInterval(() => {
      GemWarrior._getAvatarDisplay('sitting-blink')
      setTimeout(() => GemWarrior._getAvatarDisplay('sitting'), GemWarrior.__getAvatarBlinkSpeed())
    }, GemWarrior.__getAvatarBlinkFreq())
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