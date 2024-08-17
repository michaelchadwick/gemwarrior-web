/* /assets/js/app/events.js */
/* adds event listeners to dom */
/* global GemWarrior */

GemWarrior.__handleEnter = function () {
  if (GemWarrior.config.keyCommand.length > 0) {
    // display last command and then evaluate and output
    let input = GemWarrior.config.keyCommand

    // fix on-screen keyboard "spaces"
    input = input.toString().replaceAll('_', ' ')

    GemWarrior._out(`
      <br />
      <span class="command-previous">&gt; ${input}</span><br />
    `)
    GemWarrior._repl(GemWarrior.evaluator.process(input))

    // reset keyCommand
    GemWarrior.config.keyCommand = ''

    // sync to DOM display
    GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

    // if keyCommand is empty, hide DOM display
    GemWarrior.dom.keyboardInput.classList.remove('show')
  }
}

GemWarrior.__handleBackspace = function () {
  if (GemWarrior.config.keyCommand.length) {
    // remove last letter from keyCommand
    GemWarrior.config.keyCommand = GemWarrior.config.keyCommand.slice(
      0,
      GemWarrior.config.keyCommand.length - 1
    )

    // sync to DOM display
    GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

    // console.log(GemWarrior.config.keyCommand.length)

    // if keyCommand is empty, hide DOM display
    if (GemWarrior.config.keyCommand.length <= 0) {
      GemWarrior.dom.keyboardInput.classList.remove('show')
    }
  }
}

GemWarrior.__handleClickTouch = function (event) {
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

// TOUCH: add mobile swipe ability
GemWarrior.__handleGesture = function (
  touchstartX,
  touchstartY,
  touchendX,
  touchendY
) {
  const delx = touchendX - touchstartX
  const dely = touchendY - touchstartY

  if (Math.abs(delx) > Math.abs(dely)) {
    if (delx > 0) return 'right'
    else return 'left'
  } else if (Math.abs(delx) < Math.abs(dely)) {
    if (dely > 0) return 'down'
    else return 'up'
  } else return 'tap'
}

GemWarrior._attachEventHandlers = function () {
  // {} header icons to open modals
  GemWarrior.dom.btnNav.addEventListener('click', () => {
    GemWarrior.dom.navOverlay.classList.toggle('show')
  })
  GemWarrior.dom.btnNavClose.addEventListener('click', () => {
    GemWarrior.dom.navOverlay.classList.toggle('show')
  })
  GemWarrior.dom.btnHelp.addEventListener('click', () =>
    GemWarrior.modalOpen('help')
  )
  GemWarrior.dom.btnFeedback.addEventListener('click', () =>
    GemWarrior.modalOpen('feedback')
  )
  GemWarrior.dom.btnSettings.addEventListener('click', () =>
    GemWarrior.modalOpen('settings')
  )

  // catch the mobile keyboard buttons
  GemWarrior.dom.keyboardButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      let key = event.target.dataset.key

      if (key == undefined) {
        key = event.target.parentElement.dataset.key
      }

      switch (key) {
        case '↵':
          GemWarrior.__handleEnter()
          break
        case '<':
          GemWarrior.__handleBackspace()
          break
        default:
          // update keyCommand
          GemWarrior.config.keyCommand += key

          // make sure DOM display is visible
          GemWarrior.dom.keyboardInput.classList.add('show')

          break
      }

      // sync to DOM display
      if (getComputedStyle(GemWarrior.dom.keyboard).display == 'block') {
        GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand
      }
    })
  })

  // catch the command bar form
  GemWarrior.dom.cliForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const input = GemWarrior.dom.cmdInput.value

    if (input.length) {
      // show last entered command and display evaluated output
      GemWarrior._out(`
        <br />
        <span class="command-previous">&gt; ${input}</span><br />
      `)

      GemWarrior._repl(GemWarrior.evaluator.process(input))

      // clear command bar
      GemWarrior.dom.cmdInput.value = ''
    }
  })

  // force the textbox to take focus
  GemWarrior.dom.cmdInput.focus()

  // if we leave command bar form, return after a moment
  document.addEventListener('mouseup', () => {
    const isTextSelected = window.getSelection().toString() != ''
    const isFeedbackFocused = [
      'feedback',
      'feedback-email',
      'feedback-body',
      'feedback-submit',
      'captcha-usertext',
      'feedback-button-refresh',
    ].includes(document.activeElement.id)

    if (!isTextSelected && !isFeedbackFocused) {
      setTimeout(function () {
        GemWarrior.dom.cmdInput.focus()
      }, GW_SNAPBACK_DELAY)
    }
  })

  // cycle through previous commands
  document.addEventListener('keydown', (event) => {
    const code = event.code
    const excludedKeys = ['Alt', 'Control', 'Meta', 'Shift']

    if (!excludedKeys.some((key) => event.getModifierState(key))) {
      if (getComputedStyle(GemWarrior.dom.keyboard).display == 'block') {
        if (code == 'Enter') {
          event.preventDefault()

          GemWarrior.__handleEnter()
        } else if (code == 'Backspace') {
          GemWarrior.__handleBackspace()
        } else if (code == 'Space') {
          GemWarrior.config.keyCommand += '_'

          // sync to DOM display
          GemWarrior.dom.keyboardInput.innerText = GemWarrior.config.keyCommand

          GemWarrior.dom.keyboardInput.classList.add('show')
        } else if (code.startsWith('Key')) {
          const key = code.charAt(code.length - 1)

          GemWarrior.dom.keyboardButtons.forEach((button) => {
            if (button.dataset.key == key.toLowerCase()) {
              // update keyCommand
              GemWarrior.config.keyCommand += key

              // sync to DOM display
              GemWarrior.dom.keyboardInput.innerText =
                GemWarrior.config.keyCommand

              GemWarrior.dom.keyboardInput.classList.add('show')
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

  document.addEventListener(
    'touchmove',
    (event) => {
      event = event.originalEvent || event

      if (event.scale !== 1) {
        event.preventDefault()
      }
    },
    false
  )

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', GemWarrior.__handleClickTouch)
  window.addEventListener('touchend', GemWarrior.__handleClickTouch)

  // on viewport change, resize output
  window.onresize = GemWarrior._resizeFixedElements

  let touchstartX = 0
  let touchstartY = 0
  let touchendX = 0
  let touchendY = 0

  const gestureZone = document.getElementById('output')

  gestureZone.addEventListener(
    'touchstart',
    function (event) {
      touchstartX = event.changedTouches[0].screenX
      touchstartY = event.changedTouches[0].screenY
    },
    false
  )

  gestureZone.addEventListener(
    'touchend',
    function (event) {
      touchendX = event.changedTouches[0].screenX
      touchendY = event.changedTouches[0].screenY
      console.log(
        GemWarrior.__handleGesture(
          touchstartX,
          touchstartY,
          touchendX,
          touchendY
        )
      )
      // alert(GemWarrior.__handleGesture(touchstartX, touchstartY, touchendX, touchendY))
    },
    false
  )
}

GemWarrior._logStatus('[LOADED] /app/events')
