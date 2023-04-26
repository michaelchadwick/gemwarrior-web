/* main */
/* app entry point and main functions */
/* global $, GemWarrior */

// set env
GemWarrior.config.env = GW_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

/*************************************************************************
 * public methods *
 *************************************************************************/

async function modalOpen(type) {
  switch(type) {
    case 'help':
      GemWarrior._repl(`
        <br />
        <span class="command-previous">&gt; help</span><br />
        ${GemWarrior._evaluator('help')}
      `)
      break

    case 'start':
      const playConfirm = new Modal('confirm', 'Welcome to Gem Warrior',
        `
          Welcome to a world of mystery and single-room-ness (because I haven't programmed more than that yet). See if you can escape the Inescapable Hole of Turbidity (spoiler: you cannot...yet)! However, there are plenty of the usual text adventure command fare to experiment with for now.
        `,
        'Play w/ sound',
        'Play quietly'
      )

      try {
        // wait for modal confirmation
        const answer = await playConfirm.question()

        GemWarrior._saveSetting('firstTime', false)

        if (answer) {
          GemWarrior._saveSetting('enableSound', true)
          GemWarrior._initSynths()

          GemWarrior._playSFX('sfx-start')
        }

        GemWarrior._displayWelcome()
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
  }
}

GemWarrior.initApp = async function() {
  console.log('[INITIALIZING] app')

  // if local dev, show debug stuff
  if (GemWarrior.config.env == 'local') {
    GemWarrior._initDebug()

    document.title = '(LH) ' + document.title
  }

  GemWarrior._loadSettings()

  GemWarrior._resizeFixed()

  GemWarrior._getNebyooApps()

  if (GemWarrior.settings.firstTime) {
    await modalOpen('start')
  } else {
    GemWarrior._displayWelcome()
  }

  GemWarrior._loadWorld()

  GemWarrior._initAvatarWorker()

  GemWarrior._attachEventHandlers()

  // initial command
  window.scrollTo(0,1)
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// add debug stuff if local
GemWarrior._initDebug = function() {
  console.log('[INITIALIZING] debug')

  var qd = {}

  if (location.search) location.search.substr(1).split("&").forEach(function(item) {
    var s = item.split("="),
        k = s[0],
        v = s[1] && decodeURIComponent(s[1]); //  null-coalescing / short-circuit
    //(k in qd) ? qd[k].push(v) : qd[k] = [v]
    (qd[k] = qd[k] || []).push(v) // null-coalescing / short-circuit
  })

  if (qd.debugCSS && qd.debugCSS == 1) {
    var debugStyles = document.createElement('link')
    debugStyles.rel = 'stylesheet'
    debugStyles.href = './public/build/css/debug.css'
    document.head.appendChild(debugStyles)
  }
}

GemWarrior._loadSettings = function() {
  console.log('[LOADING] settings')

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
    // save default game settings
    try {
      localStorage.setItem(GW_SETTINGS_KEY, JSON.stringify(GemWarrior.settings))

      // console.log('localStorage settings saved!', JSON.parse(localStorage.getItem(GW_SETTINGS_KEY)))
    } catch(error) {
      console.error('localStorage global settings save failed', error)
    }
  }
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
  // console.log('saving setting to LS...', setting, value)

  var settings = JSON.parse(localStorage.getItem(GW_SETTINGS_KEY))

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
        ${GemWarrior._evaluator(input)}
      `)

      // clear command bar
      GemWarrior.dom.interactive.cmdInput.val('')
    }
  })

  // jquery command to force the textbox to take focus
  GemWarrior.dom.interactive.cmdInput.focus()

  // if we leave command bar form, return after a second
  $('*').on('mouseup', function() {
    setTimeout(function() {
      GemWarrior.dom.interactive.cmdInput.focus()
    }, 1000)
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
  GemWarrior._updateStatus()
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

// process the user command input
GemWarrior._evaluator = function(command) {
  // console.log('command', command)

  GemWarrior.config.history.push(command)
  GemWarrior.config.historyMarker = GemWarrior.config.history.length

  let cmds = command.split(' ')

  let verb = cmds[0].toLowerCase()
  let subj = cmds[1]

  if (subj) {
    subj = cmds.slice(1, cmds.length)
    subj = subj.filter((i) => !['a', 'the', 'my'].includes(i))
    subj = subj.join(' ').toLowerCase()
  }

  switch (verb) {
    case 'go':
    case 'g':
      if (subj) {
        GemWarrior._evaluator(subj)
      } else {
        GemWarrior.config.text = 'You cannot just <span class="keyword">go</span> without a direction.'
      }

      break

    case 'north':
    case 'n':
      GemWarrior.config.text = GemWarrior._try_to_move('north')
      break

    case 'west':
    case 'w':
      GemWarrior.config.text = GemWarrior._try_to_move('west')
      break

    case 'south':
    case 's':
      GemWarrior.config.text = GemWarrior._try_to_move('south')
      break

    case 'east':
    case 'e':
      GemWarrior.config.text = GemWarrior._try_to_move('east')
      break

    case 'look':
    case 'l':
      GemWarrior.config.text = GemWarrior.world.describe(GemWarrior.world.player.cur_coords)

      break

    case 'character':
    case 'char':
    case 'c':
      GemWarrior.config.text = `You assess yourself: wearing a shirt, pants, socks, and shoes, your fashion sense is satisfactory, without being notable.<br />
      <p>You are <strong>${GemWarrior.config.player.status}</strong>.</p>
      You are reasonably healthy, but due to your current location and station, that feeling of heartiness diminishes as your hunger increases.`

      break

    case 'inventory':
    case 'inven':
    case 'inv':
    case 'i':
      let roxCount = ''

      if (GemWarrior.config.player.rox === 1) {
        roxCount = ' <strong>1</strong> rock'
      } else {
        roxCount = ` <strong>${GemWarrior.config.player.rox}</strong> rox`
      }

      let playerInv = ''

      GemWarrior.config.player.inventory.forEach((thing) => {
        playerInv += `<span class="noun">a ${thing}</span>, `
      })

      if (GemWarrior.config.player.inventory.length !== 0) {
        GemWarrior.config.text = `You have the clothes on your back, ${playerInv} <span class="noun">${roxCount}</span>`

        if (GemWarrior.config.player.inventory_checks >= 1) {
          GemWarrior.config.text += '.'
        } else {
          GemWarrior.config.text += ', and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".'

          GemWarrior.config.player.inventory_checks++
        }
      } else {
        GemWarrior.config.text = `You have nothing on your person except the clothes on your back and ${roxCount}`
      }

      break

    case 'pickup':
    case 'p':
    case 'take':
    case 't':
      if (subj) {
        if (!GemWarrior.world.cur_location.items.includes(subj)) {
          GemWarrior.config.text = 'That object is not present, so picking it up is going to be difficult.'
        } else if (GemWarrior.world.remove_item(GemWarrior.world.player.cur_coords, subj)) {
          GemWarrior.config.text = `You pick up the <span class="noun">${subj}</span>.`

          if (subj == 'rock') {
            GemWarrior.config.player.rox++
          }

          GemWarrior._playSFX('sfx-take')
        } else {
          GemWarrior.config.text = `You fail to pick up the <span class="noun">${subj}</span> for some unforseen reason.`
        }
      } else {
        GemWarrior.config.text = `Since you did not indicate <strong>what</strong> to pick up, you bend down momentarily and attempt to pick up some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
      }

      break

    case 'throw':
    case 'th':
      if (GemWarrior.config.player.rox > 0) {
        GemWarrior.config.player.rox--

        GemWarrior.world.cur_location.items.push('rock')

        GemWarrior.config.text = 'You throw a <span class="noun">rock</span> on the ground, because that is definitely a productive move.'

        GemWarrior._playSFX('sfx-drop')
      } else {
        GemWarrior.config.text = 'You have no <span class="noun">rox</span> to throw, so your hand just makes the motion with no effect, sadly.'
      }

      break

    case 'use':
    case 'u':
      if (subj) {
        const itemExists = GemWarrior.config.player.inventory.filter(item => item == subj)
        const itemExistsToken = GemWarrior.config.player.inventory.filter(item => item.split(' ').includes(subj))

        if (itemExists.length) {
          GemWarrior.config.text = `You use the <span class="keyword">${subj}</span> from your inventory. Unfortunately, nothing interesting happens because item usage has not been coded yet.`
        } else if (itemExistsToken.length) {
          GemWarrior.config.text = `You use the <span class="keyword">${itemExistsToken[0]}</span> from your inventory. Unfortunately, nothing interesting happens because item usage has not been coded yet.`
        } else {
          GemWarrior.config.text = `You don't have a <span class="keyword">${subj}</span>, let alone <em>the</em> <span class="keyword">${subj}</span>, so...well, nothing happens.`
        }
      } else {
        GemWarrior.config.text = `Use <em>what</em>, exactly?`
      }

      break

    case 'sit':
    case 'si':
      if (GemWarrior.config.player.status === 'sitting') {
        GemWarrior.config.text = `You are already ${GemWarrior.config.player.status}.`
      } else {
        GemWarrior._avatarSit({ sound: true })
        GemWarrior.config.text = 'You sit down.'
      }

      break

    case 'stand':
    case 'st':
      if (GemWarrior.config.player.status === 'standing') {
        GemWarrior.config.text = `You are already ${GemWarrior.config.player.status}.`
      } else {
        GemWarrior._avatarStand({ sound: true })
        GemWarrior.config.text = 'You stand up.'
      }

      break

    case 'sleep':
    case 'sl':
      if (GemWarrior.config.player.status == 'sleeping') {
        GemWarrior.config.text = 'You are already resting.'
      } else {
        GemWarrior.config.player.status = 'sleeping'
        GemWarrior._avatarSleep(true)

        GemWarrior.config.text = 'You lie down to rest.'
      }

      break

    case 'playbgm':
    case 'play':
    case 'pl':
      if (GemWarrior.settings.enableSound) {
        if (!GemWarrior.config.synth_bgm.playing) {
          if (GemWarrior.config.player.status == 'sleeping') {
            GemWarrior._playBGM('sleep')
          } else {
            GemWarrior._playBGM('main')
          }

          GemWarrior.config.text = 'Playing background music.'
        } else {
          GemWarrior.config.text = 'Background music is already playing.'
        }
      } else {
        GemWarrior.config.text = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
      }

      break

    case 'stopbgm':
    case 'stop':
      if (GemWarrior.settings.enableSound) {
        if (GemWarrior.config.synth_bgm.playing) {
          GemWarrior._stopBGM()

          GemWarrior.config.text = 'Background music has stopped.'
        } else {
          GemWarrior.config.text = 'Background is not playing, so this has no effect.'
        }
      } else {
        GemWarrior.config.text = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
      }

      break

    case 'help':
    case 'h':
    case '?':
      GemWarrior.config.text = GemWarrior._displayHelp()

      break

    case 'history':
    case 'hist':
      GemWarrior.config.text = GemWarrior.__getHistoryDisplay()

      break

    case 'about':
    case 'a':
      GemWarrior.config.text = `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info' target='_blank'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior' target='_blank'>Gem Warrior</a>, a <a class='glow-transition' href='https://rubygems.org' target='_blank'>Ruby gem</a> (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")<br /><br />

      <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`

      break

    default:
      GemWarrior.config.text = 'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

      break
  }

  return GemWarrior.config.text
}

