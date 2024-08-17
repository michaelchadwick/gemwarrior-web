/* /assets/js/app/inventory.js */
/* a collection of items */
/* global GemWarrior */

class Inventory {
  constructor(items = [], weapon = null, armor = null) {
    this.items = this._create_items(items)
    this.weapon = weapon
    this.armor = armor
  }

  is_empty() {
    return !this.items.length
  }

  describe_item(item_name) {
    const item = item_name.toLowerCase()
    let result

    if (this.has_item(item)) {
      Object.values(this.items).forEach((i) => {
        if (i.name == item) {
          if (GemWarrior.config.debugMode) {
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

      Object.values(this.items).forEach((item) => {
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
          return `You have ${this._article_chooser(
            i
          )} <span class="noun">${i}</span>.`
        }
      }
      // multiple items? return array of strings to mush together
      else {
        let item_list_text = 'You have '
        const item_arr = []

        Object.entries(item_hash).forEach((entry) => {
          const i = entry[0]
          const q = entry[1]

          if (q > 1) {
            item_arr.push(`${q} <span class="noun">${i}</span>s`)
          } else {
            item_arr.push(
              `${this._article_chooser(i)} <span class="noun">${i}</span>`
            )
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

      Object.values(this.items).forEach((name) => {
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

        const output =
          q > 1
            ? `<span class="keyword">${i}</span> x${q}`
            : `<span class="keyword">${i}</span>`

        return output
      }
      // multiple items? return an array of strings
      else {
        const item_arr = []

        Object.entries(item_hash).forEach((entry) => {
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
    return this.items.filter((item) => item.name.toLowerCase() == 'rock').length
  }

  has_item(item_name, amount = null) {
    if (amount) {
      return (
        Object.values(this.items).filter(
          (item) => item.name.toLowerCase() == item_name.toLowerCase()
        ).length >= amount
      )
    } else {
      return Object.values(this.items).some(
        (item) => item.name.toLowerCase() == item_name.toLowerCase()
      )
    }
  }

  equip_item(item_name) {
    if (this.has_item(item_name)) {
      Object.values(this.items).forEeach((item) => {
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
      Object.values(this.items).forEach((item) => {
        if ((item.name = item_name)) {
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
      this.items.push(Utils.create_custom_item(item_name))

      return `Added <span class="noun">${item_name}</span> to your increasing collection of bits of tid.`
    } else {
      let result = ERROR_ITEM_ADD_INVALID

      Object.values(cur_loc.items).every((item) => {
        if (item.name == item_name) {
          // is it takeable?
          if (item.takeable) {
            // create Item-extended class instance
            // add it to this.inv
            this.items.push(Utils.create_custom_item(item_name))
            // remove item with same name from loc
            cur_loc.remove_item(item_name)

            // stats
            GemWarrior.world.player.items_taken += 1

            GemWarrior._playSFX('take')

            if (this.rox() == GW_IHOT_MAX_ROX) {
              setTimeout(() => GemWarrior._playSFX('secret'), 500)

              GemWarrior.world
                .get_location(GW_IHOT_EXIT_POINT)
                .add_item('indentation')

              result = `After adding the most recent <span class="noun">${item_name}</span> to your collection, you hear a faint sound towards the northeast, almost as if stone moved upon stone.`
            } else {
              result = `Added <span class="noun">${item_name}</span> to your increasing collection of bits of tid.`
            }

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
    let result

    if (this.has_item(item_name)) {
      // remove item with same name from this.inv
      this.remove_item(item_name)

      // create Item-extended class instance
      // add it to current location's items
      GemWarrior.world.location.add_item(item_name)

      GemWarrior._playSFX('drop')

      if (
        item_name == 'rock' &&
        this.rox() < GW_IHOT_MAX_ROX &&
        GemWarrior.world.location.has_item('indentation')
      ) {
        setTimeout(() => GemWarrior._playSFX('secret'), 500)

        GemWarrior.world
          .get_location(GW_IHOT_EXIT_POINT)
          .remove_item('indentation')

        result = `After dropping the most recent <span class="noun">${item_name}</span> to your collection, you hear a faint sound towards the northeast, almost as if stone moved upon stone.`
      } else {
        result = `You drop the <span class="noun">${item_name}</span> on the ground, never to be seen again...unless you pick it up again at some point.`
      }

      GemWarrior.world.save()
    } else {
      result = ERROR_ITEM_REMOVE_INVALID
    }

    return result
  }

  remove_item(item_name) {
    // console.log(`remove_item(${item_name})`)

    if (this.has_item(item_name)) {
      const index = Object.values(this.items)
        .map((i) => i.name.toLowerCase())
        .indexOf(item_name.toLowerCase())

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

  item_has_condition(item_name, condition) {
    // console.log(`item_has_condition(${item_name}, ${condition})`)

    const item = Object.values(this.items).filter(
      (i) => i.name.toLowerCase() == item_name.toLowerCase()
    )[0]

    if (item) {
      return item[condition] == true ? true : false
    } else {
      return false
    }
  }

  update_item_condition(item_name, condition, value) {
    const item = Object.values(this.items).filter(
      (i) => i.name.toLowerCase() == item_name.toLowerCase()
    )[0]

    if (item) {
      item[condition] = value

      return true
    } else {
      return false
    }
  }

  update_item_description(item_name, text) {
    if (this.has_item(item_name)) {
      const item = Object.values(this.items).filter(
        (i) => i.name.toLowerCase() == item_name.toLowerCase()
      )[0]

      item.description = text

      return true
    } else {
      return false
    }
  }

  has_battle_item() {
    return Object.values(this.items).some((item) => item.useable_battle)
  }

  list_battle_items() {
    return Object.values(this.items).filter((item) => item.useable_battle)
  }

  /* private */

  _an_words() {
    return ['herb']
  }

  _article_chooser(word) {
    return VOWELS.includes(word[0]) || this._an_words().includes(word)
      ? 'an'
      : 'a'
  }

  // create array of custom objects to fill current inventory's items
  _create_items(item_list) {
    const item_objects = []

    if (item_list.length) {
      Object.values(item_list).forEach((item) => {
        item_objects.push(Utils.create_custom_item(item))
      })
    }

    return item_objects
  }
}
