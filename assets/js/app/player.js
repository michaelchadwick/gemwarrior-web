/* PLAYER */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

class Player {
  constructor() {
    this.name = ''
    this.level = 1
    this.xp = 0
    this.hp = 10
    this.rox = 2
    this.inventory = [
      'broken flashlight',
      'candlestick holder'
    ]
    this.inventory_checks = 0
    this.cur_coords = [1, 1, 0]
    this.status = 'standing'
  }

  generate_name() {
    let min, max
    const name = []

    // 5 to 10 letters (min and max are inclusive)
    // Math.floor((Math.random() * (max - min + 1) - min))
    min = Math.ceil(5)
    max = Math.floor(10)
    const letter_max = Math.floor((Math.random() * (max - min + 1) + min))

    // index 0 to 25 (min inclusive, max exclusive)
    // Math.random() * (max - min) + min
    // or if min == 0, Math.random() * max
    max = 25
    name[0] = CHAR_UPPER_POOL[Math.floor(Math.random() * max)]

    max = 5
    name[1] = CHAR_LOWER_VOWEL_POOL[Math.floor(Math.random() * max)]

    max = 25
    for (let i = 2; i <= letter_max; i++) {
      name[i] = CHAR_LOWER_POOL[Math.floor(Math.random() * max)]
    }

    this.name = name.join('')

    return this.name
  }

  go(direction) {
    switch (direction) {
    case 'north':
    case 'n':
      this.cur_coords[1] += 1
      GemWarrior._playSFX('go-north')
      break
    case 'east':
    case 'e':
      this.cur_coords[0] += 1
      GemWarrior._playSFX('go-east')
      break
    case 'south':
    case 's':
      this.cur_coords[1] -= 1
      GemWarrior._playSFX('go-south')
      break
    case 'west':
    case 'w':
      this.cur_coords[0] -= 1
      GemWarrior._playSFX('go-west')
      break
    }

    return this.cur_coords
  }
}
