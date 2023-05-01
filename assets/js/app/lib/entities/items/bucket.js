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
    switch (item_name) {
      case 'resin':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          if (!this.is_filled_with_resin) {
            this.is_filled_with_resin = true
            this.description = `A small metal container, filled with tree bark <span class="noun">${item_name}</span>.`

            return `You fill the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span> and discard the bottle.`
          } else {
            return `The <span class="noun">${this.name}</span> is already full of <span class="noun">${item_name}</span>.`
          }
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }
      case 'stick':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          return `You bash the <span class="noun">stick</span> with the <span class="noun">${this.name}, making a hollow thudding sound, and splintering the <span class="noun">stick</span> ever so slightly. Perhaps your order of operations is not quite right.`
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }
      default:
        return `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`
    }
  }
}