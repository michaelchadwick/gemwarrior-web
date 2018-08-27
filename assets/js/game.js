/* global $ */

$(function () {
  let level = 1
  let xp = 0
  let rox = 0
  let hp = 10
  let loc = 'Inescapable Hole of Turbidity'

  // game screen shortcut variables
  const $display = $('#output')
  // const $status = $('#status')
  const $keyboard = $('#keyboard')
  const $controller = $('#controller')
  const $statusLV = $('#status #level')
  const $statusXP = $('#status #xp')
  const $statusROX = $('#status #rox')
  const $statusLOC = $('#status #loc')
  const $statusHP = $('#status #hp')

  // mobile detection
  function formatDisplay() {
    if (window.innerWidth < 768) {
      $keyboard.hide()
      $controller.show()
    } else {
      $controller.hide()
      $keyboard.show()
    }
  }

  // print result of user command
  function repl(result) {
    updateStatus(level, xp, rox, loc, hp)
    displayText(result)
  }

  function displayText(text, lb) {
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
    $statusLV.text(level)
    $statusXP.text(xp)
    $statusROX.text(rox)
    $statusLOC.text(loc)
    $statusHP.text(hp)
  }

  function processGameRound(cmd) {
    displayText(`'${cmd}' not implemented yet`)
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
    case '?':
    case 'h':
    case 'help':
      return 'HELP: The following commands are valid: <span class="keyword">look go help</span>'
    default:
      return 'That command isn\'t recognized. Type "help" for valid commands'
    }
  }

  function _applyEventHandlers() {
    $('#controller .button').click(function () {
      switch (this.value) {
      case 'N':
        processGameRound('N')
        break
      case 'S':
        processGameRound('S')
        break
      case 'E':
        processGameRound('E')
        break
      case 'W':
        processGameRound('W')
        break
      case 'F':
        processGameRound('F')
        break
      case 'P':
        processGameRound('P')
        break
      case 'A':
        processGameRound('A')
        break
      }
    })

    $('#input form').submit(function (e) {
      e.preventDefault()

      const input = $('#userInput').val().toLowerCase()

      displayText(`<span class="command-previous">&gt; ${input}</span>`)

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
    displayText('***********************')
    displayText('Welcome to Gem Warrior!')
    displayText('Good luck...')
    displayText('***********************')
    displayText('')
  }

  function _init() {
    _applyEventHandlers()

    updateStatus(level, xp, rox, loc, hp)

    _welcome()
  }

  $(window).on('load', _init)
  $(window).on('load resize', function () {
    formatDisplay()
  })
})
