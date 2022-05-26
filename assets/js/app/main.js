/* main */
/* app entry point and main functions */
/* global $, GemWarrior */

GemWarrior.settings = {
  'playSound': false,
  'showAvatar': false
}

GemWarrior.player = {
  'level': 1,
  'xp': 0,
  'hp': 10,
  'rox': 2,
  'status': 'standing',
  'inventory': [
    'broken flashlight',
    'candlestick holder'
  ]
}

GemWarrior.avatar = {}

GemWarrior.blinker = null
GemWarrior.history = []
GemWarrior.historyMarker = 0
GemWarrior.keyCommand = ''
GemWarrior.text = ''
GemWarrior.avatarWorker = null
GemWarrior.synth = null

/*************************************************************************
 * public methods *
 *************************************************************************/

async function modalOpen(type) {
  switch(type) {
    case 'help':
      GemWarrior.repl(GemWarrior.evaluator('help'))
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
                  <div id="button-setting-play-sound" data-status="" class="switch" onclick="changeSetting('playSound')">
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
                  <div id="button-setting-show-avatar" data-status="" class="switch" onclick="changeSetting('showAvatar')">
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

      GemWarrior.loadGlobalSettings()

      break
  }
}

// save a setting to localStorage
GemWarrior.saveGlobalSetting = function(setting, value) {
  // console.log('saving setting to LS...', setting, value)

  var settings = JSON.parse(localStorage.getItem(LS_SETTINGS_KEY))

  // set temp obj that will go to LS
  settings[setting] = value
  // set internal code model
  GemWarrior.settings[setting] = value

  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings))

  // console.log('!global setting saved!', GemWarrior.settings)
}
GemWarrior.loadGlobalSettings = function() {
  if (localStorage.getItem(LS_SETTINGS_KEY)) {
    var lsConfig = JSON.parse(localStorage.getItem(LS_SETTINGS_KEY))

    if (lsConfig) {
      if (lsConfig.playSound) {
        GemWarrior.settings.playSound = lsConfig.playSound

        var setting = document.getElementById('settings-play-sound')

        if (setting) {
          setting.dataset.status = 'true'
        }
      }

      if (lsConfig.showAvatar) {
        GemWarrior.settings.showAvatar = lsConfig.showAvatar

        var setting = document.getElementById('settings-show-avatar')

        if (setting) {
          setting.dataset.status = 'true'
        }
      }
    }
  }
}

// update user stats and send command result to display function
GemWarrior.repl = function(result) {
  GemWarrior._updateStatus()
  GemWarrior.out(result)
}

// print result of user command
GemWarrior.out = function(text, lineBreak) {
  let $content_to_display = text

  if (!lineBreak) {
    $content_to_display += '<br />'
  }

  GemWarrior.dom.output.append($content_to_display)

  GemWarrior._scrollOutput()
}