GemWarrior._try_to_move = function(direction) {
  if (GemWarrior.world.can_move(direction)) {
    const new_coords = GemWarrior.world.player.go(direction)

    GemWarrior.dom.statsLOC.innerText = GemWarrior.world.locations[new_coords].name

    return GemWarrior.world.describe(new_coords)
  } else {
    GemWarrior._playSFX('sfx-bonk')

    return 'Cannot move that way.'
  }
}

// display command list
GemWarrior._displayHelp = function() {
  var cmdList = ''

  Object.keys(GW_COMMANDS).forEach((key) => {
    cmdList += `<br />&nbsp;${key}:<br />&nbsp;&nbsp;<span class="keyword">${GW_COMMANDS[key].join(', ')}</span><br />`
  })

  return `HELP: The following commands are valid: ${cmdList}`
}

// update DOM stats
GemWarrior._updateStatus = function() {
  GemWarrior.dom.statsLV.text(GemWarrior.config.player.level)
  GemWarrior.dom.statsXP.text(GemWarrior.config.player.xp)
  GemWarrior.dom.statsHP.text(GemWarrior.config.player.hp)
  GemWarrior.dom.statsROX.text(GemWarrior.config.player.rox)
  GemWarrior.dom.statsLOC.innerText = GemWarrior.world.locations[GemWarrior.world.player.cur_coords].name
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

GemWarrior._initSynths = function() {
  console.log('[INITIALIZING] synths')

  if (!GemWarrior.config.synth_bgm) {
    // initialize synth_bgm instance
    GemWarrior.config.synth_bgm = new WebAudioTinySynth({
      debug: 1,
      loop: 1,
      masterVol: GemWarrior.settings.soundBGMLevel,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  GemWarrior.config.synth_bgm.setLoop(1)
  GemWarrior.config.synth_bgm.setMasterVol(GemWarrior.settings.soundBGMLevel)
  GemWarrior.config.synth_bgm.setProgram(0, 2)

  if (GemWarrior.config.synth_bgm) {
    console.log('* synth_bgm initialized!')
  } else {
    console.error('* synth_bgm could not be initialized')
  }

  if (!GemWarrior.config.synth_sfx) {
    // initialize synth_bgm instance
    GemWarrior.config.synth_sfx = new WebAudioTinySynth({
      debug: 0,
      loop: 0,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  if (GemWarrior.config.synth_sfx) {
    console.log('* synth_sfx initialized!')
  } else {
    console.error('* synth_sfx could not be initialized')
  }
}
GemWarrior._playBGM = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-bgm-${action}.mid`

    GemWarrior.config.synth_bgm.loadMIDIUrl(filename)

    setTimeout(() => {
      // console.log('_playBGM()', filename)

      // setInterval(() => {
      //   console.log('synth_bgm.playStatus()',
      //     GemWarrior.config.synth_bgm.getPlayStatus()
      //   )
      // }, 1000)

      GemWarrior.config.synth_bgm.playMIDI()
    }, 20)
  }
}
GemWarrior._stopBGM = function() {
  GemWarrior.config.synth_bgm.stopMIDI()
}

GemWarrior._playSFX = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-${action}.mid`

    GemWarrior.config.synth_sfx.loadMIDIUrl(filename)
    GemWarrior.config.synth_sfx.setLoop(0)
    GemWarrior.config.synth_sfx.setMasterVol(GemWarrior.settings.soundSFXLevel)
    GemWarrior.config.synth_sfx.setProgram(0, 3)

    setTimeout(() => {
      // console.log('_playSFX()', filename)

      // setInterval(() => {
      //   console.log('playStatus', GemWarrior.config.synth_bgm.getPlayStatus(), GemWarrior.config.synth_bgm)
      // }, 1000)

      GemWarrior.config.synth_sfx.playMIDI()
    }, 20)
  }
}

GemWarrior._displayWelcome = function() {
  GemWarrior.dom.output.append(`<pre>
*************************************
* Welcome to Gem Warrior!           *
* - Try <span class="keyword">help</span> if stuck               *
* - Top-right gear icon for options *
* - Currently only one room...or?   *
* <strong>Good luck...</strong>                      *
*************************************
</pre>`)
}

// load entire GemWarrior world into existence
GemWarrior._loadWorld = function() {
  fetch(GW_WORLD_JSON)
    .then(response => response.json())
    .then(json => GemWarrior.world = new World(json))
    .then(() => GemWarrior._updateStatus())
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
      ${GemWarrior._evaluator(input)}
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

GemWarrior.__isBGMPlaying = function() {
  return GemWarrior.config.synth_bgm.playing
}

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior.initApp
