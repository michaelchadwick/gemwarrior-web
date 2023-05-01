class Inventory {
  constructor(items = [], weapon = null, armor = null) {
    this.items  = items
    this.weapon = weapon
    this.armor  = armor

    console.log('[LOADED] /app/inventory')
  }

  is_empty() {
    return !this.items.length
  }

  describe_item(item_name) {
    const item = item_name.toLowerCase()
    let result

    if (this.has_item(item)) {
      Object.values(this.items).forEach(i => {
        if (i.name == item) {
          if (GemWarrior.options.debug_mode) {
            result = i.describe_detailed()
          } else {
            result = i.describe()
          }
        }
      })
    } else {
      result = ERROR_ITEM_DESCRIBE_INVALID
    }

    return result
  }

  // English-like sentence summary of inventory
  describe_items() {
    if (this.is_empty()) {
      return 'You possess nothing.'
    } else {
      // build hash of inventory's items
      const item_hash = {}

      Object.values(this.items).forEach(item => {
        if (Object.keys(item_hash).includes(item.name)) {
          item_hash[item.name] += 1
        } else {
          item_hash[item.name] = 1
        }
      })

      // one item? return single string
      if (Object.keys(item_hash).length == 1) {
        const i = Object.keys(item_hash)[0]
        const q = Object.values(item_hash)[0]

        if (q > 1) {
          return `You have ${q} <span class="noun">${i}</span>s.`
        } else {
          return `You have ${this._article_chooser(i)} <span class="noun">${i}</span>.`
        }
      }
      // multiple items? return array of strings to mush together
      else {
        let item_list_text = 'You have '
        const item_arr = []

        Object.entries(item_hash).forEach(entry => {
          const i = entry[0]
          const q = entry[1]

          if (q > 1) {
            item_arr.push(`${q} <span class="noun">${i}</span>s`)
          } else {
            item_arr.push(`${this._article_chooser(i)} <span class="noun">${i}</span>`)
          }
        })

        item_arr.splice(-1, 1, `and ${item_arr.at(-1)}.`)

        return item_list_text + item_arr.sort().join(', ')
      }
    }
  }

  // non-English-like list of inventory
  list() {
    if (this.is_empty) {
      return null
    } else {
      // build hash out of location's items
      const item_hash = {}

      this.items.map(item => item.name).forEach(name => {
        if (Object.keys(item_hash).includes(name)) {
          item_hash[name] += 1
        } else {
          item_hash[name] = 1
        }
      })

      // one item? return single string
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

  rox() {
    return this.items.filter(item => item.name.toLowerCase() == 'rock').length
  }

  has_item(item_name) {
    const needle = item_name.toLowerCase()

    return Object.values(this.items).some(item => item.name.toLowerCase() == needle)
  }

  equip_item(item_name) {
    if (this.has_item(item_name)) {
      Object.values(this.items).forEeach(item => {
        if (item.name == item_name) {
          if (item.equippable) {
            item.equipped = true

            if (item.is_weapon) {
              this.weapon = item

              return `The <span class="noun">${item.name}</span> has taken charge, and been equipped.`
            } else if (item.is_armor) {
              this.armor = item

              return `The <span class="noun">${item.name}</span> has fortified you, and been equipped.`
            }
          } else {
            return ERROR_ITEM_EQUIP_NONARMAMENT
          }
        }
      })
    } else {
      ERROR_ITEM_EQUIP_INVALID
    }
  }

  unequip_item(item_name) {
    if (this.has_item(item_name)) {
      Object.values(this.items).forEach(item => {
        if (item.name = item_name) {
          if (item.equippable) {
            item.equipped = false

            if (item.is_weapon) {
              this.weapon = null

              return `The <span class="noun">${item.name}</span> has been demoted to unequipped.`
            } else if (item.is_armor) {
              this.armor = null

              return `The <span class="noun">${item.name}</span> has been demoted to unequipped.`
            }
          } else {
            return ERROR_ITEM_UNEQUIP_NONARMAMENT
          }
        }
      })
    } else {
      return ERROR_ITEM_UNEQUIP_INVALID
    }
  }

  add_item(item_name, cur_loc = null) {
    if (!cur_loc) {
      // create Item-extended class instance
      // add it to this inventory
      this.items.push(GemWarrior.world.create_custom_item(item_name))

      return `Added <span class="noun">${item_name}</span> to your increasing collection of bits of tid.`
    } else {
      let result = ERROR_ITEM_ADD_INVALID

      Object.values(cur_loc.items).every(item => {
        // console.log('cur_loc items item.name', item.name)
        // console.log('item_name', item_name)

        // did we find the item
        if (item.name == item_name) {
          // is it takeable?
          if (item.takeable) {
            // create Item-extended class instance
            // add it to this.inv
            this.items.push(GemWarrior.world.create_custom_item(item_name))
            // remove item with same name from loc
            cur_loc.remove_item(item_name)

            // stats
            GemWarrior.world.player.items_taken += 1

            GemWarrior._playSFX('take')

            if (GemWarrior.world.player.inventory.rox() == GW_IHOT_MAX_ROX) {
              setTimeout(() => GemWarrior._playSFX('secret'), 500)

              GemWarrior.world.get_location(GW_IHOT_EXIT_POINT).set_description(`You look around the Inescapable Hole of Turbidity. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.<br /><br />There is a small indentation in the wall you can barely make out in the turbidity. You swear it wasn't there before.`)
              GemWarrior.world.get_location(GW_IHOT_EXIT_POINT).add_item('indentation')
            }

            result = `Added <span class="noun">${item_name}</span> to your increasing collection of bits of tid.`

            GemWarrior.world.save()

            return false
          } else {
            result = ERROR_ITEM_ADD_UNTAKEABLE

            return false
          }
        } else {
          return true
        }
      })

      return result
    }
  }

  drop_item(item_name) {
    if (this.has_item(item_name)) {
      // remove item with same name from this.inv
      this.remove_item(item_name)

      // create Item-extended class instance
      // add it to current location's items
      GemWarrior.world.location.add_item(item_name)

      GemWarrior._playSFX('drop')

      if (GemWarrior.world.player.inventory.rox() < GW_IHOT_MAX_ROX) {
        GemWarrior.world.get_location(GW_IHOT_EXIT_POINT).set_description(`You look around the Inescapable Hole of Turbidity. Due to its turbidity, you see little. Also, unfortunately, it is inescapable.`)
        GemWarrior.world.get_location(GW_IHOT_EXIT_POINT).remove_item('indentation')
      }

      GemWarrior.world.save()

      return `You drop the <span class="noun">${item_name}</span> on the ground, never to be seen again...unless you pick it up again at some point.`
    } else {
      return ERROR_ITEM_REMOVE_INVALID
    }
  }

  remove_item(item_name) {
    if (this.has_item(item_name)) {
      const index = Object.values(this.items).map(item => item.name.toLowerCase()).indexOf(item_name.toLowerCase())

      this.items.splice(index, 1)

      // if (!this.weapon) {
      //   if (this.weapon.name == item_name) {
      //     this.weapon = null
      //   }
      // }

      return true
    } else {
      return ERROR_ITEM_REMOVE_INVALID
    }
  }

  update_item_description(item_name, text) {
    if (this.has_item(item_name)) {
      const index = Object.values(this.items).map(item => item.name.toLowerCase()).indexOf(item_name.toLowerCase())

      this.items[index].description = text

      return true
    } else {
      return false
    }
  }

  has_battle_item() {
    return Object.values(this.items).some(item => item.useable_battle)
  }

  list_battle_items() {
    return Object.values(this.items).filter(item => item.useable_battle)
  }

  /* private */

  _an_words() {
    return ['herb']
  }

  _article_chooser(word) {
    return VOWELS.includes(word[0]) || this._an_words().includes(word) ? 'an' : 'a'
  }
}