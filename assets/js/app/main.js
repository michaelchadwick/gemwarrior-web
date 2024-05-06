/* /assets/js/app/main.js */
/* app entry point and main functions */
/* global GemWarrior */

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {...GW_DEFAULTS.settings}

// config: only saved while game is loaded
GemWarrior.config = {...GW_DEFAULTS.config}

// set env
GemWarrior.config.env = GW_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

// create new instance of Evaluator class to parse commands
GemWarrior.evaluator = new Evaluator()

/*************************************************************************
 * public methods *
 *************************************************************************/

GemWarrior.sendFeedback = async function(e) {
  e.preventDefault()

  const email = e.target.parentElement[0].value
  const feedback = e.target.parentElement[1].value

  console.log('sendFeedback', email, feedback)

  const response = await fetch('../assets/php/send-feedback.php', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept":       "application/json"
    },
    body: JSON.stringify({ "email": email, "feedback": feedback })
  })
  const json = await response.json()

  const submitOutput = document.querySelector('#feedback #feedback-submit-output')

  if (json.error) {
    submitOutput.classList.remove("correct")
    submitOutput.classList.add("incorrect")
    submitOutput.innerHTML = 'Feedback could not be submitted. Try again later.'
  } else {
    document.querySelector('#feedback').innerHTML = 'Thanks for the feedback!'
  }

  console.log('json response', json)
}

