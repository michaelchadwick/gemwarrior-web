/* /assets/js/app/main.js */
/* app entry point and main functions */
/* global $, GemWarrior */

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {...GW_DEFAULTS.settings}

// config: only saved while game is loaded
GemWarrior.config = {...GW_DEFAULTS.config}

// set env
GemWarrior.config.env = GW_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

// create new instance of Evaluator class to parse commands
GemWarrior.evaluator = new Evaluator()

// create new instance of GameOptions class for global internal options
GemWarrior.options = new GameOptions()

/*************************************************************************
 * public methods *
 *************************************************************************/

async function modalOpen(type) {
  switch(type) {
    case 'help':
      GemWarrior._repl(`
        <br />
        <span class="command-previous">&gt; help</span><br />
        ${GemWarrior.evaluator.parse('help')}
      `)
      break

    case 'start':
      const playConfirm = new Modal('confirm-start', `Welcome to ${PROGRAM_NAME}!`,
        `
          Welcome to an old-school text adventure world of mystery and single-scene-ness (because I haven't programmed more than that yet). Use all the typical text adventure command fare and see if you can escape the <span class="noun">Inescapable Hole of Turbidity</span>!<br /><br />Feedback accepted and welcomed via any point of contact found <a href="https://michaelchadwick.info" target="_blank">here</a>.
        `,
        'Play w/ sound',
        'Play quietly'
      )

      try {
        // wait for modal confirmation
        const answer = await playConfirm.question()

        if (!localStorage.getItem(GW_SETTINGS_KEY)) {
          localStorage.setItem(GW_SETTINGS_KEY, JSON.stringify(GW_DEFAULTS.settings))
        }

        GemWarrior._saveSetting('firstTime', false)

        if (answer) {
          GemWarrior._saveSetting('enableSound', true)

          GemWarrior._initSynths()

          setTimeout(() => GemWarrior._playSFX('start'), 200)
        }
      } catch (err) {
        console.error('something went very wrong', err)
      }

      break

    case 'settings':
      this.myModal = new Modal('perm', 'Settings',
        `
          <div id="settings">

            <!-- enable sound -->
            <div class="setting-row">
              <div class="text">
                <div class="title">Enable sound</div>
                <div class="description">Enable GemWarrior to play music and sound effects.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-enable-sound" data-status="" class="switch" onclick="GemWarrior._changeSetting('enableSound')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- sound: bgm -->
            <div class="setting-row requires-sound">
              <div class="text">
                <div class="title">BGM Volume</div>
                <div class="description">How loud should the background music be?</div>
              </div>
              <div class="control">
                <div class="container">
                  <input type="range" min="0" max="100" value="10" id="range-setting-bgm-level" onchange="GemWarrior._changeSetting('soundBGMLevel', event)">
                </div>
              </div>
            </div>

            <!-- sound: fx -->
            <div class="setting-row requires-sound">
              <div class="text">
                <div class="title">SFX Volume</div>
                <div class="description">How loud should the sound effects be?</div>
              </div>
              <div class="control">
                <div class="container">
                  <input type="range" min="0" max="100" value="20" id="range-setting-sfx-level" onchange="GemWarrior._changeSetting('soundSFXLevel', event)">
                </div>
              </div>
            </div>

            <!-- show avatar -->
            <div class="setting-row">
              <div class="text">
                <div class="title">Show avatar</div>
                <div class="description">Show stick figure avatar in bottom-right.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-show-avatar" data-status="" class="switch" onclick="GemWarrior._changeSetting('showAvatar')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- text size -->
            <div class="setting-row">
              <div class="text">
                <div class="title">Text size</div>
                <div class="description">Adjust text size of output.</div>
              </div>
              <div class="control">
                <div class="container">
                  <input type="number" id="text-size-pixels" max="22" min="4" step="1" value="16" onchange="GemWarrior._changeSetting('textSize')" onkeyup="GemWarrior._changeSetting('textSize', event)" />
                </div>
              </div>
            </div>

          </div>
        `,
        null,
        null
      )

      GemWarrior._loadSettings()

      break

    case 'win':
      this.myModal = new Modal('perm-win', 'Congratulations!',
        `
          You have figured out how to exit the <span class="noun">Inescapable Hole of Turbidity</span>! Well done on completing this pre-pre-alpha version of <span class="noun">${PROGRAM_NAME}</span>. There will be more content in the pre-alpha version, but <a target="_blank" href="https://michaelchadwick.info">let me know</a> if you have any comments so far.
        `,
        null,
        null
      )

      break
  }
}

