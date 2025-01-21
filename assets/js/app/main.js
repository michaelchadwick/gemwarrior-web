/* /assets/js/app/main.js */
/* app entry point and main functions */
/* global GemWarrior */

// settings: saved in LOCAL STORAGE
GemWarrior.settings = { ...GW_DEFAULTS.settings }

// config: only saved while game is loaded
GemWarrior.config = { ...GW_DEFAULTS.config }

// create new instance of Evaluator class to parse commands
GemWarrior.evaluator = new Evaluator()

/*************************************************************************
 * public methods *
 *************************************************************************/

GemWarrior.sendFeedback = async function (e) {
  e.preventDefault()

  const email = e.target.parentElement[0].value
  const feedback = e.target.parentElement[1].value

  GemWarrior._logStatus('sendFeedback', email, feedback)

  const response = await fetch('../assets/php/send-feedback.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email: email, feedback: feedback }),
  })
  const json = await response.json()

  const submitOutput = document.querySelector(
    '#feedback #feedback-submit-output'
  )

  if (json.error) {
    submitOutput.classList.remove('correct')
    submitOutput.classList.add('incorrect')
    submitOutput.innerHTML = 'Feedback could not be submitted. Try again later.'
  } else {
    document.querySelector('#feedback').innerHTML = 'Thanks for the feedback!'
  }

  GemWarrior._logStatus('json response', json)
}

