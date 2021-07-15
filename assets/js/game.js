$(function () {
  let game = {
    'settings': {
      'playSound': false,
      'showAvatar': true
    }
  }
  let player = {
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
  let blinker = null
  let history = []
  let historyMarker = 0
  let text
  let avatarWorker
  let synth

  $cmd = $('#userInput')

  const commands = [
    '(g)o',
    '(n)orth',
    '(e)ast',
    '(s)outh',
    '(w)est',
    '(l)ook',
    '(c)haracter',
    '(i)nventory',
    '(p)ickup',
    '(th)row',
    '(si)t',
    '(st)and',
    '(sl)eep',
    '(pl)ay song',
    '(h)elp',
    '(hist)ory',
    '(a)bout',
    '(set)tings'
  ]
  const loc = {
    'title': 'Inescapable Hole of Turbidity',
    'objects': ['rock']
  }

  // game screen shortcut variables
  const $display = $('#output')
  // const $stats = $('#stats')
  const $statsLV = $('#stats #level')
  const $statsXP = $('#stats #xp')
  const $statsROX = $('#stats #rox')
  const $statsHP = $('#stats #hp')
  const $statsLOC = $('#location #loc')

  // const $keyboard = $('#keyboard')
  // const $controller = $('#controller')


  // update user stats and send command result to display function
  function repl(result) {
    updateStatus(player.level, player.xp, player.hp, player.rox, loc)
    out(result)
  }

  // print result of user command
  function out(text, lb) {
    let $content_to_display = text

    if (!lb) {
      $content_to_display += '<br />'
    }
    $display.append($content_to_display)

    if ($display.height() * 2 > window.innerHeight) {
      window.scrollTo(0, window.innerHeight * 4)
    }
  }

  function updateStatus(level, xp, hp, rox, loc) {
    $statsLV.text(level)
    $statsXP.text(xp)
    $statsHP.text(hp)
    $statsROX.text(rox)
    $statsLOC.text(loc.title)
  }

  // process the user command input
  function evaluator(command) {
    history.push(command)
    historyMarker = history.length

    let cmds = command.split(' ')

    let verb = cmds[0].toLowerCase()
    let subj = cmds[1] ? cmds[1].toLowerCase() : null

    console.log('v+s:', `${verb} ${subj}`)

    switch (verb) {
      case 'go':
      case 'g':
        text = `You go somewhere else inescapable in the <span class='noun'>${loc.title}</span>.`

        break
      case 'north':
      case 'n':
        text = `You go <strong>north</strong> a bit. You are still in an inescapable hole.`

        break
      case 'west':
      case 'w':
        text = `You go <strong>west</strong> a bit. You are still in an inescapable hole.`

        break
      case 'south':
      case 's':
        text = `You go <strong>south</strong> a bit. You are still in an inescapable hole.`

        break
      case 'east':
      case 'e':
        text = `You go <strong>east</strong> a bit. You are still in an inescapable hole.`
        break

      case 'look':
      case 'l':
        text = `You look around the <span class='noun'>${loc.title}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`

        if (loc.objects.length > 0) {
          text += '<br /><br />'

          text += `There are things to pick up here: <span class="noun">${loc.objects.join(', ')}</span>`
        }

        break

      case 'character':
      case 'char':
      case 'c':
        text = `You assess yourself: wearing a shirt, pants, socks, and shoes, your fashion sense is satisfactory, without being notable.<br />
        <p>You are <strong>${player.status}</strong>.</p>
        You are reasonably healthy, but due to your current location and station, that feeling of heartiness diminishes as your hunger increases.`

        break

      case 'inventory':
      case 'inven':
      case 'i':
        if (player.rox === 1) {
          roxCount = ' <strong>1</strong> rock'
        } else {
          roxCount = ` <strong>${player.rox}</strong> rox`
        }

        playerInv = ''
        player.inventory.forEach((thing) => {
          playerInv += `<span class="noun">a ${thing}</span>, `
        })

        if (player.inventory.length !== 0) {
          text = `You have the clothes on your back, ${playerInv} <span class="noun">${roxCount}</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".`
        } else {
          text = `You have nothing on your person except the clothes on your back and ${roxCount}`
        }

        break

      case 'pickup':
      case 'p':
        if (subj) {
          if (subj === 'rock' && loc.objects.includes('rock')) {
            text = 'You pick up a <span class="noun">rock</span>.'

            loc.objects.splice(loc.objects.indexOf('rock'), 1)
            player.rox++
          } else {
            text = 'That object is not present, so picking it up is going to be difficult.'
          }
        } else {
          text = `Since you did not indicate <strong>what</strong> to pick up, you bend down momentarily and attempt to pick up some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
        }

        break
      case 'throw':
      case 'th':
        if (player.rox > 0) {
          player.rox--

          loc.objects.push('rock')

          text = 'You throw a <span class="noun">rock</span> on the ground, because that is definitely a productive move.'
        } else {
          text = 'You have no <span class="noun">rox</span> to throw, so your hand just makes the motion with no effect, sadly.'
        }

        break

      case 'sit':
      case 'si':
        if (player.status === 'sitting') {
          text = `You are already ${player.status}.`
        } else {
          player.status = 'sitting'
          _playerSit()
          text = 'You sit down.'
        }

        break
      case 'stand':
      case 'st':
        if (player.status === 'standing') {
          text = `You are already ${player.status}.`
        } else {
          player.status = 'standing'
          _playerStand()
          text = 'You stand up.'
        }

        break
      case 'sleep':
      case 'sl':
        player.status = 'reclining'
        _playerRecline()

        text = 'You lie down to rest.'

        break

      case 'playsong':
      case 'pl':
        _playSong()

        text = 'Playing the song of my people...'

        break;

      case 'help':
      case 'h':
      case '?':
        text = `HELP: The following commands are valid: <span class="keyword">${commands.join(', ')}</span>`

        break

      case 'history':
      case 'hist':
        text = _getHistoryDisplay()

        break

      case 'about':
      case 'a':
        text = `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info' target='_blank'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior' target='_blank'>Gem Warrior</a>, a <a class='glow-transition' href='https://rubygems.org' target='_blank'>Ruby gem</a> (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")<br /><br />

        <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`

        break

      case 'settings':
      case 'sett':
        if (subj) {
          switch (subj) {
            case 'playsound':
              game.settings.playSound = !game.settings.playSound

              if (game.settings.playSound) {
                synth = new WebAudioTinySynth()

                text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword true">${game.settings.playSound}</span>.`
              } else {
                synth = null

                text = `Toggling the <span class="keyword">playSound</span> setting to <span class="keyword false">${game.settings.playSound}</span>.`
              }

              break
            case 'showavatar':
              game.settings.showAvatar = !game.settings.showAvatar

              if (!game.settings.showAvatar) {
                text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword false">${game.settings.showAvatar}</span>.`

                $('#avatar').html('')
              } else {
                text = `Toggling the <span class="keyword">showAvatar</span> setting to <span class="keyword true">${game.settings.showAvatar}</span>.`

                _getAvatarDisplay(player.status)
              }
              break
            default:
              text = `There is no current setting with the name <span class="keyword">${subj}.`
          }
        } else {
          text = `<code>${JSON.stringify(game.settings, null, 2)}</code>`
        }

        break

      default:
        text = 'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

        break
    }

    return text
  }

  // replace the command bar's command with historic data if available
  function _traverseHistory(key) {
    const up = 38

    if (history.length > 0) {
      if (key === up) { // up, or "back", or "prev cmd"
        if (historyMarker > 0) {
          historyMarker--
        }
      } else { // down, or "forward", or "next most recent cmd"
        if (historyMarker < history.length) {
          historyMarker++
        } else { // back to current untyped-as-of-yet command
          $cmd.val()
          historyMarker = history.length
        }
      }

      // set command bar to historical value
      $cmd.val(history[historyMarker])

      // move cursor to end of value
      var cmd = document.getElementById('userInput')

      if (cmd.setSelectionRange) {
        var len = $cmd.val().length * 2

        setTimeout(function() {
          cmd.setSelectionRange(len, len)
        }, 1)
      } else {
        $cmd.val($cmd.val())
      }
    }
  }

  function _applyEventHandlers() {
    // catch the mobile buttons form
    $('button').click(function (event) {
      const command = event.target.dataset.command
      out('')
      out(`<span class="command-previous">&gt; ${command}`)
      out(evaluator(command))
    })

    // catch the command bar form
    $('#input form').submit(function (e) {
      e.preventDefault()

      const input = $('#userInput').val()

      // show last entered command
      out('')
      out(`<span class="command-previous">&gt; ${input}</span>`)

      // evaluate command
      const result = evaluator(input)
      repl(result)

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
        _traverseHistory(event.keyCode)
      }
    })

    $(document).on('touchmove', function(event) {
      event = event.originalEvent || event
      if (event.scale !== 1) {
        event.preventDefault()
      }
    }, false)

    _initAvatarDisplay()
  }

  // shuttle avatar display workload to web worker
  function _initAvatarDisplay() {
    if (window.Worker) {
      avatarWorker = new Worker('assets/js/avatar.js')

      avatarWorker.onmessage = (response) => {
        $('#avatar').html(response.data)
      }
    }
  }

  function _getAvatarDisplay(status) {
    if (avatarWorker) {
      if (game.settings.showAvatar) {
        avatarWorker.postMessage(status)
      }
    } else {
      console.error('no avatarWorker to postMessage')
    }
  }

  // get a filtered list of the player's command history
  function _getHistoryDisplay() {
    return `<strong>Command history</strong>: ${history.filter((w) => !['hist', 'history'].includes(w)).join(', ')}`
  }

  function _playerStand() {
    player.status = 'standing'
    _getAvatarDisplay('standing')
    _playerBlink()
  }

  function _playerSit() {
    player.status = 'sitting'
    _getAvatarDisplay('sitting')
    _playerBlink()
  }

  function _playerRecline() {
    reclineTimer = null

    if (player.status === 'reclining') {
      clearInterval(blinker)
      _getAvatarDisplay('reclining1')
      reclineTimer = setTimeout(() => {
        _getAvatarDisplay('reclining2')
        setTimeout(() => {
          _getAvatarDisplay('reclining3')
          setTimeout(() => _playerRecline(), 1000)
        }, 1000)
      }, 1000)
    }
  }

  function _playerBlink() {
    clearInterval(blinker)

    if (player.status === 'standing') {
      blinker = setInterval(() => {
        _getAvatarDisplay('standing-blink')
        setTimeout(() => _getAvatarDisplay('standing'), _getBlinkSpeed())
      }, _getBlinkFreq())
    }
    else if (player.status === 'sitting') {
      blinker = setInterval(() => {
        _getAvatarDisplay('sitting-blink')
        setTimeout(() => _getAvatarDisplay('sitting'), _getBlinkSpeed())
      }, _getBlinkFreq())
    }
  }

  function _getBlinkFreq() {
    var min = 2000
    var max = 20000

    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function _getBlinkSpeed() {
    var min = 100
    var max = 600

    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function _welcome() {
    out('************************')
    out('Welcome to Gem Warrior!')
    out('')
    out('Try <span class="keyword">help</span> if stuck')
    out('')
    out('<strong>Good luck...</strong>')
    out('************************')
  }

  function _playSong() {
    if (game.settings.playSound) {
      synth.send([0x90, 60, 100])
      setTimeout(() => synth.send([0x80, 60, 0]), 500)
      setTimeout(() => synth.send([0x90, 60, 100]), 500)
      setTimeout(() => synth.send([0x90, 62, 100]), 1000)
      setTimeout(() => synth.send([0x90, 64, 100]), 1500)
      setTimeout(() => synth.send([0x90, 67, 100]), 2000)
    } else {
      return 'The <span class="keyword">playSound</span> setting is currently disabled'
    }
  }

  function _init() {
    _applyEventHandlers()

    updateStatus(player.level, player.xp, player.hp, player.rox, loc)

    _welcome()

    _playerStand()
  }

  // on load, set things up
  $(window).on('load', _init)

  // initial command
  window.scrollTo(0,1)

})
