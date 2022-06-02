/* main */
/* app entry point and main functions */
/* global $, GemWarrior */

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {
  'playSound': false,
  'showAvatar': false
}

// config: only saved while game is loaded
GemWarrior.config = {
  "player": {
    "level": 1,
    "xp": 0,
    "hp": 10,
    "rox": 2,
    "status": 'standing',
    "inventory": [
      'broken flashlight',
      'candlestick holder'
    ]
  },
  "avatar": {},
  "avatarWorker": null,
  "blinker": null,
  "history": [],
  "historyMarker": 0,
  "keyCommand": '',
  "synth": null,
  "text": ''
}

/*************************************************************************
 * public methods *
 *************************************************************************/

async function modalOpen(type) {
  switch(type) {
    case 'help':
      GemWarrior._repl(GemWarrior._evaluator('help'))
      break

    case 'settings':
      this.myModal = new Modal('perm', 'Settings',
        `
          <div id="settings">
            <div class="setting-row">
              <div class="text">
                <div class="title">Play sound</div>
                <div class="description">Allow GemWarrior to play music and sound effects.</div>
              </div>
              <div class="control">
                <div class="container">
                  <div id="button-setting-play-sound" data-status="" class="switch" onclick="GemWarrior._changeSetting('playSound')">
                    <span class="knob"></span>
                  </div>
                </div>
              </div>
            </div>
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
          </div>
        `,
        null,
        null
      )

      GemWarrior._loadSettings()

      break
  }
}