// process the user command input
GemWarrior.evaluator = function(command) {
  console.log('command', command)

  GemWarrior.history.push(command)
  GemWarrior.historyMarker = GemWarrior.history.length

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
      GemWarrior.text = `You go somewhere else inescapable in the <span class='noun'>${LOCATION.title}</span>.`

      break
    case 'north':
    case 'n':
      GemWarrior.text = `You go <strong>north</strong> a bit. You are still in an inescapable hole.`

      break
    case 'west':
    case 'w':
      GemWarrior.text = `You go <strong>west</strong> a bit. You are still in an inescapable hole.`

      break
    case 'south':
    case 's':
      GemWarrior.text = `You go <strong>south</strong> a bit. You are still in an inescapable hole.`

      break
    case 'east':
    case 'e':
      GemWarrior.text = `You go <strong>east</strong> a bit. You are still in an inescapable hole.`
      break

    case 'look':
    case 'l':
      GemWarrior.text = `You look around the <span class='noun'>${LOCATION.title}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`

      if (LOCATION.objects.length > 0) {
        GemWarrior.text += '<br /><br />'

        GemWarrior.text += `There are things to pick up here: <span class="noun">${LOCATION.objects.join(', ')}</span>`
      }

      break

    case 'character':
    case 'char':
    case 'c':
      GemWarrior.text = `You assess yourself: wearing a shirt, pants, socks, and shoes, your fashion sense is satisfactory, without being notable.<br />
      <p>You are <strong>${GemWarrior.player.status}</strong>.</p>
      You are reasonably healthy, but due to your current location and station, that feeling of heartiness diminishes as your hunger increases.`

      break

    case 'inventory':
    case 'inven':
    case 'inv':
    case 'i':
      if (GemWarrior.player.rox === 1) {
        roxCount = ' <strong>1</strong> rock'
      } else {
        roxCount = ` <strong>${GemWarrior.player.rox}</strong> rox`
      }

      playerInv = ''
      GemWarrior.player.inventory.forEach((thing) => {
        playerInv += `<span class="noun">a ${thing}</span>, `
      })

      if (GemWarrior.player.inventory.length !== 0) {
        GemWarrior.text = `You have the clothes on your back, ${playerInv} <span class="noun">${roxCount}</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".`
      } else {
        GemWarrior.text = `You have nothing on your person except the clothes on your back and ${roxCount}`
      }

      break

    case 'pickup':
    case 'p':
      if (subj) {
        if (subj === 'rock' && LOCATION.objects.includes('rock')) {
          GemWarrior.text = 'You pick up a <span class="noun">rock</span>.'

          LOCATION.objects.splice(LOCATION.objects.indexOf('rock'), 1)
          GemWarrior.player.rox++
        } else {
          GemWarrior.text = 'That object is not present, so picking it up is going to be difficult.'
        }
      } else {
        GemWarrior.text = `Since you did not indicate <strong>what</strong> to pick up, you bend down momentarily and attempt to pick up some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
      }

      break
    case 'throw':
    case 'th':
      if (GemWarrior.player.rox > 0) {
        GemWarrior.player.rox--

        LOCATION.objects.push('rock')

        GemWarrior.text = 'You throw a <span class="noun">rock</span> on the ground, because that is definitely a productive move.'
      } else {
        GemWarrior.text = 'You have no <span class="noun">rox</span> to throw, so your hand just makes the motion with no effect, sadly.'
      }

      break

    case 'use':
    case 'u':
      if (subj) {
        if (GemWarrior.player.inventory.includes(subj)) {
          GemWarrior.text = `You use the <span class="keyword">${subj}</span> from your inventory. Unfortunately, nothing interesting happens because item usage has not been coded yet.`
        } else {
          GemWarrior.text = `You don't have a <span class="keyword">${subj}</span>, let alone <em>the</em> <span class="keyword">${subj}</span>, so...well, nothing happens.`
        }
      } else {
        GemWarrior.text = `Use <em>what</em>, exactly?`
      }

      break

    case 'sit':
    case 'si':
      if (GemWarrior.player.status === 'sitting') {
        GemWarrior.text = `You are already ${GemWarrior.player.status}.`
      } else {
        GemWarrior.player.status = 'sitting'
        GemWarrior.avatar._playerSit()
        GemWarrior.text = 'You sit down.'
      }

      break
    case 'stand':
    case 'st':
      if (GemWarrior.player.status === 'standing') {
        GemWarrior.text = `You are already ${GemWarrior.player.status}.`
      } else {
        GemWarrior.player.status = 'standing'
        GemWarrior.avatar._playerStand()
        GemWarrior.text = 'You stand up.'
      }

      break
    case 'sleep':
    case 'sl':
      GemWarrior.player.status = 'reclining'
      GemWarrior.avatar._playerRecline()

      GemWarrior.text = 'You lie down to rest.'

      break

    case 'playsong':
    case 'pl':
      GemWarrior._playSong()

      if (GemWarrior.settings.playSound) {
        GemWarrior.text = 'Playing the song of my people...'
      } else {
        GemWarrior.text = `Sound is not enabled. Try <span class="keyword">settings playSound</span>.`
      }

      break;

    case 'help':
    case 'h':
    case '?':
      GemWarrior.text = GemWarrior._displayHelp()

      break

    case 'history':
    case 'hist':
      GemWarrior.text = GemWarrior._getHistoryDisplay()

      break

    case 'about':
    case 'a':
      GemWarrior.text = `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info' target='_blank'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior' target='_blank'>Gem Warrior</a>, a <a class='glow-transition' href='https://rubygems.org' target='_blank'>Ruby gem</a> (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")<br /><br />

      <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`

      break

    case 'settings':
    case 'sett':
      if (subj) {
        switch (subj) {
          case 'playsound':
            GemWarrior.settings.playSound = !GemWarrior.settings.playSound

            if (GemWarrior.settings.playSound) {
              GemWarrior.synth = new WebAudioTinySynth()

              GemWarrior.text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword true">${GemWarrior.settings.playSound}</span>.`
            } else {
              GemWarrior.synth = null

              GemWarrior.text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword false">${GemWarrior.settings.playSound}</span>.`
            }

            break
          case 'showavatar':
            GemWarrior.settings.showAvatar = !GemWarrior.settings.showAvatar

            if (!GemWarrior.settings.showAvatar) {
              GemWarrior.text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword false">${GemWarrior.settings.showAvatar}</span>.`

              $('#avatar').html('')
            } else {
              GemWarrior.text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword true">${GemWarrior.settings.showAvatar}</span>.`

              GemWarrior.avatar._getAvatarDisplay(GemWarrior.player.status)
            }
            break
          default:
            GemWarrior.text = `There is no current setting with the name <span class="keyword">${subj}.`
        }
      } else {
        GemWarrior.text = `<code>${JSON.stringify(GemWarrior.settings, null, 2)}</code>`
      }

      break

    default:
      GemWarrior.text = 'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

      break
  }

  return GemWarrior.text
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