GemWarrior.initApp = async function() {
  // console.log('[INITIALIZING] app')

  // if local dev, show debug stuff
  if (GemWarrior.config.env == 'local') {
    GemWarrior._initDebug()

    document.title = '(LH) ' + document.title
  }

  await GemWarrior._loadSettings()

  GemWarrior._resizeFixed()

  GemWarrior._initAvatarWorker()

  GemWarrior._attachEventHandlers()

  GemWarrior._loadWorld()

  GemWarrior._getNebyooApps()

  // initial command
  window.scrollTo(0,1)

  console.log('[LOADED] /app/main')
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// add debug stuff if local
GemWarrior._initDebug = function() {
  // console.log('[INITIALIZING] debug')

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })

  if (params) {
    if (params.debug) {
      const debugStylesheet = document.createElement('link')
      debugStylesheet.rel = 'stylesheet'
      debugStylesheet.href = './assets/css/logger.css'
      document.head.appendChild(debugStylesheet)

      const debugScript = document.createElement('script')
      debugScript.src = './assets/js/app/lib/misc/logger.js'
      document.body.appendChild(debugScript)

      document.getElementById('log-container').style.display = 'block'

      console.log('[LOADED] /app/main(debug)')
    }
  }
}

GemWarrior._loadSettings = async function() {
  // console.log('[LOADING] settings')

  const lsSettings = JSON.parse(localStorage.getItem(GW_SETTINGS_KEY))
  let setting = null

  if (lsSettings) {
    if (lsSettings.enableSound !== undefined) {
      GemWarrior.settings.enableSound = lsSettings.enableSound

      if (GemWarrior.settings.enableSound) {
        // create synths
        if (!GemWarrior.config.synth_bgm || !GemWarrior.config.synth_sfx) {
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

    if (lsSettings.firstTime !== undefined) {
      GemWarrior.settings.firstTime = lsSettings.firstTime
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
      if (GemWarrior.config.synth_bgm) {
        GemWarrior.settings.soundBGMLevel = lsSettings.soundBGMLevel

        GemWarrior.config.synth_bgm.setMasterVol(GemWarrior.settings.soundBGMLevel)

        setting = document.getElementById('range-setting-bgm-level')

        if (setting) {
          setting.value = GemWarrior.settings.soundBGMLevel * 100
        }
      } else {
        // console.error('no synth_bgm found, so cannot set level')
      }
    }
    if (lsSettings.soundSFXLevel !== undefined) {
      if (GemWarrior.config.synth_sfx) {
        GemWarrior.settings.soundSFXLevel = lsSettings.soundSFXLevel

        GemWarrior.config.synth_sfx.setMasterVol(GemWarrior.settings.soundSFXLevel)

        setting = document.getElementById('range-setting-sfx-level')

        if (setting) {
          setting.value = GemWarrior.settings.soundSFXLevel * 100
        }
      } else {
        // console.error('no synth_sfx found, so cannot set level')
      }
    }

    if (lsSettings.textSize !== undefined) {
      GemWarrior.settings.textSize = lsSettings.textSize

      $('#output').css('font-size', GemWarrior.settings.textSize + 'px')

      setting = document.getElementById('text-size-pixels')

      if (setting) {
        setting.value = lsSettings.textSize
      }
    }
  } else {
    await modalOpen('start')
  }

  console.log('[LOADED] /app/main(settings)')
}
GemWarrior._changeSetting = function(setting, event = null) {
  switch (setting) {
    case 'enableSound':
      var st = document.getElementById('button-setting-enable-sound')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-enable-sound').dataset.status = 'true'

          // start up synth
          GemWarrior._initSynths()

          for (elem of document.getElementsByClassName('requires-sound')) {
            elem.classList.add('enabled')
          }

          // save to code/LS
          GemWarrior._saveSetting('enableSound', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-enable-sound').dataset.status = 'false'

          // stop background music playing
          GemWarrior._stopBGM()

          // destroy synth instance
          GemWarrior.config.synth_bgm = null
          GemWarrior.config.synth_sfx = null

          for (elem of document.getElementsByClassName('requires-sound')) {
            elem.classList.remove('enabled')
          }

          // save to code/LS
          GemWarrior._saveSetting('enableSound', false)
        }
      }

      break

    case 'showAvatar':
      var st = document.getElementById('button-setting-show-avatar')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-show-avatar').dataset.status = 'true'

          if (!GemWarrior.config.avatarWorker) {
            GemWarrior._initAvatarWorker()
          }

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-show-avatar').dataset.status = 'false'

          // remove html from avatar div
          GemWarrior._destroyAvatarDisplay()

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', false)
        }
      }
      break

    case 'soundBGMLevel':
      // set config
      const newBGMLevel = parseInt(event.target.value) / 100

      if (GemWarrior.config.synth_bgm) {
        GemWarrior.config.synth_bgm.setMasterVol(newBGMLevel)
      } else {
        console.error('no synth_bgm found, so cannot set level')
      }

      // save to code/LS
      GemWarrior._saveSetting('soundBGMLevel', newBGMLevel)

      break

    case 'soundSFXLevel':
      // set config
      const newSFXLevel = parseInt(event.target.value) / 100

      if (GemWarrior.config.synth_sfx) {
        GemWarrior.config.synth_sfx.setMasterVol(newSFXLevel)
      } else {
        console.error('no synth_sfx found, so cannot set level')
      }

      // save to code/LS
      GemWarrior._saveSetting('soundSFXLevel', newSFXLevel)

      break

    case 'textSize':
      var st = document.getElementById('text-size-pixels').value

      if (st != '') {
        // sync to DOM
        $('#output').css('font-size', st + 'px')

        // save to code/LS
        GemWarrior._saveSetting('textSize', st)
      }

      break
  }
}
GemWarrior._saveSetting = function(setting, value) {
  console.log('saving setting to LS...', setting, value)

  const settings = JSON.parse(localStorage.getItem(GW_SETTINGS_KEY))

  if (settings) {
    // set internal code model
    GemWarrior.settings[setting] = value

    // set temp obj that will go to LS
    settings[setting] = value

    // save all settings to LS
    localStorage.setItem(GW_SETTINGS_KEY, JSON.stringify(settings))
  }

  // console.log('!global setting saved!', GemWarrior.settings)
}

