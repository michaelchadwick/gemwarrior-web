/* /assets/js/app/lib/entities/player.js */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

class Player extends Creature {
  constructor(options = null) {
    super()

    if (options) {
      this.name = options.name
      this.level = options.level
      this.xp = options.xp
      this.hp = options.hp_cur
      this.hp_max = options.hp_max
      this.inventory = this._create_inventory(options.inventory.items)
      this.inventory_checks = options.inventory_checks
      this.coords = options.coords
      this.status = options.status
      this.special_abilities = options.special_abilities
      this.monsters_killed = options.monsters_killed
      this.bosses_killed = options.bosses_killed
      this.items_taken = options.items_taken
      this.moves_made = options.moves_made
      this.rests_taken = options.rests_taken
      this.deaths = options.deaths
    } else {
      this.name = ''
      this.level = 1
      this.xp = 0
      this.hp_cur = 10
      this.hp_max = 10
      // normal
      this.inventory = new Inventory([
        new Rock()
      ])
      // IHOT all stuff needed for torch
      // this.inventory = new Inventory([
      //   new Bucket(),
      //   new Cloth(),
      //   new Resin(),
      //   new Rock(),
      //   new Rock(),
      //   new Stick()
      // ])
      // IHOT win state
      // this.inventory = new Inventory([
      //   new Rock(),new Rock(),new Rock(),new Rock(),new Rock(),
      //   new Rock(),new Rock(),new Rock(),new Rock(),new Rock(),
      //   new Torch()
      // ])
      this.inventory_checks = 0
      this.coords = {
        x: 1, y: 1, z: 0
      },
      this.status = 'standing'
      this.special_abilities = []
      this.monsters_killed = 0
      this.bosses_killed = 0
      this.items_taken = 0
      this.moves_made = 0
      this.rests_taken = 0
      this.deaths = 0
    }

    this.description = `The playable character in the world of ${PROGRAM_NAME}.`

    console.log('[LOADED] /app/lib/entities/player')
  }

  describe() {
    let output = ''

    output += `
      <p>You, the mighty warrior <span class="noun">${GemWarrior.world.player.name}</span>, assess yourself:</p>
      <ul>
        <li>You are wearing typical period garb. Your fashion sense is satisfactory, but not notable.</li>
        <li>
          You are reasonably healthy, but due to your current location and station, that feeling of heartiness ever diminishes.
        </li>
        <li>You are <strong>${GemWarrior.world.player.status}</strong>.</li>
        <li>You have <span class="noun">${this.weapon || 'nothing'}</span> equipped as a weapon.</li>
        <li>You have <span class="noun">${this.armor || 'nothing'}</span> equipped as armor.</li>
        <li>You have the following special abilities: ${this.special_abilities.length ? this.special_abilities.join(', ') : 'none...yet'}.</li>
    `

    if (GemWarrior.config.debugMode) {
      output += `
        <li>You have killed <span class="keyword">${this.monsters_killed}</span> monster(s).</li>
        <li>You have killed <span class="keyword">${this.bosses_killed}</span> boss(es).</li>
        <li>You have taken <span class="keyword">${this.items_taken}</span> item(s).</li>
        <li>You have made <span class="keyword">${this.moves_made}</span> move(s).</li>
        <li>You have taken <span class="keyword">${this.rests_taken}</span> rest(s).</li>
        <li>You have died <span class="keyword">${this.deaths}</span> time(s).</li>
      `
    }

    output += `
      </ul>
    `

    return output
  }

  use() {
    return 'You may not, uh, <em>use</em> yourself.'
  }

  go(direction) {
    switch (direction) {
    case 'north':
    case 'n':
      this.coords.y += 1
      GemWarrior.world.set_location()
      GemWarrior._playSFX('go-north')
      break
    case 'east':
    case 'e':
      this.coords.x += 1
      GemWarrior.world.set_location()
      GemWarrior._playSFX('go-east')
      break
    case 'south':
    case 's':
      this.coords.y -= 1
      GemWarrior.world.set_location()
      GemWarrior._playSFX('go-south')
      break
    case 'west':
    case 'w':
      this.coords.x -= 1
      GemWarrior.world.set_location()
      GemWarrior._playSFX('go-west')
      break
    }

    return this.coords
  }

  has_item(item_name) {
    return this.inventory.some(inv_item => inv_item.name.toLowerCase() == item_name.toLowerCase())
  }

  list_inventory() {
    let roxCount = ''

    if (this.inventory.rox() === 1) {
      roxCount = ' <strong>1</strong> rock'
    } else {
      roxCount = ` <strong>${this.inventory.rox()}</strong> rox`
    }

    const playerInv = GemWarrior.world.player.inventory
    let invOutput = []

    playerInv.filter(item => item.name != 'rock').forEach(item => {
      invOutput.push(`<span class="noun">a ${item.name}</span>`)
    })

    if (!GemWarrior.world.player.inventory.is_empty()) {
      GemWarrior.config.textOutput = `You have the clothes on your back, ${invOutput.join(', ')}, and <span class="noun">${roxCount}</span>`

      if (GemWarrior.world.player.inventory_checks >= 1) {
        GemWarrior.config.textOutput += '.'
      } else {
        GemWarrior.config.textOutput += '. You also can\'t shake the lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".'

        GemWarrior.world.player.inventory_checks++
      }
    } else {
      GemWarrior.config.textOutput = `You have nothing on your person except the clothes on your back and ${roxCount}`
    }
  }

  /* private */

  _generate_name() {
    let min, max
    const name = []

    // 5 to 10 letters (min and max are inclusive)
    // Math.floor((Math.random() * (max - min + 1) - min))
    min = Math.ceil(5)
    max = Math.floor(10)
    // const letter_max = Math.floor((Math.random() * (max - min + 1) + min))
    const letter_max = 8

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

  // create array of objects (or json strings->objects) to fill current player's inventory items
  _create_inventory(item_list) {
    const item_objects = []

    if (item_list.length) {
      Object.values(item_list).forEach(item => {
        if (typeof item == 'object') {
          item_objects.push(item)
        } else {
          item_objects.push(Utils.create_custom_item(item))
        }
      })
    }

    return new Inventory(item_objects)
  }
}
