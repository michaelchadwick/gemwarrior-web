$(function () {
  let level = 1
  let xp = 0
  let rox = 2
  let hp = 10
  let blinker = null
  let player = {
    'standingness': 'standing',
    'inventory': [
      'broken flashlight',
      'candlestick holder'
    ]
  }
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
    updateStatus(level, xp, rox, loc, hp)
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

  function updateStatus(level, xp, rox, loc, hp) {
    $statsLV.text(level)
    $statsXP.text(xp)
    $statsROX.text(rox)
    $statsLOC.text(loc.title)
    $statsHP.text(hp)
  }

  // process the user command input
  function evaluator(command) {
    switch (command.toLowerCase()) {
      case 'character':
      case 'char':
      case 'c':
        return `You assess yourself: wearing a shirt, pants, socks, and shoes, your fashion sense is satisfactory, without being notable.<br />
        <p>You are <strong>${player.standingness}</strong>.</p>
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
        if (player.standingness === 'sitting') {
          return `You are already ${player.standingness}.`
        } else {
          player.standingness = 'sitting'
          _playerSit()
          return 'You sit down.'
        }
      case 'st':
      case 'stand':
        if (player.standingness === 'standing') {
          return `You are already ${player.standingness}.`
        } else {
          player.standingness = 'standing'
          _playerStand()
          return 'You stand up.'
        }
      case 'sl':
      case 'sleep':
        player.standingness = 'reclining'
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
        if (loc.objects.includes('rock')) {
          text = 'You pick up a rock.'
          loc.objects.splice(loc.objects.indexOf('rock'), 1)
          rox++

        } else {
          text = `You bend down momentarily and attempt to <strong>pick up</strong> some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
        }

        return text
      case 'throw':
      case 'th':
        if (rox > 0) {
          rox--

          loc.objects.push('rock')

          text = 'You throw a rock on the ground, because that is definitely a productive move.'
        } else {
          text = 'You have no rox to throw, so your hand just makes the motion with no effect, sadly.'
        }

        return text
      case 'about':
      case 'a':
        return `<strong>Gem Warrior (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior'>Gem Warrior</a>, a Ruby gem (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.") <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`
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
    player.standingness = 'standing'
    _getAvatarDisplay('standing')
    _playerBlink()
  }

  function _playerSit() {
    player.standingness = 'sitting'
    _getAvatarDisplay('sitting')
    _playerBlink()
  }

  function _playerRecline() {
    reclineTimer = null

    if (player.standingness === 'reclining') {
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

    if (player.standingness === 'standing') {
      blinker = setInterval(() => {
        _getAvatarDisplay('standing-blink')
        setTimeout(() => _getAvatarDisplay('standing'), _getBlinkSpeed())
      }, _getBlinkFreq())
    }
    else if (player.standingness === 'sitting') {
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

    updateStatus(level, xp, rox, loc, hp)

    _welcome()

    _playerStand()
  }

  // on load, set things up
  $(window).on('load', _init)

  // initial command
  window.scrollTo(0,1)

})