// load entire GemWarrior world into existence
GemWarrior._loadWorld = async function() {
  console.log('[INITIALIZING] /app/world')

  const lsWorld = localStorage.getItem(GW_WORLD_KEY)

  if (lsWorld) {
    console.log('Saved world data found. Loading...')

    const lsWorldObj = JSON.parse(lsWorld)

    GemWarrior.world = new World(lsWorldObj)

    console.log('[LOADED] /app/world(saved)')

    GemWarrior._updateInterface()

    if (GemWarrior.settings.firstTime) {
      await modalOpen('start')
    } else {
      GemWarrior._displayWelcomeBack()
    }
  } else {
    const jsonLocations = await fetch(GW_WORLD_IHOT_JSON_URL)

    if (jsonLocations) {
      const worldObj = {}
      worldObj.locations = await jsonLocations.json()

      if (worldObj) {
        GemWarrior.world = new World(worldObj)

        // create name for player inside world
        const ng = new NameGenerator('fantasy')
        const ng_name_set = await ng.get_name_set()

        if (ng_name_set) {
          const ng_name = await ng.generate_name()

          if (ng_name) {
            GemWarrior.world.player.name = ng_name
          } else {
            GemWarrior.world.player.name = GemWarrior.world.player._generate_name()

            console.warn('NameGenerator.generate_name() failed; defaulting to terrible random name generator')
          }
        } else {
          GemWarrior.world.player.name = GemWarrior.world.player._generate_name()

          console.warn('NameGenerator.name_set load failed; defaulting to terrible random name generator')
        }

        console.log('[LOADED] /app/world(default)')

        GemWarrior._updateInterface()
      } else {
        console.error('could not load default world data')
      }
    } else {
      console.error('could not load default world data url')
    }

    if (GemWarrior.settings.firstTime) {
      await modalOpen('start')
    } else {
      GemWarrior._displayWelcome()
    }
  }
}

