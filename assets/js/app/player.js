/* PLAYER */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

class Player {
  constructor() {
    this.cur_coords = [1, 1, 0]
  }

  go(direction) {
    switch (direction) {
    case 'north':
    case 'n':
      this.cur_coords[1] += 1
      GemWarrior._playFX('go-north')
      break
    case 'east':
    case 'e':
      this.cur_coords[0] += 1
      GemWarrior._playFX('go-east')
      break
    case 'south':
    case 's':
      this.cur_coords[1] -= 1
      GemWarrior._playFX('go-south')
      break
    case 'west':
    case 'w':
      this.cur_coords[0] -= 1
      GemWarrior._playFX('go-west')
      break
    }

    return this.cur_coords
  }
}
