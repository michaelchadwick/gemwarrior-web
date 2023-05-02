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
      this.hp = options.hp
      this.inventory = options.inventory
      this.inventory_checks = options.inventory_checks
      this.coords = options.coords
      this.status = options.status
      this.items_taken = options.items_taken
    } else {
      this.name = ''
      this.level = 1
      this.xp = 0
      this.hp = 10
      // normal
      // this.inventory = new Inventory([
      //   new Rock()
      // ])
      // debug
      // this.inventory = new Inventory([
      //   new Bucket(),
      //   new Cloth(),
      //   new Resin(),
      //   new Rock(),
      //   new Rock(),
      //   new Stick()
      // ])
      this.inventory = new Inventory([
        new Rock(),new Rock(),new Rock(),new Rock(),new Rock(),
        new Rock(),new Rock(),new Rock(),new Rock(),new Rock(),
        new Torch()
      ])
      this.inventory_checks = 0
      this.coords = {
        x: 1, y: 1, z: 0
      },
      this.status = 'standing'
      this.items_taken = 0
    }

    console.log('[LOADED] /app/lib/entities/player')
  }

  describe() {
    return `
      <p>You, the mighty warrior <span class="noun">${GemWarrior.world.player.name}</span>, assess yourself:</p>
      <ul>
        <li>You are wearing a shirt, pants, socks, and shoes. Your fashion sense is satisfactory, without being notable.</li>
        <li>You are <strong>${GemWarrior.world.player.status}</strong>.</li>
        <li>
          You are reasonably healthy, but due to your current location and station, that feeling of heartiness ever diminishes.
        </li>
      </ul>
    `
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

    if (this.rox() === 1) {
      roxCount = ' <strong>1</strong> rock'
    } else {
      roxCount = ` <strong>${this.rox()}</strong> rox`
    }

    const playerInv = GemWarrior.world.player.inventory
    let invOutput = []

    playerInv.filter(item => item.name != 'rock').forEach(item => {
      invOutput.push(`<span class="noun">a ${item.name}</span>`)
    })

    if (!GemWarrior.world.player.inventory.is_empty()) {
      GemWarrior.config.outText = `You have the clothes on your back, ${invOutput.join(', ')}, and <span class="noun">${roxCount}</span>`

      if (GemWarrior.world.player.inventory_checks >= 1) {
        GemWarrior.config.outText += '.'
      } else {
        GemWarrior.config.outText += '. You also can\'t shake the lingering notion that you shouldn\'t have said "Yes" when that sketchy wizard asked if you wanted to "experience something new".'

        GemWarrior.world.player.inventory_checks++
      }
    } else {
      GemWarrior.config.outText = `You have nothing on your person except the clothes on your back and ${roxCount}`
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
}