GemWarrior.initApp = function() {
  // set env
  GemWarrior.env = GW_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

  // if local dev, show debug stuff
  if (GemWarrior.env == 'local') {
    GemWarrior._initDebug()

    document.title = '(LH) ' + document.title
  }

  GemWarrior._attachEventHandlers()

  GemWarrior._updateStatus()

  GemWarrior._loadSettings()

  GemWarrior._welcome()

  GemWarrior.config.avatar._initAvatarDisplay()

  GemWarrior._resizeFixed()

  // initial command
  window.scrollTo(0,1)
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// add debug stuff if local
GemWarrior._initDebug = function() {
  var qd = {};
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
  const lsSettings = JSON.parse(localStorage.getItem(GW_SETTINGS_KEY))

  if (lsSettings) {
    if (lsSettings.playSound) {
      GemWarrior.settings.playSound = lsSettings.playSound

      var setting = document.getElementById('button-settings-play-sound')

      if (setting) {
        setting.dataset.status = 'true'
      }
    }

    if (lsSettings.showAvatar) {
      GemWarrior.settings.showAvatar = lsSettings.showAvatar

      GemWarrior.config.avatar._initAvatarDisplay()

      var setting = document.getElementById('button-settings-show-avatar')

      if (setting) {
        setting.dataset.status = 'true'
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
    case 'playSound':
      var st = document.getElementById('button-setting-play-sound')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-play-sound').dataset.status = 'true'

          // save to code/LS
          GemWarrior._saveSetting('playSound', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-play-sound').dataset.status = 'false'

          // save to code/LS
          GemWarrior._saveSetting('playSound', false)
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

          GemWarrior.config.avatar._initAvatarDisplay()

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-show-avatar').dataset.status = 'false'

          // save to code/LS
          GemWarrior._saveSetting('showAvatar', false)
        }
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
  // TODO: show visual display of keys pressed
  $('#keyboard button').click(function (event) {
    const key = event.target.dataset.key

    if (key == '↵') {
      GemWarrior._out('')
      GemWarrior._out(`<span class="command-previous">&gt; ${GemWarrior.config.keyCommand}`)
      GemWarrior._out(GemWarrior._evaluator(GemWarrior.config.keyCommand))

      GemWarrior.config.keyCommand = ''
      GemWarrior.dom.keyboardInput.removeClass('show')
    } else if (key == '<') {
      if (GemWarrior.config.keyCommand.length) {
        GemWarrior.config.keyCommand = GemWarrior.config.keyCommand.slice(0, GemWarrior.config.keyCommand.length - 1)

        if (!GemWarrior.config.keyCommand) {
          GemWarrior.dom.keyboardInput.removeClass('show')
        }
      }
    } else {
      GemWarrior.config.keyCommand += key

      GemWarrior.dom.keyboardInput.addClass('show')
    }

    // add keyCommand to visual keyboardInput bubble
    GemWarrior.dom.keyboardInput.text(GemWarrior.config.keyCommand)
  })

  // catch the command bar form
  $('#cli form').submit(function (e) {
    e.preventDefault()

    const input = $('#userInput').val()

    // console.log('input', input)

    // show last entered command
    GemWarrior._out('')
    GemWarrior._out(`<span class="command-previous">&gt; ${input}</span>`)

    // evaluate command
    GemWarrior._repl(GemWarrior._evaluator(input))

    // clear command bar
    $('#userInput').val('')
  })

  // jquery command to force the textbox to take focus
  $('#userInput').focus()

  // if we leave command bar form, return after a second
  $('*').on('mouseup', function() {
    setTimeout(function() {
      $('#userInput').focus()
    }, 1000)
  })

  // cycle through previous commands
  $(document).on('keydown', function(event) {
    const keyUp = 38
    const keyDn = 40

    if ([keyUp, keyDn].includes(event.keyCode)) {
      GemWarrior._traverseHistory(event.keyCode)
    }
  })

  $(document).on('touchmove', function(event) {
    event = event.originalEvent || event

    if (event.scale !== 1) {
      event.preventDefault()
    }
  }, false)

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', GemWarrior._handleClickTouch)
  window.addEventListener('touchend', GemWarrior._handleClickTouch)

  // on viewport change, resize output
  window.onresize = GemWarrior._resizeFixed
}

// handle both clicks and touches outside of modals
GemWarrior._handleClickTouch = function(event) {
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

// update user stats and send command result to display function
GemWarrior._repl = function(result) {
  GemWarrior._updateStatus()
  GemWarrior._out(result)
}

// print result of user command
GemWarrior._out = function(text, lineBreak) {
  let $content_to_display = text

  if (!lineBreak) {
    $content_to_display += '<br />'
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
      GemWarrior.config.text = `You go somewhere else inescapable in the <span class='noun'>${GW_LOCATION.title}</span>.`

      break
    case 'north':
    case 'n':
      GemWarrior.config.text = `You go <strong>north</strong> a bit. You are still in an inescapable hole.`

      break
    case 'west':
    case 'w':
      GemWarrior.config.text = `You go <strong>west</strong> a bit. You are still in an inescapable hole.`

      break
    case 'south':
    case 's':
      GemWarrior.config.text = `You go <strong>south</strong> a bit. You are still in an inescapable hole.`

      break
    case 'east':
    case 'e':
      GemWarrior.config.text = `You go <strong>east</strong> a bit. You are still in an inescapable hole.`
      break

    case 'look':
    case 'l':
      GemWarrior.config.text = `You look around the <span class='noun'>${GW_LOCATION.title}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`

      if (GW_LOCATION.objects.length > 0) {
        GemWarrior.config.text += '<br /><br />'

        GemWarrior.config.text += `There are things to pick up here: <span class="noun">${GW_LOCATION.objects.join(', ')}</span>`
      }

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
      if (GemWarrior.config.player.rox === 1) {
        roxCount = ' <strong>1</strong> rock'
      } else {
        roxCount = ` <strong>${GemWarrior.config.player.rox}</strong> rox`
      }

      playerInv = ''
      GemWarrior.config.player.inventory.forEach((thing) => {
        playerInv += `<span class="noun">a ${thing}</span>, `
      })

      if (GemWarrior.config.player.inventory.length !== 0) {
        GemWarrior.config.text = `You have the clothes on your back, ${playerInv} <span class="noun">${roxCount}</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".`
      } else {
        GemWarrior.config.text = `You have nothing on your person except the clothes on your back and ${roxCount}`
      }

      break

    case 'pickup':
    case 'p':
      if (subj) {
        if (subj === 'rock' && GW_LOCATION.objects.includes('rock')) {
          GemWarrior.config.text = 'You pick up a <span class="noun">rock</span>.'

          GW_LOCATION.objects.splice(GW_LOCATION.objects.indexOf('rock'), 1)
          GemWarrior.config.player.rox++
        } else {
          GemWarrior.config.text = 'That object is not present, so picking it up is going to be difficult.'
        }
      } else {
        GemWarrior.config.text = `Since you did not indicate <strong>what</strong> to pick up, you bend down momentarily and attempt to pick up some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
      }

      break
    case 'throw':
    case 'th':
      if (GemWarrior.config.player.rox > 0) {
        GemWarrior.config.player.rox--

        GW_LOCATION.objects.push('rock')

        GemWarrior.config.text = 'You throw a <span class="noun">rock</span> on the ground, because that is definitely a productive move.'
      } else {
        GemWarrior.config.text = 'You have no <span class="noun">rox</span> to throw, so your hand just makes the motion with no effect, sadly.'
      }

      break

    case 'use':
    case 'u':
      if (subj) {
        if (GemWarrior.config.player.inventory.includes(subj)) {
          GemWarrior.config.text = `You use the <span class="keyword">${subj}</span> from your inventory. Unfortunately, nothing interesting happens because item usage has not been coded yet.`
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
        GemWarrior.config.player.status = 'sitting'
        GemWarrior.config.avatar._playerSit()
        GemWarrior.config.text = 'You sit down.'
      }

      break
    case 'stand':
    case 'st':
      if (GemWarrior.config.player.status === 'standing') {
        GemWarrior.config.text = `You are already ${GemWarrior.config.player.status}.`
      } else {
        GemWarrior.config.player.status = 'standing'
        GemWarrior.config.avatar._playerStand()
        GemWarrior.config.text = 'You stand up.'
      }

      break
    case 'sleep':
    case 'sl':
      GemWarrior.config.player.status = 'reclining'
      GemWarrior.config.avatar._playerRecline()

      GemWarrior.config.text = 'You lie down to rest.'

      break

    case 'playsong':
    case 'pl':
      GemWarrior._playSong()

      if (GemWarrior.settings.playSound) {
        GemWarrior.config.text = 'Playing the song of my people...'
      } else {
        GemWarrior.config.text = `Sound is not enabled. Try <span class="keyword">settings playSound</span>.`
      }

      break;

    case 'help':
    case 'h':
    case '?':
      GemWarrior.config.text = GemWarrior._displayHelp()

      break

    case 'history':
    case 'hist':
      GemWarrior.config.text = GemWarrior._getHistoryDisplay()

      break

    case 'about':
    case 'a':
      GemWarrior.config.text = `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info' target='_blank'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior' target='_blank'>Gem Warrior</a>, a <a class='glow-transition' href='https://rubygems.org' target='_blank'>Ruby gem</a> (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")<br /><br />

      <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`

      break

    case 'settings':
    case 'sett':
      if (subj) {
        switch (subj) {
          case 'playsound':
            GemWarrior.settings.playSound = !GemWarrior.settings.playSound

            if (GemWarrior.settings.playSound) {
              GemWarrior.config.synth = new WebAudioTinySynth()

              GemWarrior.config.text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword true">${GemWarrior.settings.playSound}</span>.`
            } else {
              GemWarrior.config.synth = null

              GemWarrior.config.text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword false">${GemWarrior.settings.playSound}</span>.`
            }

            break
          case 'showavatar':
            GemWarrior.settings.showAvatar = !GemWarrior.settings.showAvatar

            if (!GemWarrior.settings.showAvatar) {
              GemWarrior.config.text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword false">${GemWarrior.settings.showAvatar}</span>.`

              $('#avatar').html('')
            } else {
              GemWarrior.config.text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword true">${GemWarrior.settings.showAvatar}</span>.`

              GemWarrior.config.avatar._getAvatarDisplay(GemWarrior.config.player.status)
            }
            break
          default:
            GemWarrior.config.text = `There is no current setting with the name <span class="keyword">${subj}.`
        }
      } else {
        GemWarrior.config.text = `<code>${JSON.stringify(GemWarrior.settings, null, 2)}</code>`
      }

      break

    default:
      GemWarrior.config.text = 'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

      break
  }

  return GemWarrior.config.text
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
  GemWarrior.dom.statsLOC.text(GW_LOCATION.title)
}

GemWarrior._resizeFixed = function() {
  console.log('resized fixed elements')

  $('header').width(window.innerWidth - 32)
  $('#spacer').height($('#interface').height() - 2)
  $('#interface #keyboard').width(window.innerWidth - 16)

  GemWarrior._scrollOutput()
}

// dynamically scroll output depending on overflow
GemWarrior._scrollOutput = function() {
  const output = document.getElementById('output')

  if (output.scrollHeight > output.clientHeight) {
    $('#output').animate({ scrollTop: output.clientHeight }, 100, function() {
      console.log('scrolled output')
    })
  }
}

// replace the command bar's command with historic data if available
GemWarrior._traverseHistory = function(key) {
  const up = 38

  if (GemWarrior.config.history.length > 0) {
    if (key === up) { // up, or "back", or "prev cmd"
      if (GemWarrior.config.historyMarker > 0) {
        GemWarrior.config.historyMarker--
      }
    } else { // down, or "forward", or "next most recent cmd"
      if (GemWarrior.config.historyMarker < GemWarrior.config.history.length) {
        GemWarrior.config.historyMarker++
      } else { // back to current untyped-as-of-yet command
        GemWarrior.dom.userInput.val()
        GemWarrior.config.historyMarker = GemWarrior.config.history.length
      }
    }

    // set command bar to historical value
    GemWarrior.dom.userInput.val(GemWarrior.config.history[GemWarrior.config.historyMarker])

    // move cursor to end of value
    var cmd = document.getElementById('userInput')

    if (cmd.setSelectionRange) {
      var len = GemWarrior.dom.userInput.val().length * 2

      setTimeout(function() {
        cmd.setSelectionRange(len, len)
      }, 1)
    } else {
      GemWarrior.dom.userInput.val(GemWarrior.dom.userInput.val())
    }
  }
}

// get a filtered list of the player's command history
GemWarrior._getHistoryDisplay = function() {
  return `<strong>Command history</strong>: ${GemWarrior.config.history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
}

// display welcome message
GemWarrior._welcome = function() {
  GemWarrior._out('************************')
  GemWarrior._out('Welcome to Gem Warrior!')
  GemWarrior._out('')
  GemWarrior._out('Try <span class="keyword">help</span> if stuck')
  GemWarrior._out('')
  GemWarrior._out('<strong>Good luck...</strong>')
  GemWarrior._out('************************')
}

// play cute song
GemWarrior._playSong = function() {
  if (GemWarrior.settings.playSound) {
    GemWarrior.config.synth.send([0x90, 60, 100])
    setTimeout(() => GemWarrior.config.synth.send([0x80, 60, 0]), 500)
    setTimeout(() => GemWarrior.config.synth.send([0x90, 60, 100]), 500)
    setTimeout(() => GemWarrior.config.synth.send([0x90, 62, 100]), 1000)
    setTimeout(() => GemWarrior.config.synth.send([0x90, 64, 100]), 1500)
    setTimeout(() => GemWarrior.config.synth.send([0x90, 67, 100]), 2000)
  } else {
    return 'The <span class="keyword">playSound</span> setting is currently disabled'
  }
}

// shuttle avatar display workload to web worker
GemWarrior.config.avatar._initAvatarDisplay = function() {
  if (window.Worker) {
    GemWarrior.config.avatarWorker = new Worker('assets/js/app/avatar.js')

    GemWarrior.config.avatarWorker.onmessage = (response) => {
      $('#avatar').html(response.data)
    }
  }
}
GemWarrior.config.avatar._getAvatarDisplay = function(status) {
  if (GemWarrior.config.avatarWorker) {
    if (GemWarrior.settings.showAvatar) {
      GemWarrior.config.avatarWorker.postMessage(status)

      GemWarrior.config.avatar._playerStand()
    }
  } else {
    console.error('no GemWarrior.config.avatarWorker to postMessage')
  }
}
GemWarrior.config.avatar._playerStand = function() {
  GemWarrior.config.player.status = 'standing'
  GemWarrior.config.avatar._getAvatarDisplay('standing')
  GemWarrior.config.avatar._playerBlink()
}
GemWarrior.config.avatar._playerSit = function() {
  GemWarrior.config.player.status = 'sitting'
  GemWarrior.config.avatar._getAvatarDisplay('sitting')
  GemWarrior.config.avatar._playerBlink()
}
GemWarrior.config.avatar._playerRecline = function() {
  reclineTimer = null

  if (GemWarrior.config.player.status === 'reclining') {
    clearInterval(GemWarrior.config.blinker)
    GemWarrior.config.avatar._getAvatarDisplay('reclining1')
    reclineTimer = setTimeout(() => {
      GemWarrior.config.avatar._getAvatarDisplay('reclining2')
      setTimeout(() => {
        GemWarrior.config.avatar._getAvatarDisplay('reclining3')
        setTimeout(() => _playerRecline(), 1000)
      }, 1000)
    }, 1000)
  }
}
GemWarrior.config.avatar._playerBlink = function() {
  clearInterval(GemWarrior.config.blinker)

  if (GemWarrior.config.player.status === 'standing') {
    GemWarrior.config.blinker = setInterval(() => {
      GemWarrior.config.avatar._getAvatarDisplay('standing-blink')
      setTimeout(() => GemWarrior.config.avatar._getAvatarDisplay('standing'), GemWarrior.config.avatar._getBlinkSpeed())
    }, GemWarrior.config.avatar._getBlinkFreq())
  }
  else if (GemWarrior.config.player.status === 'sitting') {
    GemWarrior.config.blinker = setInterval(() => {
      _getAvatarDisplay('sitting-blink')
      setTimeout(() => GemWarrior.config.avatar._getAvatarDisplay('sitting'), GemWarrior.config.avatar._getBlinkSpeed())
    }, GemWarrior.config.avatar._getBlinkFreq())
  }
}
GemWarrior.config.avatar._getBlinkFreq = function() {
  var min = 2000
  var max = 20000

  return Math.floor(Math.random() * (max - min + 1) + min)
}
GemWarrior.config.avatar._getBlinkSpeed = function() {
  var min = 100
  var max = 600

  return Math.floor(Math.random() * (max - min + 1) + min)
}

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior.initApp
