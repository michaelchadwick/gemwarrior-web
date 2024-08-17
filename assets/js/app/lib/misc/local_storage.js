/* /assets/js/app/lib/localStorage.js */
/* functions to interact with window.localStorage */
/* global GemWarrior */

// load entire GemWarrior world into existence
GemWarrior._loadWorld = async function () {
  // console.log('[INITIALIZING] /app/world')

  const lsWorld = localStorage.getItem(GW_WORLD_LS_KEY)

  if (lsWorld) {
    // console.log('Saved world data found. Loading...')

    const lsWorldObj = JSON.parse(lsWorld)

    GemWarrior.world = new World(lsWorldObj)

    console.log('[LOADED] /app/world(saved)')
  } else {
    // console.log('No saved world data found. Loading default world...')

    const defaultWorld = await fetch(GW_WORLD_IHOT_JSON_URL)

    if (defaultWorld) {
      const defaultWorldObj = await defaultWorld.json()

      if (defaultWorldObj) {
        GemWarrior.world = new World(defaultWorldObj)

        // create name for player inside world
        const ng = new NameGenerator('fantasy')
        const ng_name_set = await ng.get_name_set()

        if (ng_name_set) {
          const ng_name = await ng.generate_name()

          if (ng_name) {
            GemWarrior.world.player.name = ng_name
          } else {
            GemWarrior.world.player.name =
              GemWarrior.world.player._generate_name()

            console.warn(
              'NameGenerator.generate_name() failed; defaulting to terrible random name generator'
            )
          }
        } else {
          GemWarrior.world.player.name =
            GemWarrior.world.player._generate_name()

          console.warn(
            'NameGenerator.name_set load failed; defaulting to terrible random name generator'
          )
        }

        console.log('[LOADED] /app/world(default)')

        GemWarrior.world.save()
      } else {
        console.error('could not load default world data')
      }
    } else {
      console.error('could not load default world data url')
    }
  }

  if (GemWarrior.settings.firstTime) {
    await GemWarrior.modalOpen('start')
  } else {
    if (lsWorld) {
      GemWarrior._displayWelcomeBack()
    } else {
      GemWarrior._displayWelcome()
    }
  }
}