GemWarrior.modalOpen = async function (type) {
  switch (type) {
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

      this.myModal = new Modal(
        'perm',
        'Feedback',
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

      var ctx = captchaCanvas.getContext('2d')
      ctx.font = 'bold 30px monospace'
      ctx.fillStyle = '#f2ed6e'
      ctx.width = CANVAS_WIDTH
      ctx.height = CANVAS_HEIGHT

      let emailField = document.querySelector('#feedback #feedback-email')
      let feedbackField = document.querySelector('#feedback #feedback-body')
      let userText = document.querySelector('#feedback #captcha-usertext')
      let submitButton = document.querySelector(
        '#feedback #feedback-button-submit'
      )
      let captchaOutput = document.querySelector('#feedback #captcha-output')
      let refreshButton = document.querySelector(
        '#feedback #feedback-button-refresh'
      )
      let submitOutput = document.querySelector(
        '#feedback #feedback-submit-output'
      )

      // alphaNums contains the characters with which you want to create the CAPTCHA
      let alphaNums = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ]

      const cw = captchaCanvas.width
      const ch = captchaCanvas.height

      for (let i = 1; i <= 7; i++) {
        captchaTextArr.push(
          alphaNums[Math.floor(Math.random() * alphaNums.length)]
        )
      }
      var c = captchaTextArr.join('')
      ctx.fillText(c, cw / 4, ch / 1.5)

      userText.addEventListener('keyup', function (e) {
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
      })

      refreshButton.addEventListener('click', function (event) {
        event.preventDefault()

        userText.value = ''

        captchaTextArr = []
        for (let j = 1; j <= 7; j++) {
          captchaTextArr.push(
            alphaNums[Math.floor(Math.random() * alphaNums.length)]
          )
        }

        ctx.clearRect(0, 0, cw, ch)
        c = captchaTextArr.join('')
        ctx.fillText(c, cw / 4, ch / 1.5)
        captchaOutput.innerHTML = ''
      })

      submitButton.addEventListener('click', function (event) {
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
      const playConfirm = new Modal(
        'confirm-start',
        `Welcome to ${PROGRAM_NAME}!`,
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

        if (!localStorage.getItem(GW_SETTINGS_LS_KEY)) {
          localStorage.setItem(
            GW_SETTINGS_LS_KEY,
            JSON.stringify(GW_DEFAULTS.settings)
          )
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
      this.myModal = new Modal(
        'perm',
        'Settings',
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
                  <input type="range" min="0" max="100" value="10" id="range-setting-bgm-level" onchange="GemWarrior._changeSetting('soundBGMLevel', event.target.value)">
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
                  <input type="range" min="0" max="100" value="20" id="range-setting-sfx-level" onchange="GemWarrior._changeSetting('soundSFXLevel', event.target.value)">
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
      this.myModal = new Modal(
        'perm-win',
        'Congratulations!',
        `
          You have figured out how to exit the <span class="noun">Inescapable Hole of Turbidity</span>! Well done on completing this pre-pre-alpha version of <span class="noun">${PROGRAM_NAME}</span>. There will be more content in the pre-alpha version, but <a target="_blank" href="https://michaelchadwick.info">let me know</a> if you have any comments so far.
        `,
        null,
        null
      )

      break
  }
}

GemWarrior.initApp = async function () {
  // if local dev, show debug stuff
  if (GemWarrior.env == 'local') {
    GemWarrior._initDebug()

    document.title = '(LH) ' + document.title
  }

  // need to run this once in initApp because
  // window.onload doesn't trigger correctly
  GemWarrior._resizeFixedElements()

  // lib/misc/localStorage.js
  // - await because it might open 'start' modal,
  //   which requires user interaction
  await GemWarrior._loadSettings()

  // lib/misc/localStorage.js
  // - await because it might open 'start' modal,
  //   which requires user interaction
  await GemWarrior._loadWorld()

  GemWarrior._initAvatarWorker()

  GemWarrior._updateDashboard()

  GemWarrior._getNebyooApps()

  GemWarrior._attachEventHandlers()

  GemWarrior._logStatus('[LOADED] /app/main')

  // initial command
  window.scrollTo(0, 1)
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// add debug stuff if local
GemWarrior._initDebug = function () {
  // console.log('[INITIALIZING] debug')

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
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

      GemWarrior._logStatus('[LOADED] /app/main(debug)')
    }
  }
}

// update user stats and send command result to display function
GemWarrior._repl = function (result) {
  GemWarrior._updateDashboard()
  GemWarrior._out(result)
}

// print result of user command
GemWarrior._out = function (text, noLineBreak) {
  let content_to_display = text

  if (!noLineBreak) {
    content_to_display = '<p>' + content_to_display + '</p>'
  }

  // add new text to output
  GemWarrior.dom.output.innerHTML += content_to_display

  // check if scroll is needed
  GemWarrior._scrollOutput()
}

GemWarrior._type = function (str) {
  GemWarrior._logStatus('_type')

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

GemWarrior._wait = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// update DOM stats
GemWarrior._updateDashboard = function () {
  // console.log('_updateDashboard()')

  GemWarrior.dom.statsNM.innerText = GemWarrior.world.player.name
  GemWarrior.dom.statsLV.innerText = GemWarrior.world.player.level
  GemWarrior.dom.statsXP.innerText = GemWarrior.world.player.xp
  GemWarrior.dom.statsHP.innerText = GemWarrior.world.player.hp
  GemWarrior.dom.statsROX.innerText = GemWarrior.world.player.inventory
    .rox()
    .toString()
  GemWarrior.dom.statsLOC.innerText = GemWarrior.world.location.name
}

// resize fixed elements when viewport changes
GemWarrior._resizeFixedElements = function () {
  // console.log('resized fixed elements')

  GemWarrior.dom.header.style.width = `${window.innerWidth - 32}px`
  GemWarrior.dom.keyboard.style.width = `${window.innerWidth - 16}px`

  GemWarrior._scrollOutput()
}

// dynamically scroll output depending on overflow
GemWarrior._scrollOutput = function () {
  const output = GemWarrior.dom.output

  if (output.scrollHeight > output.clientHeight) {
    output.scrollTop = output.scrollHeight
  }
}

// return available commands in a nice display
GemWarrior._displayCommands = function () {
  let cmdList = ''

  Object.keys(GW_COMMANDS).forEach((key) => {
    cmdList += `&nbsp;<strong>${key}</strong>:<br />&nbsp;&nbsp;<span class="keyword">${GW_COMMANDS[
      key
    ].join(', ')}</span><br />`
  })

  return cmdList
}

// write command list to main output
GemWarrior._displayHelp = function () {
  let output = `<span class="noun">${PROGRAM_NAME}</span> is an old-school (if you're not playing this in some alternate, circa 1970-something, timeline) text adventure game. Type words into the command line below, hit enter/return, and things happen! See if you can escape the <span class="noun">Inescapable Hole of Turbidity</span>!`

  output += `<br /><br />The following commands are valid:<br />${GemWarrior._displayCommands()}`

  return output
}

// write initial welcome message to main output
GemWarrior._displayWelcome = function () {
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
GemWarrior._displayWelcomeBack = function () {
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

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

GemWarrior.initApp()
