class Resin extends Item {
  constructor(options = null) {
    super()

    this.name = 'resin'
    this.description = options.description || 'A small flask of what appears to be tree bark resin.'
  }

  use() {
    return 'You open the flask and take a whiff. It smells smoky.'
  }

  use_with(item_name) {
    let result

    const player_inventory = GemWarrior.world.player.inventory

    switch (item_name) {
      case 'bucket':
        if (player_inventory.has_item(item_name)) {
          player_inventory.update_item_description(
            'bucket',
            `A small metal container, filled with tree bark <span class="noun">${this.name}</span>.`
          )

          player_inventory.items.filter((i) => i.name == item_name)[0].is_filled_with_resin = true

          player_inventory.remove_item(this.name)

          result = `You fill the <span class="noun">${item_name}</span> with <span class="noun">${this.name}</span> and discard the bottle.`
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      default:
        result = `You are not able to use the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span>.`

        break
    }

    return result
  }
}