async function modalOpen(type) {
  switch(type) {
    case 'help':
      GemWarrior._out(`
        <br />
        <span class="command-previous">&gt; help</span><br />
      `)
      GemWarrior._repl(GemWarrior.evaluator.process('help'))

      break

    case 'feedback':
      const CANVAS_WIDTH = 300
      const CANVAS_HEIGHT = 50

      this.myModal = new Modal('perm', 'Feedback',
        `
          <form id="feedback">
            <p>Thanks for taking the time to send me some feedback on Gem Warrior!</p>

            <input id="feedback-email" type="email" placeholder="Email address" required />

            <textarea id="feedback-body" placeholder="Thoughts, questions, bugs? Put them here" required></textarea>

            <div id="captcha-container">
              <canvas id="captcha" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">captcha text</canvas>
              <input id="captcha-usertext" type="text" name="text">
              <button id="feedback-button-refresh" type="button">Refresh</button>
              <span id="captcha-output"></span>
            </div>

            <span id="feedback-submit-output"></span>

            <button id="feedback-button-submit"">Send Feedback</button>
          </form>
        `,
        null,
        null
      )

      let captchaCanvas = document.querySelector('#captcha')
      let captchaTextArr = []

      var ctx = captchaCanvas.getContext("2d")
      ctx.font = "bold 30px monospace"
      ctx.fillStyle = "#f2ed6e"
      ctx.width = CANVAS_WIDTH
      ctx.height = CANVAS_HEIGHT

      let emailField = document.querySelector('#feedback #feedback-email')
      let feedbackField = document.querySelector('#feedback #feedback-body')
      let userText = document.querySelector('#feedback #captcha-usertext')
      let submitButton = document.querySelector('#feedback #feedback-button-submit')
      let captchaOutput = document.querySelector('#feedback #captcha-output')
      let refreshButton = document.querySelector('#feedback #feedback-button-refresh')
      let submitOutput = document.querySelector('#feedback #feedback-submit-output')

      // alphaNums contains the characters with which you want to create the CAPTCHA
      let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

      const cw = captchaCanvas.width
      const ch = captchaCanvas.height

      for (let i = 1; i <= 7; i++) {
        captchaTextArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
      }
      var c = captchaTextArr.join('');
      ctx.fillText(c, cw / 4, ch / 1.5)

      userText.addEventListener('keyup', function(e) {
        // Key Code Value of "Enter" Button is 13
        if (e.keyCode === 13) {
          if (userText.value === c) {
            captchaOutput.classList.add('correct')
            captchaOutput.innerHTML = 'Correct!'
          } else {
            captchaOutput.classList.add('incorrect')
            captchaOutput.innerHTML = 'Incorrect, please try again'
          }
        }
      });

      refreshButton.addEventListener('click', function(event) {
        event.preventDefault()

        userText.value = ""

        captchaTextArr = []
        for (let j = 1; j <= 7; j++) {
          captchaTextArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)])
        }

        ctx.clearRect(0, 0, cw, ch)
        c = captchaTextArr.join('')
        ctx.fillText(c, cw / 4, ch / 1.5)
        captchaOutput.innerHTML = ""
      });

      submitButton.addEventListener('click', function(event) {
        event.preventDefault()

        if (emailField.value == '' || feedbackField.value == '') {
          submitOutput.classList.add('incorrect')
          submitOutput.innerHTML = 'Email and feedback fields required'
        } else {
          submitOutput.classList.remove('incorrect')
          submitOutput.innerHTML = ''

          if (userText.value === c) {
            GemWarrior.sendFeedback(event)
          } else {
            captchaOutput.classList.add('incorrect')
            captchaOutput.innerHTML = 'Incorrect, please try again'
          }
        }
      })

      break

    case 'start':
      const playConfirm = new Modal('confirm-start', `Welcome to ${PROGRAM_NAME}!`,
        `
          <p>Welcome to an old-school text adventure world of mystery and single-scene-ness (because I haven't programmed more than that yet). Use all the typical text adventure command fare and see if you can escape the <span class="noun">Inescapable Hole of Turbidity</span>!</p>

          <br />

          <p>Feedback accepted and welcomed! Click the dialog icon (<i class="fa-solid fa-comments"></i>) in the top-right of the header and send me a few words.</p>

          <br />

          <p>Now, please choose how to handle audio (can be changed in settings <i class="fa-solid fa-gear"></i> later), and be off on your adventure!
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

            <!-- enable animation -->
            <div class="setting-row">
              <div class="text">
                <div class="title">Enable animation</div>
                <div class="description">Show some visual zazz for various actions.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-enable-animation" data-status="true" class="switch" onclick="GemWarrior._changeSetting('enableAnimation')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- enable sound -->
            <div class="setting-row">
              <div class="text">
                <div class="title">Enable sound</div>
                <div class="description">Play music and sound effects.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-enable-sound" data-status="" class="switch" onclick="GemWarrior._changeSetting('enableSound')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>

            <!--
            <div class="setting-row">
              <div class="text">
                <div class="title">Enable typewriter</div>
                <div class="description">Display location descriptions using a typewriter effect the first time you visit them.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-enable-typewriter" data-status="" class="switch" onclick="GemWarrior._changeSetting('enableTypewriter')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>
            -->

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

  // need to run this once in initApp because
  // window.onload doesn't trigger correctly
  GemWarrior._resizeFixedElements()

  await GemWarrior._loadSettings()

  GemWarrior._initAvatarWorker()

  await GemWarrior._loadWorld()

  GemWarrior._updateDashboard()

  GemWarrior._getNebyooApps()

  GemWarrior._attachEventHandlers()

  console.log('[LOADED] /app/main')

  // initial command
  window.scrollTo(0,1)
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

      GemWarrior.dom.logContainer.style.display = 'block'

      console.log('[LOADED] /app/main(debug)')
    }
  }
}

GemWarrior._loadSettings = async function() {
  // console.log('[LOADING] settings')

  const lsSettings = JSON.parse(localStorage.getItem(GW_SETTINGS_KEY))
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

    // if (lsSettings.enableTypewriter !== undefined) {
    //   GemWarrior.settings.enableTypewriter = lsSettings.enableTypewriter

    //   if (GemWarrior.settings.enableTypewriter) {
    //     setting = document.getElementById('button-setting-enable-typewriter')

    //     if (setting) {
    //       setting.dataset.status = GemWarrior.settings.enableTypewriter
    //     }
    //   }
    // }

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

        GemWarrior.config.synthBGM.setMasterVol(GemWarrior.settings.soundBGMLevel)

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

        GemWarrior.config.synthSFX.setMasterVol(GemWarrior.settings.soundSFXLevel)

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
    await modalOpen('start')
  }

  console.log('[LOADED] /app/main(settings)')
}
GemWarrior._changeSetting = function(setting, event = null) {
  switch (setting) {
    case 'enableAnimation':
      var st = document.getElementById('button-setting-enable-animation')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-enable-animation').dataset.status = 'true'

          // save to code/LS
          GemWarrior._saveSetting('enableAnimation', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-enable-animation').dataset.status = 'false'

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
          document.getElementById('button-setting-enable-typewriter').dataset.status = 'true'

          // save to code/LS
          GemWarrior._saveSetting('enableTypewriter', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-enable-typewriter').dataset.status = 'false'

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
      const newSFXLevel = parseInt(event.target.value) / 100

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
GemWarrior._saveSetting = function(setting, value) {
  // console.log('saving setting to LS...', setting, value)

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
  // console.log('[INITIALIZING] /app/world')

  const lsWorld = localStorage.getItem(GW_WORLD_KEY)

  if (lsWorld) {
    // console.log('Saved world data found. Loading...')

    const lsWorldObj = JSON.parse(lsWorld)

    GemWarrior.world = new World(lsWorldObj)

    console.log('[LOADED] /app/world(saved)')

    // GemWarrior._updateDashboard()

    if (GemWarrior.settings.firstTime) {
      await modalOpen('start')
    } else {
      GemWarrior._displayWelcomeBack()
    }
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
            GemWarrior.world.player.name = GemWarrior.world.player._generate_name()

            console.warn('NameGenerator.generate_name() failed; defaulting to terrible random name generator')
          }
        } else {
          GemWarrior.world.player.name = GemWarrior.world.player._generate_name()

          console.warn('NameGenerator.name_set load failed; defaulting to terrible random name generator')
        }

        console.log('[LOADED] /app/world(default)')

        GemWarrior.world.save()

        // GemWarrior._updateDashboard()
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
  GemWarrior.dom.btnNav.addEventListener('click', () => {
    GemWarrior.dom.navOverlay.classList.toggle('show')
  })
  GemWarrior.dom.btnNavClose.addEventListener('click', () => {
    GemWarrior.dom.navOverlay.classList.toggle('show')
  })
  GemWarrior.dom.btnHelp.addEventListener('click', () => modalOpen('help'))
  GemWarrior.dom.btnFeedback.addEventListener('click', () => modalOpen('feedback'))
  GemWarrior.dom.btnSettings.addEventListener('click', () => modalOpen('settings'))

  // catch the mobile keyboard buttons
  GemWarrior.dom.keyboardButtons.forEach(button => {
    button.addEventListener('click', (event) => {
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
          GemWarrior.dom.keyboardInput.classList.add('show')

          break
      }

      // sync to DOM display
      if (getComputedStyle(GemWarrior.dom.keyboard).display == 'block') {
        GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand
      }
    })
  })

  // catch the command bar form
  GemWarrior.dom.cliForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const input = GemWarrior.dom.cmdInput.value

    if (input.length) {
      // show last entered command and display evaluated output
      GemWarrior._out(`
        <br />
        <span class="command-previous">&gt; ${input}</span><br />
      `)

      GemWarrior._repl(GemWarrior.evaluator.process(input))

      // clear command bar
      GemWarrior.dom.cmdInput.value = ''
    }
  })

  // force the textbox to take focus
  GemWarrior.dom.cmdInput.focus()

  // if we leave command bar form, return after a moment
  document.addEventListener('mouseup', () => {
    const isTextSelected = window.getSelection().toString() != ''
    const isFeedbackFocused = ['feedback', 'feedback-email', 'feedback-body', 'feedback-submit', 'captcha-usertext', 'feedback-button-refresh'].includes(document.activeElement.id)

    if (!isTextSelected && !isFeedbackFocused) {
      setTimeout(function() {
        GemWarrior.dom.cmdInput.focus()
      }, GW_SNAPBACK_DELAY)
    }
  })

  // cycle through previous commands
  document.addEventListener('keydown', (event) => {
    const code = event.code
    const excludedKeys = ['Alt', 'Control', 'Meta', 'Shift']

    if (!excludedKeys.some(key => event.getModifierState(key))) {
      if (getComputedStyle(GemWarrior.dom.keyboard).display == 'block') {
        if (code == 'Enter') {
          event.preventDefault()

          GemWarrior.__handleEnter()
        } else if (code == 'Backspace') {
          GemWarrior.__handleBackspace()
        } else if (code == 'Space') {
          GemWarrior.config.keyCommand += '_'

          // sync to DOM display
          GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

          GemWarrior.dom.keyboardInput.classList.add('show')
        } else if (code.startsWith('Key')) {
          const key = code.charAt(code.length - 1)

          GemWarrior.dom.keyboardButtons.forEach(button => {
            if (button.dataset.key == key.toLowerCase()) {
              // update keyCommand
              GemWarrior.config.keyCommand += key

              // sync to DOM display
              GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

              GemWarrior.dom.keyboardInput.classList.add('show')
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

  document.addEventListener('touchmove', (event) => {
    event = event.originalEvent || event

    if (event.scale !== 1) {
      event.preventDefault()
    }
  }, false)

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', GemWarrior.__handleClickTouch)
  window.addEventListener('touchend', GemWarrior.__handleClickTouch)

  // on viewport change, resize output
  window.onresize = GemWarrior._resizeFixedElements

  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const gestureZone = document.getElementById('output');

  gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  }, false);

  gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    console.log(GemWarrior.__handleGesture(touchstartX, touchstartY, touchendX, touchendY))
    // alert(GemWarrior.__handleGesture(touchstartX, touchstartY, touchendX, touchendY))
  }, false);
}

// update user stats and send command result to display function
GemWarrior._repl = function(result) {
  GemWarrior._updateDashboard()
  GemWarrior._out(result)
}

// print result of user command
GemWarrior._out = function(text, noLineBreak) {
  let content_to_display = text

  if (!noLineBreak) {
    content_to_display = '<p>' + content_to_display + '</p>'
  }

  // add new text to output
  GemWarrior.dom.output.innerHTML += content_to_display

  // check if scroll is needed
  GemWarrior._scrollOutput()
}

GemWarrior._type = function(str) {
  console.log('_type')

  let i = 0

  while (i < str.length) {
    const char = str.charAt(i)

    // console.log('type char', char)

    const min = 9
    const max = min + 3
    // min delay (s) to max delay (s) (exclusive)
    const delay = Math.floor(Math.random() * max) + min

    GemWarrior._wait(delay)

    GemWarrior.dom.output.append(char)
    GemWarrior._scrollOutput()
    i++
  }

  return
}

GemWarrior._wait = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// update DOM stats and save to localStorage
GemWarrior._updateDashboard = function() {
  // console.log('_updateDashboard()')

  GemWarrior.dom.statsNM.innerText = GemWarrior.world.player.name
  GemWarrior.dom.statsLV.innerText = GemWarrior.world.player.level
  GemWarrior.dom.statsXP.innerText = GemWarrior.world.player.xp
  GemWarrior.dom.statsHP.innerText = GemWarrior.world.player.hp
  GemWarrior.dom.statsROX.innerText = GemWarrior.world.player.inventory.rox().toString()
  GemWarrior.dom.statsLOC.innerText = GemWarrior.world.location.name
}

// resize fixed elements when viewport changes
GemWarrior._resizeFixedElements = function() {
  // console.log('resized fixed elements')

  GemWarrior.dom.header.style.width = `${window.innerWidth - 32}px`
  GemWarrior.dom.keyboard.style.width = `${window.innerWidth - 16}px`

  GemWarrior._scrollOutput()
}

// dynamically scroll output depending on overflow
GemWarrior._scrollOutput = function() {
  const output = GemWarrior.dom.output

  if (output.scrollHeight > output.clientHeight) {
    output.scrollTop = output.scrollHeight
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
  const name = GemWarrior.world.player.name
  const len = name.length
  const sp = GemWarrior._sp(28 - len)
  const will_save = GemWarrior.config.worldSave
  const has_renamed = GemWarrior.settings.hasChangedName

  let output = `
*********************************************
* Welcome to <span class="noun">${PROGRAM_NAME}</span>!                   *
* - Try <span class="keyword">help</span> if stuck                       *`

  if (!has_renamed) {
    output += `
* - Type <span class="keyword">change name [new-name]</span>             *
*   to rename your character                *`
  }

  output += `
* - Top-right gear icon for options         *`

  if (!will_save) {
    output += `
* - World save is off, so <strong>DON'T REFRESH</strong>!    *`
  }

  output += `
* Good luck, <span class="noun">${name}</span>...${sp}*
*********************************************`

  GemWarrior._out('<pre>' + output + '</pre>')
}

