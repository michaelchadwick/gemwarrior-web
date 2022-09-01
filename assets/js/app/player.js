/* PLAYER */
/* global Player */

class Player {
  constructor() {
    this.cur_coords = [1, 1, 0]

    // console.log('Player', this)
  }

  go(direction) {
    switch (direction) {
    case 'north':
    case 'n':
      this.cur_coords[1] += 1
      break
    case 'east':
    case 'e':
      this.cur_coords[0] += 1
      break
    case 'south':
    case 's':
      this.cur_coords[1] -= 1
      break
    case 'west':
    case 'w':
      this.cur_coords[0] -= 1
      break
    }

    return this.cur_coords
  }
}