// load settings (gear icon) from localStorage
GemWarrior._loadSettings = async function () {
  const lsSettings = JSON.parse(localStorage.getItem(GW_SETTINGS_LS_KEY))
  let setting = null

  if (lsSettings) {
    if (lsSettings.enableAnimation !== undefined) {
      GemWarrior.settings.enableAnimation = lsSettings.enableAnimation

      setting = document.getElementById('button-setting-enable-animation')

      if (setting) {
        setting.dataset.status = GemWarrior.settings.enableAnimation
      }
    }

    if (lsSettings.enableSound !== undefined) {
      GemWarrior.settings.enableSound = lsSettings.enableSound

      if (GemWarrior.settings.enableSound) {
        // create synths
        if (!GemWarrior.config.synthBGM || !GemWarrior.config.synthSFX) {
          GemWarrior._initSynths()
        }

        for (elem of document.getElementsByClassName('requires-sound')) {
          elem.classList.add('enabled')
        }
      } else {
        for (elem of document.getElementsByClassName('requires-sound')) {
          elem.classList.remove('enabled')
        }
      }

      setting = document.getElementById('button-setting-enable-sound')

      if (setting) {
        setting.dataset.status = GemWarrior.settings.enableSound
      }
    }

    /*
    if (lsSettings.enableTypewriter !== undefined) {
      GemWarrior.settings.enableTypewriter = lsSettings.enableTypewriter

      if (GemWarrior.settings.enableTypewriter) {
        setting = document.getElementById('button-setting-enable-typewriter')

        if (setting) {
          setting.dataset.status = GemWarrior.settings.enableTypewriter
        }
      }
    }
    */

    if (lsSettings.firstTime !== undefined) {
      GemWarrior.settings.firstTime = lsSettings.firstTime
    }

    if (lsSettings.hasChangedName !== undefined) {
      GemWarrior.settings.hasChangedName = lsSettings.hasChangedName
    }

    if (lsSettings.history !== undefined) {
      GemWarrior.settings.history = lsSettings.history
    }

    if (lsSettings.historyMarker !== undefined) {
      GemWarrior.settings.historyMarker = lsSettings.historyMarker
    }

    if (lsSettings.showAvatar !== undefined) {
      GemWarrior.settings.showAvatar = lsSettings.showAvatar

      if (GemWarrior.settings.showAvatar) {
        if (!GemWarrior.config.avatarWorker) {
          GemWarrior._initAvatarWorker()
        }
      }

      setting = document.getElementById('button-setting-show-avatar')

      if (setting) {
        setting.dataset.status = GemWarrior.settings.showAvatar
      }
    }

    if (lsSettings.soundBGMLevel !== undefined) {
      if (GemWarrior.config.synthBGM) {
        GemWarrior.settings.soundBGMLevel = lsSettings.soundBGMLevel

        GemWarrior.config.synthBGM.setMasterVol(
          GemWarrior.settings.soundBGMLevel
        )

        setting = document.getElementById('range-setting-bgm-level')

        if (setting) {
          setting.value = GemWarrior.settings.soundBGMLevel * 100
        }
      } else {
        // console.error('no synthBGM found, so cannot set level')
      }
    }
    if (lsSettings.soundSFXLevel !== undefined) {
      if (GemWarrior.config.synthSFX) {
        GemWarrior.settings.soundSFXLevel = lsSettings.soundSFXLevel

        GemWarrior.config.synthSFX.setMasterVol(
          GemWarrior.settings.soundSFXLevel
        )

        setting = document.getElementById('range-setting-sfx-level')

        if (setting) {
          setting.value = GemWarrior.settings.soundSFXLevel * 100
        }
      } else {
        // console.error('no synthSFX found, so cannot set level')
      }
    }

    if (lsSettings.textSize !== undefined) {
      GemWarrior.settings.textSize = lsSettings.textSize

      GemWarrior.dom.output.style.fontSize = GemWarrior.settings.textSize + 'px'

      setting = document.getElementById('text-size-pixels')

      if (setting) {
        setting.value = lsSettings.textSize
      }
    }
  } else {
    await GemWarrior.modalOpen('start')
  }

  console.log('[LOADED] /app/main(settings)')
}
// change a setting (gear icon) value
// then save to localStorage
GemWarrior._changeSetting = function (setting, value) {
  switch (setting) {
    case 'enableAnimation':
      var st = document.getElementById('button-setting-enable-animation')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-animation'
          ).dataset.status = 'true'

          // save to code/LS
          GemWarrior._saveSetting('enableAnimation', true)
        } else {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-animation'
          ).dataset.status = 'false'

          // save to code/LS
          GemWarrior._saveSetting('enableAnimation', false)
        }
      }

      break

    case 'enableSound':
      var st = document.getElementById('button-setting-enable-sound')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-sound'
          ).dataset.status = 'true'

          // start up synth
          GemWarrior._initSynths()

          for (elem of document.getElementsByClassName('requires-sound')) {
            elem.classList.add('enabled')
          }

          // save to code/LS
          GemWarrior._saveSetting('enableSound', true)
        } else {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-sound'
          ).dataset.status = 'false'

          // stop background music playing
          GemWarrior._stopBGM()

          // destroy synth instance
          GemWarrior.config.synthBGM = null
          GemWarrior.config.synthSFX = null

          for (elem of document.getElementsByClassName('requires-sound')) {
            elem.classList.remove('enabled')
          }

          // save to code/LS
          GemWarrior._saveSetting('enableSound', false)
        }
      }

      break

    case 'enableTypewriter':
      var st = document.getElementById('button-setting-enable-typewriter')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-typewriter'
          ).dataset.status = 'true'

          // save to code/LS
          GemWarrior._saveSetting('enableTypewriter', true)
        } else {
          // update setting DOM
          document.getElementById(
            'button-setting-enable-typewriter'
          ).dataset.status = 'false'

          // save to code/LS
          GemWarrior._saveSetting('enableTypewriter', false)
        }
      }

      break

    case 'showAvatar':
      var st = document.getElementById('button-setting-show-avatar')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-show-avatar').dataset.status =
            'true'

          if (!GemWarrior.config.avatarWorker) {
            GemWarrior._initAvatarWorker()
          }

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-show-avatar').dataset.status =
            'false'

          // remove html from avatar div
          GemWarrior._destroyAvatarDisplay()

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', false)
        }
      }
      break

    case 'soundBGMLevel':
      // set config
      const newBGMLevel = parseInt(value) / 100

      if (GemWarrior.config.synthBGM) {
        GemWarrior.config.synthBGM.setMasterVol(newBGMLevel)
      } else {
        console.error('no synthBGM found, so cannot set level')
      }

      // save to code/LS
      GemWarrior._saveSetting('soundBGMLevel', newBGMLevel)

      break

    case 'soundSFXLevel':
      // set config
      const newSFXLevel = parseInt(value) / 100

      if (GemWarrior.config.synthSFX) {
        GemWarrior.config.synthSFX.setMasterVol(newSFXLevel)
      } else {
        console.error('no synthSFX found, so cannot set level')
      }

      // save to code/LS
      GemWarrior._saveSetting('soundSFXLevel', newSFXLevel)

      break

    case 'textSize':
      var st = document.getElementById('text-size-pixels').value

      if (st != '') {
        // sync to DOM
        GemWarrior.dom.output.style.fontSize = st + 'px'

        // save to code/LS
        GemWarrior._saveSetting('textSize', st)
      }

      break
  }
}
// save a setting (gear icon) to localStorage
GemWarrior._saveSetting = function (setting, value) {
  // console.log('saving setting to LS...', setting, value)

  const settings = JSON.parse(localStorage.getItem(GW_SETTINGS_LS_KEY))

  if (settings) {
    // set internal code model
    GemWarrior.settings[setting] = value

    // set temp obj that will go to LS
    settings[setting] = value

    // save all settings to LS
    localStorage.setItem(GW_SETTINGS_LS_KEY, JSON.stringify(settings))
  }

  // console.log('!global setting saved!', GemWarrior.settings)
}
