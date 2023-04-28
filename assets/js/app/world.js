/* WORLD */
/* global GemWarrior, Player */
/* eslint-disable no-unused-vars */

class World {
  constructor(locations, player = null) {
    this.player = new Player(player)

    this.locations = this.create_locations(locations)
    this.cur_location = this.locations[this.player.cur_coords]
  }

  create_locations(json_locs) {
    let locs = {}

    Object.keys(json_locs).forEach(i => {
      const coords = json_locs[i].coords
      const index = Object.values(coords).join(',')

      locs[index] = {}

      locs[index]['name'] = json_locs[i].name
      locs[index]['description'] = json_locs[i].description
      locs[index]['coords'] = json_locs[i].coords
      locs[index]['items'] = json_locs[i].items
      locs[index]['paths'] = json_locs[i].paths
      locs[index]['danger_level'] = json_locs[i].danger_level
    })

    return locs
  }

  can_move(direction) {
    return GemWarrior.world.locations[this.player.cur_coords].paths[direction]
  }

  describe(point) {
    const loc = GemWarrior.world.locations[point]

    let description = loc.description

    if (loc.items.length) {
      description += `<br /> >> Thing(s):    <span class="noun">${loc.items.join(', ')}</span>`
    }

    return description
  }

  remove_item(point, item) {
    if (this.locations[point].items.includes(item)) {
      const index = this.locations[point].items.indexOf(item)

      if (index !== -1) {
        this.locations[point].items.splice(index, 1)
      }

      return true
    } else {
      return false
    }
  }
}