GemWarrior._attachEventHandlers = function() {
  // {} header icons to open modals
  GemWarrior.dom.interactive.btnNav.click(() => {
    GemWarrior.dom.navOverlay.toggleClass('show')
  })
  GemWarrior.dom.interactive.btnNavClose.click(() => {
    GemWarrior.dom.navOverlay.toggleClass('show')
  })
  GemWarrior.dom.interactive.btnHelp.click(() => modalOpen('help'))
  GemWarrior.dom.interactive.btnSettings.click(() => modalOpen('settings'))

  // catch the mobile keyboard buttons
  $('#keyboard button').click(function (event) {
    let key = event.target.dataset.key

    if (key == undefined) {
      key = event.target.parentElement.dataset.key
    }

    switch (key) {
      case '↵':
        GemWarrior.__handleEnter()
        break
      case '<':
        GemWarrior.__handleBackspace()
        break
      default:
        // update keyCommand
        GemWarrior.config.keyCommand += key

        // make sure DOM display is visible
        GemWarrior.dom.interactive.keyboardInput.addClass('show')

        break
    }

    // sync to DOM display
    if (GemWarrior.dom.interactive.keyboard.is(':visible')) {
      GemWarrior.dom.interactive.keyboardInput.text(GemWarrior.config.keyCommand)
    }
  })

  // catch the command bar form
  $('#cli form').submit(function (e) {
    e.preventDefault()

    const input = GemWarrior.dom.interactive.cmdInput.val()

    if (input.length) {
      // show last entered command and display evaluated output
      GemWarrior._repl(`
        <br />
        <span class="command-previous">&gt; ${input}</span><br />
        ${GemWarrior.evaluator.parse(input)}
      `)

      // clear command bar
      GemWarrior.dom.interactive.cmdInput.val('')
    }
  })

  // jquery command to force the textbox to take focus
  GemWarrior.dom.interactive.cmdInput.focus()

  // if we leave command bar form, return after a second
  $('*').on('mouseup', (event) => {
    const isTextSelected = window.getSelection().toString() != ''

    if (!isTextSelected) {
      setTimeout(function() {
        GemWarrior.dom.interactive.cmdInput.focus()
      }, GW_SNAPBACK_DELAY)
    }
  })

  // $('#output').scroll(function() {
  //   const output = document.getElementById('output')
  //   console.log('#output scrollTop, scrollHeight, clientHeight', output.scrollTop, output.scrollHeight, output.clientHeight)
  // })

  // cycle through previous commands
  $(document).on('keydown', function(event) {
    const code = event.code

    var excludedKeys = ['Alt', 'Control', 'Meta', 'Shift']

    if (!excludedKeys.some(key => event.originalEvent.getModifierState(key))) {
      if (GemWarrior.dom.interactive.keyboard.is(':visible')) {
        if (code == 'Enter') {
          event.preventDefault()

          GemWarrior.__handleEnter()
        } else if (code == 'Backspace') {
          GemWarrior.__handleBackspace()
        } else if (code == 'Space') {
          GemWarrior.config.keyCommand += '_'

          // sync to DOM display
          GemWarrior.dom.interactive.keyboardInput.text(GemWarrior.config.keyCommand)

          GemWarrior.dom.interactive.keyboardInput.addClass('show')
        } else if (code.startsWith('Key')) {
          const key = code.charAt(code.length - 1)

          $('#keyboard button').each(function() {
            if ($(this).data('key') == key.toLowerCase()) {
              // update keyCommand
              GemWarrior.config.keyCommand += key

              // sync to DOM display
              GemWarrior.dom.interactive.keyboardInput.text(GemWarrior.config.keyCommand)

              GemWarrior.dom.interactive.keyboardInput.addClass('show')
            }
          })
        }
      } else {
        if (['ArrowUp', 'ArrowDown'].includes(code)) {
          GemWarrior.__traverseHistory(code)
        }
      }
    }
  })

  $(document).on('touchmove', function(event) {
    event = event.originalEvent || event

    if (event.scale !== 1) {
      event.preventDefault()
    }
  }, false)

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', GemWarrior.__handleClickTouch)
  window.addEventListener('touchend', GemWarrior.__handleClickTouch)

  // on viewport change, resize output
  window.onresize = GemWarrior._resizeFixed
}

