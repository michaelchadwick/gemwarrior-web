// /assets/js/app/lib/entities/location.js
// Place in the game

class Location extends Entity {
  constructor(options) {
    super()

    this.name                 = options.name
    this.description          = options.description
    this.coords               = options.coords
    this.paths                = options.paths
    this.danger_level         = options.danger_level
    this.monster_level_range  = options.monster_level_range
    this.items                = options.items
    this.monsters_abounding   = options.monsters_abounding
    this.bosses_abounding     = options.bosses_abounding
    this.checked_for_monsters = options.checked_for_monsters
    this.visited              = options.visited

    // console.log('[LOADED] /app/lib/entities/location')
  }

  describe() {
    let description = this.description

    if (!this.is_empty()) {
      description += '<br />&gt;&gt; Items(s): ' + this.list_items()
    }

    return description
  }

  set_description(text) {
    this.description = text

    GemWarrior.world.save()
  }

  is_empty() {
    return !this.items.length
  }
  has_item(item_name) {
    const needle = item_name.replaceAll(' ', '_').toLowerCase()

    return this.items.some(loc_item => loc_item.name.toLowerCase() == needle)
  }
  add_item(item_name) {
    console.log('location add_item', item_name)

    return this.items.push(GemWarrior.world.create_custom_item(item_name))
  }
  remove_item(item_name) {
    console.log('location remove_item', item_name)

    if (this.has_item(item_name)) {
      const index = Object.values(this.items).map(item => item.name.toLowerCase()).indexOf(item_name.toLowerCase())

      if (index !== -1) {
        this.items.splice(index, 1)
      }

      return true
    } else {
      return false
    }
  }

  list_items() {
    if (this.is_empty()) {
      return ''
    } else {
      // build hash out of location's items
      const item_hash = {}

      Object.values(this.items).forEach(item => {
        if (Object.keys(item_hash).includes(item.name)) {
          item_hash[item.name] += 1
        } else {
          item_hash[item.name] = 1
        }
      })

      // one item? return single string array
      if (Object.keys(item_hash).length == 1) {
        const i = Object.keys(item_hash)[0]
        const q = Object.values(item_hash)[0]

        const output = q > 1 ? `<span class="keyword">${i}</span> x${q}` : `<span class="keyword">${i}</span>`

        return output
      }
      // multiple items? return an array of strings
      else {
        const item_arr = []

        Object.entries(item_hash).forEach(entry => {
          const i = entry[0]
          const q = entry[1]

          if (q > 1) {
            item_arr.push(`<span class="keyword">${i}</span> x${q}`)
          } else {
            item_arr.push(`<span class="keyword">${i}</span>`)
          }
        })

        return item_arr.sort().join(', ')
      }
    }
  }

  list_paths() {
    const valid_paths = []

    this.paths.forEach((key, val) => {
      if (val) valid_paths.push(key)
    })

    return valid_paths
  }

  // TODO
  checked_for_monsters() {
    return this.checked_for_monsters
  }
  should_spawn_monster() {}
  remove_monster(name) {}
  list_monsters() {}
  list_bosses() {}
  has_monsters() {}
  has_monster(monster_name) {}
  has_boss(boss_name) {}
  list_actionable_words() {}
  populate_monsters() {}
}