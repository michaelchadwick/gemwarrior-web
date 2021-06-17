$(function () {
  let level = 1
  let xp = 0
  let rox = 0
  let hp = 10
  let loc = 'Inescapable Hole of Turbidity'
  let player = {
    'standingness': 'standing'
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
    $statsLOC.text(loc)
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
      return `You look around the <span class='noun'>${loc}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`
    case 'si':
    case 'sit':
      if (player.standingness === 'sitting') {
        return `You are already ${player.standingness}.`
      } else {
        player.standingness = 'sitting'
        return 'You sit down.'
      }
    case 'st':
    case 'stand':
      if (player.standingness === 'standing') {
        return `You are already ${player.standingness}.`
      } else {
        player.standingness = 'standing'
        return 'You stand up.'
      }
    case 'go':
    case 'g':
      return `You go somewhere else inescapable in the <span class='noun'>${loc}</span>.`
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
      return 'You have the <span class="noun">clothes on your back</span>, a <span class="noun">broken flashlight</span>, a <span class="noun">candlestick holder</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".'
    case 'pickup':
    case 'p':
      return `You bend down momentarily and attempt to <strong>pick up</strong> some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`
    case 'about':
    case 'a':
      return `<strong>Gem Warrior (Web)</strong> was programmed by <a href='https://michaelchadwick.info'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a href='https://github.com/michaelchadwick/gemwarrior'>Gem Warrior</a>, a Ruby gem (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.") <em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`
    case '?':
    case 'h':
    case 'help':
      return 'HELP: The following commands are valid: <span class="keyword">(c)haracter (l)ook (p)ickup (i)nventory (si)t (st)and (h)elp (a)bout</span>'
    default:
      return 'That command isn\'t recognized. Type "help" for valid commands'
    }
  }

  function _applyEventHandlers() {
    $('#controller button').click(function (event) {
      const command = event.target.dataset.command
      out(`<span class="command-previous">&gt; ${command}`)
      out(evaluator(command))
    })

    $('#input form').submit(function (e) {
      e.preventDefault()

      const input = $('#userInput').val().toLowerCase()

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
  }

  function _welcome() {
    out('***********************')
    out('Welcome to Gem Warrior!')
    out('Good luck...')
    out('***********************')
    out('')
  }

  function _init() {
    _applyEventHandlers()

    updateStatus(level, xp, rox, loc, hp)

    _welcome()
  }

  $(window).on('load', _init)
  $(document).on('touchmove', function(event) {
    event = event.originalEvent || event
    if (event.scale !== 1) {
      event.preventDefault()
    }
  }, false)
  window.scrollTo(0,1)
  // $(window).on('load resize', function () {})
})
