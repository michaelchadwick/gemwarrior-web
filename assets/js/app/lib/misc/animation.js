/* /app/lib/misc/animate */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

GemWarrior.animate = (type, q) => {
  if (GemWarrior.settings.enableAnimation) {
    let speed = 50
    let intervalId = null

    switch (type) {
      case 'flash':
        intervalId = setInterval(
          () => document.querySelector('body').classList.toggle('animate-body-flash'),
          speed
        )

        setTimeout(
          () => {
            clearInterval(intervalId)
            document.querySelector('body').classList.remove('animate-body-flash')
          },
          speed * q * 2
        )

        break

      case 'shake':
        document.querySelector('#output').classList.toggle('animate-output-move-shake')

        setTimeout(
          () => {
            document.querySelector('#output').classList.remove('animate-output-move-shake')
          },
          q * 1000
        )

        break
    }
  }
}
