class Bucket extends Item {
  constructor() {
    super()

    this.name         = 'bucket'
    this.description  = "A small metal container."
    this.is_filled_with_resin = false
  }

  use() {
    if (this.is_filled_with_resin) {
      return `You look inside the resin-filled <span class="noun">${this.name}</span> and contemplate your decision to look inside the resin-filled <span class="noun">${this.name}</span>.`
    } else {
      return `You look inside the empty <span class="noun">${this.name}</span> and contemplate your decision to look inside the empty <span class="noun">${this.name}</span>.`
    }
  }

  use_with(item_name) {
    let result

    const player_inventory = GemWarrior.world.player.inventory

    switch (item_name) {
      case 'resin':
        if (player_inventory.has_item(item_name)) {
          if (!this.is_filled_with_resin) {
            this.is_filled_with_resin = true

            player_inventory.remove_item('resin')

            this.description = `A small metal container, filled with tree bark <span class="noun">${item_name}</span>.`

            result = `You fill the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span> and discard the bottle.`
          } else {
            result = `The <span class="noun">${this.name}</span> is already full of <span class="noun">${item_name}</span>.`
          }
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      case 'stick':
        if (player_inventory.has_item(item_name)) {
          result = `You bash the <span class="noun">stick</span> with the <span class="noun">${this.name}, making a hollow thudding sound, and splintering the <span class="noun">stick</span> ever so slightly. Perhaps your order of operations is not quite right.`
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      default:
        result = `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`

        break
    }

    return result
  }
}