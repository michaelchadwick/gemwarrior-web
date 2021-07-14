$(function () {
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
  let text

  const commands = ['(n)orth', '(e)ast', '(s)outh', '(w)est', '(c)haracter', '(l)ook', '(p)ickup', '(th)row', '(i)nventory', '(si)t', '(st)and', '(sl)eep', '(h)elp', '(a)bout']
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
  // print result of user command

  function repl(result) {
    updateStatus(player.level, player.xp, player.rox, loc, player.hp)
    out(result)
  }

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
    let cmds = command.split(' ')

    let verb = cmds[0].toLowerCase()
    let obj = cmds[1] ? cmds[1].toLowerCase() : null

    switch (verb) {
      case 'character':
      case 'char':
      case 'c':
        return `You assess yourself: wearing a shirt, pants, socks, and shoes, your fashion sense is satisfactory, without being notable.<br />
        <p>You are <strong>${player.status}</strong>.</p>
        You are reasonably healthy, but due to your current location and station, that feeling of heartiness diminishes as your hunger increases.`
      case 'look':
      case 'l':
        text = `You look around the <span class='noun'>${loc.title}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`

        if (loc.objects.length > 0) {
          text += '<br /><br />'

          text += `There are things to pick up here: <span class="noun">${loc.objects.join(', ')}</span>`
        }

        return text
      case 'si':
      case 'sit':
        if (player.status === 'sitting') {
          return `You are already ${player.status}.`
        } else {
          player.status = 'sitting'
          _playerSit()
          return 'You sit down.'
        }
      case 'st':
      case 'stand':
        if (player.status === 'standing') {
          return `You are already ${player.status}.`
        } else {
          player.status = 'standing'
          _playerStand()
          return 'You stand up.'
        }
      case 'sl':
      case 'sleep':
        player.status = 'reclining'
        _playerRecline()
        return 'You lie down to rest.'
      case 'go':
      case 'g':
        return `You go somewhere else inescapable in the <span class='noun'>${loc.title}</span>.`
      case 'n':
        return `You go <strong>north</strong> a bit. You are still in an inescapable hole.`
      case 'w':
        return `You go <strong>west</strong> a bit. You are still in an inescapable hole.`
      case 's':
        return `You go <strong>south</strong> a bit. You are still in an inescapable hole.`
      case 'e':
        return `You go <strong>east</strong> a bit. You are still in an inescapable hole.`
      case 'inventory':
      case 'inven':
      case 'i':
        if (rox === 1) {
          roxCount = ' <strong>1</strong> rock'
        } else {
          roxCount = ` <strong>${rox}</strong> rox`
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

        return text
      case 'pickup':
      case 'p':
        if (obj) {
          if (obj === 'rock' && loc.objects.includes('rock')) {
            text = 'You pick up a <span class="noun">rock</span>.'
            loc.objects.splice(loc.objects.indexOf('rock'), 1)
            rox++
          } else {
            text = 'That object is not present, so picking it up is going to be difficult.'
          }
        } else {
          text = `Since you did not indicate <strong>what</strong> to pick up, you bend down momentarily and attempt to pick up some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
        }

        return text
      case 'throw':
      case 'th':
        if (rox > 0) {
          rox--

          loc.objects.push('rock')

          text = 'You throw a <span class="noun">rock</span> on the ground, because that is definitely a productive move.'
        } else {
          text = 'You have no <span class="noun">rox</span> to throw, so your hand just makes the motion with no effect, sadly.'
        }

        return text
      case 'about':
      case 'a':
        return `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior'>Gem Warrior</a>, a Ruby gem (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")

        <p><em><strong>Narrator</strong>: It actually wasn't very portable at all.</em></p>`
      case '?':
      case 'h':
      case 'help':
        return `HELP: The following commands are valid: <span class="keyword">${commands.join(', ')}</span>`
      default:
        return 'That command isn\'t recognized. Type "help" for valid commands.'
      }
  }

  function _applyEventHandlers() {
    $('button').click(function (event) {
      const command = event.target.dataset.command
      out('')
      out(`<span class="command-previous">&gt; ${command}`)
      out(evaluator(command))
    })

    $('#input form').submit(function (e) {
      e.preventDefault()

      const input = $('#userInput').val().toLowerCase()

      out('')
      out(`<span class="command-previous">&gt; ${input}</span>`)

      const result = evaluator(input)
      $('#userInput').val('')
      repl(result)
    })

    // jquery command to force the textbox to take focus
    $('#userInput').focus()

    // if we leave userInput, return after a second
    $('*').on('mouseup', function() {
      setTimeout(function() {
        $('#userInput').focus()
      }, 1000)
    })

    $(document).on('touchmove', function(event) {
      event = event.originalEvent || event
      if (event.scale !== 1) {
        event.preventDefault()
      }
    }, false)
  }

  // shuttle avatar display workload to web worker
  function _getAvatarDisplay(status) {
    if (window.Worker) {
      var avatarWorker = new Worker('assets/js/avatar.js')

      avatarWorker.postMessage(status)

      avatarWorker.onmessage = (response) => {
        $('#avatar').html(response.data)
      }
    }
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
    out('Try "help" if stuck')
    out('')
    out('<strong>Good luck...</strong>')
    out('************************')
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
