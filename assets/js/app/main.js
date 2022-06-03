﻿/* main */
/* app entry point and main functions */
/* global $, GemWarrior */

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {
  'textSize': '16',
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
      GemWarrior._repl(`
        <br />
        <span class="command-previous">&gt; help</span><br />
        ${GemWarrior._evaluator('help')}
      `)
      break

    case 'settings':
      this.myModal = new Modal('perm', 'Settings',
        `
          <div id="settings">
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
            <!-- play sound -->
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

  GemWarrior._resizeFixed()

  GemWarrior.__displayWelcome()

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
    if (lsSettings.textSize) {
      GemWarrior.settings.textSize = lsSettings.textSize

      $('#output').css('font-size', GemWarrior.settings.textSize + 'px')

      var setting = document.getElementById('text-size-pixels')

      if (setting) {
        setting.value = lsSettings.textSize
      }
    }

    if (lsSettings.playSound) {
      GemWarrior.settings.playSound = lsSettings.playSound

      var setting = document.getElementById('button-setting-play-sound')

      if (setting) {
        setting.dataset.status = 'true'
      }
    }

    if (lsSettings.showAvatar) {
      GemWarrior.settings.showAvatar = lsSettings.showAvatar

      if (GemWarrior.settings.showAvatar) {
        if (!GemWarrior.config.avatarWorker) {
          GemWarrior._initAvatarWorker()
          GemWarrior._avatarStand()
        }
      }

      var setting = document.getElementById('button-setting-show-avatar')

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
    case 'textSize':
      var st = document.getElementById('text-size-pixels').value

      if (st != '') {
        // sync to DOM
        $('#output').css('font-size', st + 'px')

        // save to code/LS
        GemWarrior._saveSetting('textSize', st)
      }
      break

    case 'playSound':
      var st = document.getElementById('button-setting-play-sound')

      if (st) {
        st = st.dataset.status

        if (st == '' || st == 'false') {
          // update setting DOM
          document.getElementById('button-setting-play-sound').dataset.status = 'true'

          // initialize synth instance
          GemWarrior.config.synth = new WebAudioTinySynth()

          // save to code/LS
          GemWarrior._saveSetting('playSound', true)
        } else {
          // update setting DOM
          document.getElementById('button-setting-play-sound').dataset.status = 'false'

          // destory synth instance
          GemWarrior.config.synth = null

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

          if (!GemWarrior.config.avatarWorker) {
            GemWarrior._initAvatarWorker()
            GemWarrior._avatarStand()
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

    // console.log('key', key)

    if (key == '↵') {
      GemWarrior.__handleEnter()
    } else if (key == '<') {
      GemWarrior.__handleBackspace()
    } else {
      // update keyCommand
      GemWarrior.config.keyCommand += key

      // make sure DOM display is visible
      GemWarrior.dom.interactive.keyboardInput.addClass('show')
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
        GemWarrior._avatarSit()
        GemWarrior.config.text = 'You sit down.'
      }

      break
    case 'stand':
    case 'st':
      if (GemWarrior.config.player.status === 'standing') {
        GemWarrior.config.text = `You are already ${GemWarrior.config.player.status}.`
      } else {
        GemWarrior.config.player.status = 'standing'
        GemWarrior._avatarStand()
        GemWarrior.config.text = 'You stand up.'
      }

      break
    case 'sleep':
    case 'sl':
      GemWarrior.config.player.status = 'reclining'
      GemWarrior._avatarRecline()

      GemWarrior.config.text = 'You lie down to rest.'

      break

    case 'playsong':
    case 'pl':
      GemWarrior._playSong()

      if (GemWarrior.settings.playSound) {
        GemWarrior.config.text = 'Playing the song of my people...'
      } else {
        GemWarrior.config.text = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
      }

      break;

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

// shuttle avatar display workload to Web Worker
GemWarrior._initAvatarWorker = function() {
  if (window.Worker) {
    // console.log('creating new web worker for avatar')

    // Web Worker created from file
    GemWarrior.config.avatarWorker = new Worker('assets/js/app/avatar.js')

    if (GemWarrior.config.avatarWorker) {
      // console.log('avatarWorker created successfully')

      // attach event listener to process successful Web Worker responses
      GemWarrior.config.avatarWorker.onmessage = (response) => {
        GemWarrior.dom.avatar.html(response.data)
      }

      // initialize data into CacheStorage, if needed
      GemWarrior.config.avatarWorker.postMessage({ command: 'init' })

      // get initial player avatar display
      GemWarrior._getAvatarDisplay(GemWarrior.config.player.status)
    } else {
      console.error('Web Worker creation failed')
    }
  } else {
    console.error('Web Workers not available', error)
  }
}

GemWarrior._getAvatarDisplay = function(type) {
  // is this setting enabled?
  if (GemWarrior.settings.showAvatar) {
    // do we have a valid Web Worker?
    if (GemWarrior.config.avatarWorker) {
      // console.log('sending a message to avatarWorker', )

      // tell Web Worker which data we want via status key
      GemWarrior.config.avatarWorker.postMessage({ command: 'status', value: type })
    } else {
      console.error('no valid Web Worker to postMessage')
    }
  }
}

GemWarrior._avatarStand = function() {
  GemWarrior.config.player.status = 'standing'
  GemWarrior._getAvatarDisplay('standing')
  GemWarrior._avatarBlink()
}
GemWarrior._avatarSit = function() {
  GemWarrior.config.player.status = 'sitting'
  GemWarrior._getAvatarDisplay('sitting')
  GemWarrior._avatarBlink()
}
GemWarrior._avatarRecline = function() {
  reclineTimer = null

  if (GemWarrior.config.player.status === 'reclining') {
    clearInterval(GemWarrior.config.blinker)
    GemWarrior._getAvatarDisplay('reclining1')
    reclineTimer = setTimeout(() => {
      GemWarrior._getAvatarDisplay('reclining2')
      setTimeout(() => {
        GemWarrior._getAvatarDisplay('reclining3')
        setTimeout(() => GemWarrior._avatarRecline(), 1000)
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
    // console.log('destroying web worker for avatar')

    GemWarrior.config.avatarWorker = null

    GemWarrior.dom.avatar.html('')
  } else {
    console.error('could not destroy avatar', error)
  }
}

/************************************************************************
 * _private __helper methods *
 ************************************************************************/

GemWarrior.__handleEnter = function() {
  if (GemWarrior.config.keyCommand.length > 0) {
    // display last command and then evaluate and output
    const input = GemWarrior.config.keyCommand

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
    GemWarrior.dom.cmdInput.val(GemWarrior.config.history[GemWarrior.config.historyMarker])

    // move cursor to end of value
    var cmd = GemWarrior.dom.interactive.cmdInput

    if (cmd.setSelectionRange) {
      var len = GemWarrior.dom.interactive.cmdInput.val().length * 2

      setTimeout(function() {
        cmd.setSelectionRange(len, len)
      }, 1)
    } else {
      GemWarrior.dom.interactive.cmdInput.val(GemWarrior.dom.interactive.cmdInput.val())
    }
  }
}

// get a filtered list of the player's command history
GemWarrior.__getHistoryDisplay = function() {
  return `<strong>Command history</strong>: ${GemWarrior.config.history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
}

// display welcome message
GemWarrior.__displayWelcome = function() {
  GemWarrior.dom.output.append(`
    ************************<br />
    Welcome to Gem Warrior!<br />
    Try <span class="keyword">help</span> if stuck<br />
    <strong>Good luck...</strong><br />
    ************************
  `)
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

/*************************************************************************
 * START THE ENGINE *
 *************************************************************************/

window.onload = GemWarrior.initApp