// write welcome back message for saved game to main output
GemWarrior._displayWelcomeBack = function() {
  const name = GemWarrior.world.player.name
  const len = name.length
  const sp = GemWarrior._sp(12 - len).length > 0 ? GemWarrior._sp(12 - len) : ''
  const will_save = GemWarrior.config.worldSave
  const has_renamed = GemWarrior.settings.hasChangedName

  let output = `
******************************
* Welcome back, <span class="noun">${name}</span>!${sp}*
* - Try <span class="keyword">help</span> if stuck        *`

  if (!has_renamed) {
    output += `
* - Type <span class="keyword">change name [name]</span>  *
*   to rename character      *`
  }

  output += `
* - Gear icon for options    *`

  if (!will_save) {
    output += `
* - World save is off, so <strong>DON'T REFRESH</strong>!    *`
  }

  output += `
******************************`

  GemWarrior._out('<pre>' + output + '</pre>')
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

    GemWarrior._out(`
      <br />
      <span class="command-previous">&gt; ${input}</span><br />
    `)
    GemWarrior._repl(GemWarrior.evaluator.process(input))

    // reset keyCommand
    GemWarrior.config.keyCommand = ''

    // sync to DOM display
    GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

    // if keyCommand is empty, hide DOM display
    GemWarrior.dom.keyboardInput.classList.remove('show')
  }
}

