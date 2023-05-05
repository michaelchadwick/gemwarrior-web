// /assets/js/app/world.js
/* global GemWarrior, Item, Location, Player */
/* eslint-disable no-unused-vars */

class World {
  constructor(options) {
    this.player = new Player(options.player || null)

    this.locations = this._create_locations(options.locations)

    this.location = this.get_location()
  }

  describe_entity(loc, entity_name) {
    let entity = entity_name.toLowerCase()
    let result

    // check location items->monster->boss, inventory->items
    if (loc.has_item(entity)) {
      const item = Object.values(loc.items).filter(i => i.name.toLowerCase() == entity)[0]

      // console.log('item', item)

      if (GemWarrior.options.debug_mode) {
        result = item.describe_detailed()
      } else {
        result = item.describe()
      }

    // } else if (loc.has_monster(entity)) {
    //   Object.values(loc.monsters_abounding).forEach(m => {
    //     if (m.name.toLowerCase() == entity) {
    //       if (GemWarrior.options.debug_mode) {
    //         result = m.describe_detailed()
    //       } else {
    //         result = m.describe()
    //       }
    //     }
    //   })
    // } else if (loc.has_boss(entity)) {
    //   Object.values(loc.bosses_abounding).forEach(b => {
    //     if (b.name.toLowerCase() == entity) {
    //       if (GemWarrior.options.debug_mode) {
    //         result = b.describe_detailed()
    //       } else {
    //         result = b.describe()
    //       }
    //     }
    //   })
    } else if (this.player.inventory.has_item(entity)) {
      result = this.player.inventory.describe_item(entity)
    } else {
      result = ERROR_DESCRIBE_ENTITY_INVALID
    }

    return result
  }

  can_move_in_direction(direction) {
    return GemWarrior.world.location.paths[direction]
  }

  get_location(point = null) {
    const place = point ? point : this.player.coords

    return this.locations.filter(
      loc => Object.values(loc.coords).join(',') == Object.values(place).join(',')
    )[0]
  }

  set_location() {
    this.location = this.locations.filter(
      loc => Object.values(loc.coords).join(',') == Object.values(this.player.coords).join(',')
    )[0]
  }

  save = function() {
    // console.log('saving world state and global settings to localStorage...')

    if (GemWarrior.options.world_save) {
      try {
        localStorage.setItem(GW_WORLD_KEY, JSON.stringify(this))

        // console.log('FREE localStorage state saved!', JSON.parse(localStorage.getItem(GW_WORLD_KEY)))
      } catch(error) {
        console.error('localStorage world state save failed', error)
      }
    } else {
      console.warn('World is not being saved, so DON\'T REFRESH!')
    }
  }

  /* private */

  // take json string locations and create internal custom class object instances
  _create_locations(loc_data) {
    let locs = []

    Object.values(loc_data).forEach(loc => {
      // console.log('loc', loc.items)

      locs.push(new Location(
        {
          name: loc.name,
          description: loc.description,
          coords: loc.coords,
          paths: loc.paths,
          danger_level: loc.danger_level,
          monster_level_range: loc.monster_level_range || null,
          items: loc.items.map(item => Utils.create_custom_item(item)),
          monsters_abounding: loc.monsters_abounding || [],
          bosses_abounding: loc.bosses_abounding || [],
          checked_for_monsters: loc.checked_for_monsters || false,
          visited: loc.visited || false
        }
      ))
    })

    return locs
  }

}
