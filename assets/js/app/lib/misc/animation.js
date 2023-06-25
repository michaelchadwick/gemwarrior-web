/* /app/lib/misc/animate */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

GemWarrior.animate = (type, q) => {
  if (GemWarrior.settings.enableAnimation) {
    switch (type) {
      case 'flash':
        const speed = 50

        let intervalId = setInterval(
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
    }
  }
}