GemWarrior.__handleBackspace = function() {
  if (GemWarrior.config.keyCommand.length) {
    // remove last letter from keyCommand
    GemWarrior.config.keyCommand = GemWarrior.config.keyCommand.slice(0, GemWarrior.config.keyCommand.length - 1)

    // sync to DOM display
    GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

    // console.log(GemWarrior.config.keyCommand.length)

    // if keyCommand is empty, hide DOM display
    if (GemWarrior.config.keyCommand.length <= 0) {
      GemWarrior.dom.keyboardInput.classList.remove('show')
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

// TOUCH: add mobile swipe ability
GemWarrior.__handleGesture = function(touchstartX, touchstartY, touchendX, touchendY) {
  const delx = touchendX - touchstartX
  const dely = touchendY - touchstartY

  if (Math.abs(delx) > Math.abs(dely)) {
    if (delx > 0) return "right"
    else return "left"
  }
  else if(Math.abs(delx) < Math.abs(dely)){
    if(dely > 0) return "down"
    else return "up"
  }
  else return "tap"
}

// replace the command bar's command with historic data if available
GemWarrior.__traverseHistory = function(key) {
  if (GemWarrior.settings.history.length > 0) {
    if (key === 'ArrowUp') { // up, or "back", or "prev cmd"
      if (GemWarrior.settings.historyMarker > 0) {
        GemWarrior.settings.historyMarker--
      }
    } else { // down, or "forward", or "next most recent cmd"
      if (GemWarrior.settings.historyMarker < GemWarrior.settings.history.length) {
        GemWarrior.settings.historyMarker++
      } else { // back to current untyped-as-of-yet command
        GemWarrior.dom.cmdInput.value = ''
        GemWarrior.settings.historyMarker = GemWarrior.settings.history.length
      }
    }

    // set command bar to historical value
    GemWarrior.dom.cmdInput.focus()
    GemWarrior.dom.cmdInput.value = ''

    if (GemWarrior.settings.history[GemWarrior.settings.historyMarker]) {
      setTimeout(() => GemWarrior.dom.cmdInput.value = GemWarrior.settings.history[GemWarrior.settings.historyMarker], 20)
    }
  }

  GemWarrior._saveSetting('history', GemWarrior.settings.history)
  GemWarrior._saveSetting('historyMarker', GemWarrior.settings.historyMarker)
}

// get a filtered list of the player's command history
GemWarrior.__getHistoryDisplay = function() {
  return `<strong>Command history</strong>: ${GemWarrior.settings.history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
}

// print number of spaces
GemWarrior._sp = function(num) {
  const spaces = []

  for (let i = 0; i < num; i++) {
    spaces.push('&nbsp;')
  }

  return spaces.join('')
}

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior.initApp