// update user stats and send command result to display function
GemWarrior._repl = function(result) {
  GemWarrior._updateInterface()
  GemWarrior._out(result)
}

// print result of user command
GemWarrior._out = function(text, noLineBreak) {
  let $content_to_display = text

  if (!noLineBreak) {
    $content_to_display = '<p>' + $content_to_display + '</p>'
  }

  // add new text to output
  GemWarrior.dom.output.append($content_to_display)

  // check if scroll is needed
  GemWarrior._scrollOutput()
}

// update DOM stats and save to localStorage
GemWarrior._updateInterface = function() {
  // console.log('_updateInterface()', GemWarrior.world.player.rox())

  GemWarrior.dom.statsNM.text(GemWarrior.world.player.name)
  GemWarrior.dom.statsLV.text(GemWarrior.world.player.level)
  GemWarrior.dom.statsXP.text(GemWarrior.world.player.xp)
  GemWarrior.dom.statsHP.text(GemWarrior.world.player.hp)
  GemWarrior.dom.statsROX.text(GemWarrior.world.player.inventory.rox().toString())
  GemWarrior.dom.statsLOC.innerText = GemWarrior.world.location.name
}

// resize fixed elements when viewport changes
GemWarrior._resizeFixed = function() {
  // console.log('resized fixed elements')

  $('header').width(window.innerWidth - 32)
  $('#interface #keyboard').width(window.innerWidth - 16)

  GemWarrior._scrollOutput()
}

// dynamically scroll output depending on overflow
GemWarrior._scrollOutput = function() {
  const output = document.getElementById('output')

  // console.log('no scrolling yet')
  // console.log('output.scrollHeight, output.clientHeight', output.scrollHeight, output.clientHeight)

  if (output.scrollHeight > output.clientHeight) {
    $('#output').animate({ scrollTop: output.scrollHeight }, 100, function() {
      // console.log('scrolled output', document.getElementById('output').scrollTop)
      // console.log('output.scrollHeight, output.clientHeight', output.scrollHeight, output.clientHeight)
    })
  }
}

// return available commands in a nice display
GemWarrior._displayCommands = function() {
  let cmdList = ''

  Object.keys(GW_COMMANDS).forEach((key) => {
    cmdList += `&nbsp;<strong>${key}</strong>:<br />&nbsp;&nbsp;<span class="keyword">${GW_COMMANDS[key].join(', ')}</span><br />`
  })

  return cmdList
}

// write command list to main output
GemWarrior._displayHelp = function() {
  let output = `<span class="noun">${PROGRAM_NAME}</span> is an old-school (if you're not playing this in some alternate, circa 1970-something, timeline) text adventure game. Type words into the command line below, hit enter/return, and things happen! See if you can escape the <span class="noun">Inescapable Hole of Turbidity</span>!`

  output += `<br /><br />The following commands are valid:<br />${GemWarrior._displayCommands()}`

  return output
}

// write initial welcome message to main output
GemWarrior._displayWelcome = function() {
  let output = `
*********************************************
* Welcome to <span class="noun">${PROGRAM_NAME}</span>!                   *
* - Try <span class="keyword">help</span> if stuck                       *
* - Type <span class="keyword">change name [new-name]</span> to rename   *
*   your randomly-named character           *
* - Top-right gear icon for options         *`

  if (!GemWarrior.options.world_save) {
    output += `
* - World save is off, so <strong>DON'T REFRESH</strong>!    *`
  }

  output += `
* Good luck, <span class="noun">${GemWarrior.world.player.name}</span>...                   *
*********************************************`

  GemWarrior.dom.output.append('<pre>' + output + '</pre>')
}

