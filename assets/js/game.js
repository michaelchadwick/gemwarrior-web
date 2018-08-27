/* global $ */

$(function () {
  let level = 1   // level for player
  let xp = 0      // experience points for player
  let rox = 0     // rox (currency)
  let hp = 10     // hit points for the player

  // game screen shortcut variables
  const $display = $('#output')
  const $status = $('#status')
  const $keyboard = $('#keyboard')
  const $controller = $('#controller')
  const $statusLV = $('#status #level')
  const $statusXP = $('#status #xp')
  const $statusROX = $('#status #rox')
  const $statusHP = $('#status #hp')

  // mobile detection
  function isMobile() {
    if (window.innerWidth < 768) {
      // hide the text box
      $keyboard.hide()
      $controller.show()
    } else {
      // hide the buttons
      $controller.hide()
      $keyboard.show()
    }
  }

  // print result of user command
  function repl(result) {
    updateStatus(level, xp, rox, hp)
    displayText(result)
  }

  function displayText(text, lb) {
    $content_to_display = text
    if (!lb) {
      $content_to_display += '<br />'
    }
    $display.append($content_to_display)

    if ($display.height > window.innerHeight) {
      window.scrollTo(0, window.innerHeight * 4)
    }
  }

  function updateStatus(level, xp, rox, hp) {
    $statusLV.text(level)
    $statusXP.text(xp)
    $statusROX.text(rox)
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
        return 'You look around'
      case 'go':
      case 'g':
        return 'You go somewhere'
      case '?':
      case 'h':
      case 'help':
        return 'HELP: The following commands are valid: look go help'
      default:
        return 'That command isn\'t recognized. Type "help" for valid commands'
    }
  }

  function _applyEventHandlers() {
    $('#controller .button').click(function () {
      switch (this.value) {
        case 'N':
          processGameRound('N')
          break;
        case 'S':
          processGameRound('S')
          break;
        case 'E':
          processGameRound('E')
          break;
        case 'W':
          processGameRound('W')
          break;
        case 'F':
          processGameRound('F')
          break;
        case 'P':
          pickup(currentRoom)
          break;
        case 'A':
          processGameRound('A')
          break;
      }
    })

    $('#input form').submit(function (e) {
      e.preventDefault()
      result = evaluator($('#userInput').val().toLowerCase())
      $('#userInput').val('')
      repl(result)
    })

    // jquery command to force the textbox to take focus
    $('#userInput').focus()

    // if we leave userInput, return after a few seconds
    $('*').on('mouseup', function() {
      setTimeout(function() {
        $('#userInput').focus()
      }, 800)
    })

    window.addEventListener('resize', isMobile)
  }

  function welcome() {
    displayText('***********************')
    displayText('Welcome to Gem Warrior!')
    displayText('Good luck...')
    displayText('***********************')
  }

  function gwInit() {
    _applyEventHandlers()

    updateStatus(level, xp, rox, hp)

    isMobile()

    welcome()
  }

  gwInit()
})