GemWarrior._initApp = function() {
  // set env
  GemWarrior.env = ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

  if (GemWarrior.env == 'local') {
    GemWarrior._initDebug()

    document.title = '(LH) ' + document.title
  }

  GemWarrior._attachEventHandlers()

  GemWarrior._updateStatus()

  GemWarrior._welcome()

  GemWarrior.avatar._initAvatarDisplay()

  GemWarrior._resizeFixed()

  // initial command
  window.scrollTo(0,1)
}

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
      GemWarrior.out('')
      GemWarrior.out(`<span class="command-previous">&gt; ${GemWarrior.keyCommand}`)
      GemWarrior.out(GemWarrior.evaluator(GemWarrior.keyCommand))

      GemWarrior.keyCommand = ''
      GemWarrior.dom.keyboardInput.removeClass('show')
    } else if (key == '<') {
      if (GemWarrior.keyCommand.length) {
        GemWarrior.keyCommand = GemWarrior.keyCommand.slice(0, GemWarrior.keyCommand.length - 1)

        if (!GemWarrior.keyCommand) {
          GemWarrior.dom.keyboardInput.removeClass('show')
        }
      }
    } else {
      GemWarrior.keyCommand += key

      GemWarrior.dom.keyboardInput.addClass('show')
    }

    // add keyCommand to visual keyboardInput bubble
    GemWarrior.dom.keyboardInput.text(GemWarrior.keyCommand)
  })

  // catch the command bar form
  $('#cli form').submit(function (e) {
    e.preventDefault()

    const input = $('#userInput').val()

    console.log('input', input)

    // show last entered command
    GemWarrior.out('')
    GemWarrior.out(`<span class="command-previous">&gt; ${input}</span>`)

    // evaluate command
    GemWarrior.repl(GemWarrior.evaluator(input))

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

// display command list
GemWarrior._displayHelp = function() {
  var cmdList = ''

  Object.keys(COMMANDS).forEach((key) => {
    cmdList += `<br />&nbsp;${key}:<br />&nbsp;&nbsp;<span class="keyword">${COMMANDS[key].join(', ')}</span><br />`
  })

  return `HELP: The following commands are valid: ${cmdList}`
}

// update DOM stats
GemWarrior._updateStatus = function() {
  GemWarrior.dom.statsLV.text(GemWarrior.player.level)
  GemWarrior.dom.statsXP.text(GemWarrior.player.xp)
  GemWarrior.dom.statsHP.text(GemWarrior.player.hp)
  GemWarrior.dom.statsROX.text(GemWarrior.player.rox)
  GemWarrior.dom.statsLOC.text(LOCATION.title)
}

GemWarrior._resizeFixed = function() {
  console.log('resized fixed elements')

  $('header').width(window.innerWidth - 32)
  $('#spacer').height($('#interface').height() - 2)
  $('#interface #keyboard').width(window.innerWidth - 16)
}

// dynamically scroll output depending on height
GemWarrior._scrollOutput = function() {
  const outputHeight = GemWarrior.dom.output.height()
  const interfaceHeight = GemWarrior.dom.interface.height()

  // console.log('outputHeight - interfaceHeight', outputHeight - interfaceHeight)
  // console.log('window.innerHeight', window.innerHeight)

  if ((outputHeight * 2 - interfaceHeight) > window.innerHeight) {
    const newY = window.innerHeight * 4

    window.scrollTo(0, newY)

    console.log(`scrolled to ${newY}`)
  }
}

// replace the command bar's command with historic data if available
GemWarrior._traverseHistory = function(key) {
  const up = 38

  if (GemWarrior.history.length > 0) {
    if (key === up) { // up, or "back", or "prev cmd"
      if (GemWarrior.historyMarker > 0) {
        GemWarrior.historyMarker--
      }
    } else { // down, or "forward", or "next most recent cmd"
      if (GemWarrior.historyMarker < GemWarrior.history.length) {
        GemWarrior.historyMarker++
      } else { // back to current untyped-as-of-yet command
        GemWarrior.dom.userInput.val()
        GemWarrior.historyMarker = GemWarrior.history.length
      }
    }

    // set command bar to historical value
    GemWarrior.dom.userInput.val(GemWarrior.history[GemWarrior.historyMarker])

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
  return `<strong>Command history</strong>: ${GemWarrior.history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
}

// display welcome message
GemWarrior._welcome = function() {
  GemWarrior.out('************************')
  GemWarrior.out('Welcome to Gem Warrior!')
  GemWarrior.out('')
  GemWarrior.out('Try <span class="keyword">help</span> if stuck')
  GemWarrior.out('')
  GemWarrior.out('<strong>Good luck...</strong>')
  GemWarrior.out('************************')
}

// play cute song
GemWarrior._playSong = function() {
  if (GemWarrior.settings.playSound) {
    GemWarrior.synth.send([0x90, 60, 100])
    setTimeout(() => GemWarrior.synth.send([0x80, 60, 0]), 500)
    setTimeout(() => GemWarrior.synth.send([0x90, 60, 100]), 500)
    setTimeout(() => GemWarrior.synth.send([0x90, 62, 100]), 1000)
    setTimeout(() => GemWarrior.synth.send([0x90, 64, 100]), 1500)
    setTimeout(() => GemWarrior.synth.send([0x90, 67, 100]), 2000)
  } else {
    return 'The <span class="keyword">playSound</span> setting is currently disabled'
  }
}

// shuttle avatar display workload to web worker
GemWarrior.avatar._initAvatarDisplay = function() {
  if (window.Worker) {
    GemWarrior.avatarWorker = new Worker('assets/js/app/avatar.js')

    GemWarrior.avatarWorker.onmessage = (response) => {
      $('#avatar').html(response.data)
    }
  }
}
GemWarrior.avatar._getAvatarDisplay = function(status) {
  if (GemWarrior.avatarWorker) {
    if (GemWarrior.settings.showAvatar) {
      GemWarrior.avatarWorker.postMessage(status)

      GemWarrior.avatar._playerStand()
    }
  } else {
    console.error('no GemWarrior.avatarWorker to postMessage')
  }
}
GemWarrior.avatar._playerStand = function() {
  GemWarrior.player.status = 'standing'
  GemWarrior.avatar._getAvatarDisplay('standing')
  GemWarrior.avatar._playerBlink()
}
GemWarrior.avatar._playerSit = function() {
  GemWarrior.player.status = 'sitting'
  GemWarrior.avatar._getAvatarDisplay('sitting')
  GemWarrior.avatar._playerBlink()
}
GemWarrior.avatar._playerRecline = function() {
  reclineTimer = null

  if (GemWarrior.player.status === 'reclining') {
    clearInterval(GemWarrior.blinker)
    GemWarrior.avatar._getAvatarDisplay('reclining1')
    reclineTimer = setTimeout(() => {
      GemWarrior.avatar._getAvatarDisplay('reclining2')
      setTimeout(() => {
        GemWarrior.avatar._getAvatarDisplay('reclining3')
        setTimeout(() => _playerRecline(), 1000)
      }, 1000)
    }, 1000)
  }
}
GemWarrior.avatar._playerBlink = function() {
  clearInterval(GemWarrior.blinker)

  if (GemWarrior.player.status === 'standing') {
    GemWarrior.blinker = setInterval(() => {
      GemWarrior.avatar._getAvatarDisplay('standing-blink')
      setTimeout(() => GemWarrior.avatar._getAvatarDisplay('standing'), GemWarrior.avatar._getBlinkSpeed())
    }, GemWarrior.avatar._getBlinkFreq())
  }
  else if (GemWarrior.player.status === 'sitting') {
    GemWarrior.blinker = setInterval(() => {
      _getAvatarDisplay('sitting-blink')
      setTimeout(() => GemWarrior.avatar._getAvatarDisplay('sitting'), GemWarrior.avatar._getBlinkSpeed())
    }, GemWarrior.avatar._getBlinkFreq())
  }
}
GemWarrior.avatar._getBlinkFreq = function() {
  var min = 2000
  var max = 20000

  return Math.floor(Math.random() * (max - min + 1) + min)
}
GemWarrior.avatar._getBlinkSpeed = function() {
  var min = 100
  var max = 600

  return Math.floor(Math.random() * (max - min + 1) + min)
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

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior._initApp