// write welcome back message for saved game to main output
GemWarrior._displayWelcomeBack = function() {
  let output = `
*********************************************
* Welcome back to <span class="noun">${PROGRAM_NAME}</span>, <span class="noun">${GemWarrior.world.player.name}</span>!   *
* - Try <span class="keyword">help</span> if stuck                       *
* - Type <span class="keyword">change name [new-name]</span> to rename   *
*   your randomly-named character           *
* - Top-right gear icon for options         *`

  if (!GemWarrior.options.world_save) {
    output += `
* - World save is off, so <strong>DON'T REFRESH</strong>!    *`
  }

  output += `
*********************************************`

  GemWarrior.dom.output.append('<pre>' + output + '</pre>')
}

GemWarrior._getNebyooApps = async function() {
  const response = await fetch(NEBYOOAPPS_SOURCE_URL)
  const json = await response.json()
  const apps = json.body
  const appList = document.querySelector('.nav-list')

  Object.values(apps).forEach(app => {
    const appLink = document.createElement('a')
    appLink.href = app.url
    appLink.innerText = app.title
    appLink.target = '_blank'
    appList.appendChild(appLink)
  })
}

/************************************************************************
 * _private __helper methods *
 ************************************************************************/

GemWarrior.__handleEnter = function() {
  if (GemWarrior.config.keyCommand.length > 0) {
    // display last command and then evaluate and output
    let input = GemWarrior.config.keyCommand

    // fix on-screen keyboard "spaces"
    input = input.toString().replaceAll('_', ' ')

    GemWarrior._repl(`
      <br />
      <span class="command-previous">&gt; ${input}</span><br />
      ${GemWarrior.evaluator.parse(input)}
    `)

    // reset keyCommand
    GemWarrior.config.keyCommand = ''

    // sync to DOM display
    GemWarrior.dom.interactive.keyboardInput.text(GemWarrior.config.keyCommand)

    // if keyCommand is empty, hide DOM display
    GemWarrior.dom.interactive.keyboardInput.removeClass('show')
  }
}

GemWarrior.__handleBackspace = function() {
  if (GemWarrior.config.keyCommand.length) {
    // remove last letter from keyCommand
    GemWarrior.config.keyCommand = GemWarrior.config.keyCommand.slice(0, GemWarrior.config.keyCommand.length - 1)

    // sync to DOM display
    GemWarrior.dom.interactive.keyboardInput.text(GemWarrior.config.keyCommand)

    // console.log(GemWarrior.config.keyCommand.length)

    // if keyCommand is empty, hide DOM display
    if (GemWarrior.config.keyCommand.length <= 0) {
      GemWarrior.dom.interactive.keyboardInput.removeClass('show')
    }
  }
}

GemWarrior.__handleClickTouch = function(event) {
  var dialog = document.getElementsByClassName('modal-dialog')[0]

  if (dialog) {
    var isConfirm = dialog.classList.contains('modal-confirm')

    // only close if not a confirmation!
    if (event.target == dialog && !isConfirm) {
      dialog.remove()
    }
  }

  if (event.target == GemWarrior.dom.navOverlay) {
    GemWarrior.dom.navOverlay.classList.toggle('show')
  }
}

// replace the command bar's command with historic data if available
GemWarrior.__traverseHistory = function(key) {
  if (GemWarrior.config.history.length > 0) {
    if (key === 'ArrowUp') { // up, or "back", or "prev cmd"
      if (GemWarrior.config.historyMarker > 0) {
        GemWarrior.config.historyMarker--
      }
    } else { // down, or "forward", or "next most recent cmd"
      if (GemWarrior.config.historyMarker < GemWarrior.config.history.length) {
        GemWarrior.config.historyMarker++
      } else { // back to current untyped-as-of-yet command
        GemWarrior.dom.interactive.cmdInput.val()
        GemWarrior.config.historyMarker = GemWarrior.config.history.length
      }
    }

    // set command bar to historical value
    GemWarrior.dom.interactive.cmdInput.focus().val('')

    setTimeout(() => GemWarrior.dom.interactive.cmdInput.val(GemWarrior.config.history[GemWarrior.config.historyMarker]), 20)
  }
}

// get a filtered list of the player's command history
GemWarrior.__getHistoryDisplay = function() {
  return `<strong>Command history</strong>: ${GemWarrior.config.history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
}

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior.initApp
