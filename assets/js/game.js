/* global $ */

$(function () {
  let level = 1
  let xp = 0
  let rox = 0
  let hp = 10
  let loc = 'Inescapable Hole of Turbidity'

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

  function processGameRound(command) {
    switch (command) {
    case 'N':
      out(`You go <strong>north</strong> a bit. You are still in an inescapable hole.`)
      break
    case 'W':
      out(`You go <strong>west</strong> a bit. You are still in an inescapable hole.`)
      break
    case 'S':
      out(`You go <strong>south</strong> a bit. You are still in an inescapable hole.`)
      break
    case 'E':
      out(`You go <strong>east</strong> a bit. You are still in an inescapable hole.`)
      break
    case 'P':
      out(`You bend down momentarily and attempt to <strong>pick up</strong> some dirt from the floor. You then drop it back on the ground once you realize having dirt on your person while in an inescapable hole is inconsequential.`)
      break
    case 'A':
      out(`<strong>Gem Warrior (Web)</strong> was programmed by <a href='https://michaelchadwick.info'>Michael Chadwick</a>, an all right kind of person entity.`)
      break
    case 'I':
      out('You have the <span class="noun">clothes on your back</span>, a <span class="noun">broken flashlight</span>, a <span class="noun">candlestick holder</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".')
      break
    case '?':
      out(`HELP: The following actions are valid: <span class="keyword">(N)orth (W)est (S)outh (E)ast (P)ickup (A)about (I)nventory (?)uestion Point</span>`)
      break
    }
  }

  // process the user command input
  function evaluator(command) {

    switch (command) {
    case 'look':
    case 'l':
      return `You look around the <span class='noun'>${loc}</span>. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`
    case 'go':
    case 'g':
      return `You go somewhere else inescapable in the <span class='noun'>${loc}</span>.`
    case 'inventory':
    case 'inven':
    case 'i':
      return 'You have the <span class="noun">clothes on your back</span>, a <span class="noun">broken flashlight</span>, a <span class="noun">candlestick holder</span>, and a lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".'
    case '?':
    case 'h':
    case 'help':
      return 'HELP: The following commands are valid: <span class="keyword">(l)ook (g)o (h)elp (i)nventory</span>'
    default:
      return 'That command isn\'t recognized. Type "help" for valid commands'
    }
  }

  function _applyEventHandlers() {
    $('#controller button').click(function (event) {
      const command = event.target.dataset.command
      out(`<span class="command-previous">&gt; ${command}`)
      processGameRound(command)
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
