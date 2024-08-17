/* lib/helpers */
/* misc global functions */
/* global GemWarrior */

// replace the command bar's command with historic data if available
GemWarrior.__traverseHistory = function (key) {
  if (GemWarrior.settings.history.length > 0) {
    if (key === 'ArrowUp') {
      // up, or "back", or "prev cmd"
      if (GemWarrior.settings.historyMarker > 0) {
        GemWarrior.settings.historyMarker--
      }
    } else {
      // down, or "forward", or "next most recent cmd"
      if (
        GemWarrior.settings.historyMarker < GemWarrior.settings.history.length
      ) {
        GemWarrior.settings.historyMarker++
      } else {
        // back to current untyped-as-of-yet command
        GemWarrior.dom.cmdInput.value = ''
        GemWarrior.settings.historyMarker = GemWarrior.settings.history.length
      }
    }

    // set command bar to historical value
    GemWarrior.dom.cmdInput.focus()
    GemWarrior.dom.cmdInput.value = ''

    if (GemWarrior.settings.history[GemWarrior.settings.historyMarker]) {
      setTimeout(
        () =>
          (GemWarrior.dom.cmdInput.value =
            GemWarrior.settings.history[GemWarrior.settings.historyMarker]),
        20
      )
    }
  }

  GemWarrior._saveSetting('history', GemWarrior.settings.history)
  GemWarrior._saveSetting('historyMarker', GemWarrior.settings.historyMarker)
}

// get a filtered list of the player's command history
GemWarrior.__getHistoryDisplay = function () {
  return `<strong>Command history</strong>: ${GemWarrior.settings.history
    .filter((w) => !['hist', 'history'].includes(w))
    .join(', ')}`
}

// print number of spaces
GemWarrior._sp = function (num) {
  const spaces = []

  for (let i = 0; i < num; i++) {
    spaces.push('&nbsp;')
  }

  return spaces.join('')
}

// get list of other NebyooApps from Dave
GemWarrior._getNebyooApps = async function () {
  const response = await fetch(NEBYOOAPPS_SOURCE_URL)
  const json = await response.json()
  const apps = json.body
  const appList = document.querySelector('.nav-list')

  Object.values(apps).forEach((app) => {
    const appLink = document.createElement('a')
    appLink.href = app.url
    appLink.innerText = app.title
    appLink.target = '_blank'
    appList.appendChild(appLink)
  })
}
